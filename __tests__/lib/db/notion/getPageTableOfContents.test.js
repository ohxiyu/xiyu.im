// notion-utils 只发 ESM，而本仓 jest 的 transformIgnorePatterns 是 '/node_modules/' 一刀切，
// 直接 import 会让整个 suite 在加载阶段就 SyntaxError。这里只用到 getTextContent
// ——把 Notion 的富文本 Decoration[] 拍平成纯字符串——用等价实现替掉即可。
// 本文件要验的是目录遍历逻辑，不是富文本解析。
jest.mock('notion-utils', () => ({
  getTextContent: title =>
    Array.isArray(title) ? title.map(([text]) => text ?? '').join('') : ''
}))

import { getPageTableOfContents } from '@/lib/db/notion/getPageTableOfContents'

/**
 * 用最小 recordMap 拼出一棵 block 树。
 * blocks: { [id]: { type, title?, content?, format? } }
 */
const buildRecordMap = blocks => ({
  block: Object.fromEntries(
    Object.entries(blocks).map(([id, b]) => [
      id,
      {
        value: {
          id,
          type: b.type,
          properties: b.title ? { title: [[b.title]] } : undefined,
          content: b.content,
          format: b.format
        }
      }
    ])
  )
})

const page = (id, content) => ({ id, content })

describe('getPageTableOfContents', () => {
  test('普通标题（无子内容）会进入目录', () => {
    const recordMap = buildRecordMap({
      h1: { type: 'header', title: '第一节' },
      p1: { type: 'text', title: '正文' },
      h2: { type: 'sub_header', title: '第一小节' }
    })

    const toc = getPageTableOfContents(page('root', ['h1', 'p1', 'h2']), recordMap)

    expect(toc.map(t => t.text)).toEqual(['第一节', '第一小节'])
  })

  /**
   * 回归用例：折叠标题（toggle heading）。
   * Notion 里把标题折叠后，被折叠的内容会变成该标题块的子节点，
   * 于是这个块「既是标题、又有 content」。
   * 旧实现用 if/else，有 content 就只递归子内容、不收自己，
   * 导致折叠标题在目录里完全消失。
   */
  test('折叠标题（自身是标题且带子内容）必须同时进入目录、并继续深入子内容', () => {
    const recordMap = buildRecordMap({
      toggleH: { type: 'header', title: '可折叠大标题', content: ['inner1', 'innerH'] },
      inner1: { type: 'text', title: '折叠里的正文' },
      innerH: { type: 'sub_header', title: '折叠里的小标题' }
    })

    const toc = getPageTableOfContents(page('root', ['toggleH']), recordMap)

    // 折叠标题自身不能被跳过
    expect(toc.map(t => t.text)).toContain('可折叠大标题')
    // 子内容里的标题也要被找到
    expect(toc.map(t => t.text)).toContain('折叠里的小标题')
    expect(toc).toHaveLength(2)
  })

  test('嵌套在普通容器（如 column）里的标题仍能被找到', () => {
    const recordMap = buildRecordMap({
      col: { type: 'column', content: ['h'] },
      h: { type: 'header', title: '分栏里的标题' }
    })

    const toc = getPageTableOfContents(page('root', ['col']), recordMap)

    expect(toc.map(t => t.text)).toEqual(['分栏里的标题'])
  })

  /**
   * 旧实现里 transclusion_container 分支是死代码：
   * 它要求 content 非空，但能走到那个 else 恰恰说明 content 是空的。
   */
  test('transclusion_container 的子内容会被递归（旧实现里这是走不到的死分支）', () => {
    const recordMap = buildRecordMap({
      container: { type: 'transclusion_container', content: ['h'] },
      h: { type: 'header', title: '同步块里的标题' }
    })

    const toc = getPageTableOfContents(page('root', ['container']), recordMap)

    expect(toc.map(t => t.text)).toEqual(['同步块里的标题'])
  })

  test('transclusion_reference 会跟随指针找到目标块里的标题', () => {
    const recordMap = buildRecordMap({
      ref: {
        type: 'transclusion_reference',
        format: { transclusion_reference_pointer: { id: 'target' } }
      },
      target: { type: 'header', title: '被引用的标题' }
    })

    const toc = getPageTableOfContents(page('root', ['ref']), recordMap)

    expect(toc.map(t => t.text)).toEqual(['被引用的标题'])
  })

  test('同步块互相引用形成环时不会无限递归', () => {
    const recordMap = buildRecordMap({
      a: {
        type: 'transclusion_reference',
        format: { transclusion_reference_pointer: { id: 'b' } }
      },
      b: {
        type: 'transclusion_reference',
        format: { transclusion_reference_pointer: { id: 'a' } }
      }
    })

    expect(() =>
      getPageTableOfContents(page('root', ['a', 'b']), recordMap)
    ).not.toThrow()
  })

  test('同一个标题块被引用多次时只收录一次', () => {
    const recordMap = buildRecordMap({
      wrap: { type: 'column', content: ['h'] },
      h: { type: 'header', title: '唯一标题' }
    })

    const toc = getPageTableOfContents(page('root', ['wrap', 'h']), recordMap)

    expect(toc).toHaveLength(1)
  })

  test('没有任何标题的文章返回空目录（这是正确行为，不是 bug）', () => {
    const recordMap = buildRecordMap({
      p1: { type: 'text', title: '第一段' },
      p2: { type: 'text', title: '第二段' }
    })

    const toc = getPageTableOfContents(page('root', ['p1', 'p2']), recordMap)

    expect(toc).toEqual([])
  })

  test('缩进层级平滑：从 h1 直接跳到 h3 时不会跨级', () => {
    const recordMap = buildRecordMap({
      a: { type: 'heading_1', title: '一级' },
      b: { type: 'heading_3', title: '三级' }
    })

    const toc = getPageTableOfContents(page('root', ['a', 'b']), recordMap)

    expect(toc[0].indentLevel).toBe(0)
    // 实际是 heading_3(indentLevel 2)，但相对上一级只能递进 1 层
    expect(toc[1].indentLevel).toBe(1)
  })
})

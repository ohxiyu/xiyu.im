const fs = require('fs')
const path = require('path')

/**
 * 回归测试：文章详情页的三栏网格布局必须显式声明每一列的位置。
 *
 * 背景 bug：<TOC toc={post.toc} /> 在 post.toc 为空数组时 return null，
 * React 不会为它渲染任何 DOM 节点。此前 .article-layout 只声明了
 * `grid-template-columns`，没有给三个子元素显式声明 grid-column，
 * 于是 CSS Grid 的隐式自动布局会按“现存子元素数量”重新分配轨道：
 * <article> 被挤进本该给 TOC 的 200px 窄列，<ArticleSide> 顶替进
 * 本该给正文的 1fr 宽列，第三条 200px 轨道则空着——表现为标题被压成
 * 一条窄条疯狂换行、侧栏内容紧贴在旁边、右侧一大片空白。
 *
 * 触发条件是“文章没有二级标题”，不是“文章年代久远”；早期文章只是更容易
 * 没写标题所以撞上而已。修复方式是给三个子元素显式声明 grid-column，
 * 使布局不再依赖 DOM 里存在几个子元素。这里用静态断言把这个约束钉住，
 * 防止未来的样式改动在无意中把它们删掉、导致同一个 bug 复发。
 */
describe('article-layout 网格：TOC 为空时不应导致正文错位', () => {
  const cssPath = path.resolve(__dirname, '../../public/css/xiyu.css')
  const css = fs.readFileSync(cssPath, 'utf8')

  // 去掉注释，避免注释里出现的示例代码干扰正则匹配
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, '')

  function ruleBodyFor(selector) {
    // 找到「选择器 { ... }」中第一个匹配的规则体（不跨选择器边界）
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const re = new RegExp(escaped + '\\s*{([^}]*)}')
    const m = clean.match(re)
    return m ? m[1] : null
  }

  test('.article-layout 仍是三栏 grid：200px 1fr 200px', () => {
    const body = ruleBodyFor('.article-layout')
    expect(body).not.toBeNull()
    expect(body).toMatch(/display:\s*grid/)
    expect(body).toMatch(/grid-template-columns:\s*200px\s+1fr\s+200px/)
  })

  test('.toc 显式声明为第一列（TOC 空缺时该列应保持空白，而不是被正文顶替）', () => {
    const body = ruleBodyFor('.toc')
    expect(body).not.toBeNull()
    expect(body).toMatch(/grid-column:\s*1\b/)
  })

  test('article-layout 内的 <article> 显式声明为第二列（不依赖 DOM 顺序推断）', () => {
    const body = ruleBodyFor('.article-layout > article')
    expect(body).not.toBeNull()
    expect(body).toMatch(/grid-column:\s*2\b/)
  })

  test('.article-side 显式声明为第三列（TOC 缺失时不应被自动挤到第二列）', () => {
    const body = ruleBodyFor('.article-side')
    expect(body).not.toBeNull()
    expect(body).toMatch(/grid-column:\s*3\b/)
  })

  test('CSS 文件括号配对平衡（本次编辑未破坏文件结构）', () => {
    const open = (clean.match(/{/g) || []).length
    const close = (clean.match(/}/g) || []).length
    expect(open).toBe(close)
  })
})

import { getTextContent } from 'notion-utils'

const indentLevels = {
  header: 0,
  sub_header: 1,
  sub_sub_header: 2,
  heading_1: 0,
  heading_2: 1,
  heading_3: 2,
  heading_4: 3,
  header_4: 3
}

const unknownHeadingStats = new Map()

/**
 * @see https://github.com/NotionX/react-notion-x/blob/master/packages/notion-utils/src/get-page-table-of-contents.ts
 * Gets the metadata for a table of contents block by parsing the page's
 * H1, H2, and H3 elements.
 */
export const getPageTableOfContents = (page, recordMap) => {
  const pageId = page?.id
  if (process.env.NODE_ENV !== 'production' && pageId) {
    unknownHeadingStats.set(pageId, 0)
  }
  const contents = page.content ?? []
  const toc = getBlockHeader(contents, recordMap, [], pageId)
  const indentLevelStack = [
    {
      actual: -1,
      effective: -1
    }
  ]

  // Adjust indent levels to always change smoothly.
  // This is a little tricky, but the key is that when increasing indent levels,
  // they should never jump more than one at a time.
  for (const tocItem of toc) {
    const actual = Number.isInteger(tocItem.indentLevel) ? tocItem.indentLevel : 0

    do {
      const prevIndent = indentLevelStack[indentLevelStack.length - 1]
      if (!prevIndent) {
        tocItem.indentLevel = 0
        indentLevelStack.push({
          actual,
          effective: 0
        })
        break
      }
      const { actual: prevActual, effective: prevEffective } = prevIndent

      if (actual > prevActual) {
        tocItem.indentLevel = prevEffective + 1
        indentLevelStack.push({
          actual,
          effective: tocItem.indentLevel
        })
      } else if (actual === prevActual) {
        tocItem.indentLevel = prevEffective
        break
      } else {
        indentLevelStack.pop()
      }

      // eslint-disable-next-line no-constant-condition
    } while (true)
  }

  if (process.env.NODE_ENV !== 'production' && pageId) {
    const unknownCount = unknownHeadingStats.get(pageId) || 0
    if (unknownCount > 0) {
      console.warn('[TOC] unknown heading summary', { pageId, unknownCount })
    }
    unknownHeadingStats.delete(pageId)
  }

  return toc
}

/**
 * 重写获取目录方法
 *
 * ⚠️ 这里必须把「这个块本身是不是标题」和「这个块有没有子内容」当成两件独立的事。
 *
 * 旧实现写成了 if/else：有子内容就只递归子内容，否则才判断是不是标题。
 * 结果是「既是标题、又带子内容」的块永远进不了目录——而 Notion 的
 * 可折叠标题（toggle heading）正是这种结构：折叠起来的内容会成为该标题的子节点。
 * 于是用户在 Notion 里用折叠标题写的小标题，网站上的目录里一个都不会出现。
 *
 * 同样的 if/else 还让 transclusion_container 分支变成了死代码：它要求
 * content 非空，但能走到 else 恰恰说明 content 是空的。
 */
function getBlockHeader(contents, recordMap, toc, pageId, visited) {
  if (!toc) {
    toc = []
  }
  if (!contents) {
    return toc
  }

  if (!Array.isArray(contents)) {
    return toc
  }

  // 同步块（transclusion）可能互相指向，形成环；不设防会无限递归爆栈
  if (!visited) {
    visited = new Set()
  }

  for (const blockId of contents) {
    if (visited.has(blockId)) {
      continue
    }
    visited.add(blockId)

    const block = recordMap.block[blockId]?.value
    if (!block) {
      continue
    }
    const { type } = block
    const isHeading =
      typeof type === 'string' &&
      (type.indexOf('header') >= 0 || /^heading_[1234]$/.test(type))

    // ① 先处理这个块自身：是标题就收进目录，不管它有没有子内容
    if (isHeading) {
      const existed = toc.find(e => e.id === blockId)
      const indentLevel = indentLevels[type]
      if (Number.isInteger(indentLevel)) {
        if (!existed) {
          toc.push({
            id: blockId,
            type,
            text: getTextContent(block.properties?.title),
            indentLevel
          })
        }
      } else if (process.env.NODE_ENV !== 'production') {
        // Emit debug signal only in development for quick reproduction.
        if (pageId) {
          unknownHeadingStats.set(
            pageId,
            (unknownHeadingStats.get(pageId) || 0) + 1
          )
        }
        console.warn('[TOC] unknown heading type', {
          pageId,
          blockId,
          type,
          title: getTextContent(block.properties?.title),
          parentId: block.parent_id
        })
      }
    } else if (
      type === 'transclusion_reference' &&
      block.format?.transclusion_reference_pointer?.id
    ) {
      // 同步块引用：跟着指针去它指向的块里找标题
      getBlockHeader(
        [block.format.transclusion_reference_pointer.id],
        recordMap,
        toc,
        pageId,
        visited
      )
    }

    // ② 再处理子内容：与自身是不是标题无关，有子块就往下找
    if (Array.isArray(block.content) && block.content.length > 0) {
      getBlockHeader(block.content, recordMap, toc, pageId, visited)
    }
  }

  return toc
}

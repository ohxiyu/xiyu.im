const toUuid = id => {
  const s = String(id || '').toLowerCase()
  return /^[a-f0-9]{32}$/.test(s)
    ? `${s.slice(0, 8)}-${s.slice(8, 12)}-${s.slice(12, 16)}-${s.slice(16, 20)}-${s.slice(20)}`
    : s
}

/**
 * 按 Notion ID 直接拉到的页面，只有挂在本站页面之下才渲染：
 * 沿 parent_id 往上走，能走到一篇已发布 / 隐藏的文章或页面才算本站内容。
 * 否则任何人拿到工作区里别的页面 ID（草稿、私人笔记），就能借本站域名把它渲染出来。
 */
export function isPageInSite(post, allPages) {
  const blocks = post?.blockMap?.block || {}
  const known = new Set(
    (allPages || [])
      .filter(p => p?.id && (p.status === 'Published' || p.status === 'Invisible'))
      .map(p => toUuid(p.id))
  )
  let parentId = blocks[toUuid(post?.id)]?.value?.parent_id || blocks[post?.id]?.value?.parent_id
  for (let hop = 0; parentId && hop < 20; hop++) {
    const id = toUuid(parentId)
    if (known.has(id)) return true
    parentId = blocks[id]?.value?.parent_id || blocks[parentId]?.value?.parent_id
  }
  return false
}

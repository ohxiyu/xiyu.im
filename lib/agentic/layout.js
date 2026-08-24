export const getDirectXiyuLayoutName = ({ theme, layoutName, post }) => {
  if (theme !== 'xiyu') return null
  if (layoutName === 'LayoutBase') return layoutName
  if (layoutName === 'Layout404') return layoutName
  if (layoutName === 'LayoutInfoPage') return layoutName
  if (layoutName === 'LayoutSlug' && post?.slug === 'about') return layoutName
  return null
}

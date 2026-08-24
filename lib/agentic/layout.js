export const getDirectXiyuLayoutName = ({ theme, layoutName, post }) => {
  if (theme !== 'xiyu') return null
  if (layoutName === 'LayoutInfoPage') return layoutName
  if (layoutName === 'LayoutSlug' && post?.slug === 'about') return layoutName
  return null
}

const CONFIG = {
  // xiyu 主题配置
  XIYU_FOOT_QUOTE: 'xiyu.im · 长期主义 · 记录思考', // 页脚副文案
  XIYU_NAV_TWITTER: process.env.NEXT_PUBLIC_CONTACT_TWITTER || '', // 导航栏 Twitter 链接，空则隐藏
  XIYU_HOME_SHOW_FEATURED: true, // 首页是否展示第一篇大卡
  XIYU_HOME_NOW_SLUG: 'now', // 首页 "Now 最近在想" 卡引用的 Notion page slug，读不到时 fallback 到最新文章 summary
  XIYU_ACCENT: '#e67e22', // 主 accent 色（可在这里改）
  XIYU_ACCENT_DARK: '#f39c3e' // 深色模式 accent 色
}

export default CONFIG

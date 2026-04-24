const CONFIG = {
  // —— 首页 Hero 区配置 ——
  XIYU_BITCOIN_YEARS: 7, // Hero 第三个数字 "Long BTC" 显示的年数

  // —— 关于页 ——
  XIYU_ABOUT_GLYPH: '₿', // 关于页肖像区的大字（原设计稿是"羽"）
  XIYU_ABOUT_LOCATION: 'Based in anywhere', // 肖像下方 caption 第二行

  // —— 页脚 ——
  XIYU_FOOT_QUOTE: '长期主义 · 记录思考', // 页脚副文案

  // —— 导航栏 ——
  XIYU_NAV_TWITTER: '', // Twitter 链接，空则隐藏（也可通过 NEXT_PUBLIC_CONTACT_TWITTER 提供）
  XIYU_NAV_TAGLINE: 'long · bitcoin', // brand 旁的等宽副标

  // —— Now 卡 ——
  XIYU_NOW_SLUG: 'now' // 首页 Now 卡引用的 Notion page slug，读不到时 fallback 到最新文章 summary
}
export default CONFIG

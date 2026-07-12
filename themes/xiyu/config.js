const CONFIG = {
  // —— 首页 Hero 区配置 ——
  XIYU_BITCOIN_YEARS: 7, // Hero 第三个数字 "Long BTC" 显示的年数
  // Hero 副文案下方：从最近文章 tags 里聚合 N 个关键词显示"在想：xxx · xxx"
  XIYU_HERO_TOPICS_FROM: 8, // 取最近 N 篇文章聚合
  XIYU_HERO_TOPICS_LIMIT: 5, // 最多显示几个关键词

  // —— 关于页 ——
  // 正文段落自动读 Notion 里 slug='about' 的页面（只取文本段落）；读不到时用内置默认文案
  XIYU_ABOUT_GLYPH: '₿', // 关于页肖像区的大字（原设计稿是"羽"）
  XIYU_ABOUT_LOCATION: 'Based in anywhere', // 肖像下方 caption 第二行

  // —— 页脚 ——
  XIYU_FOOT_QUOTE: '长期主义 · 记录思考', // 页脚副文案
  XIYU_FOOT_STACK: 'Notion × NotionNext × Vercel', // 页脚技术栈一行字（原关于页 Colophon 压缩版），空字符串则隐藏

  // —— 导航栏 / 联系方式 ——
  // Twitter 链接：Nav 的 'Twitter ↗' 和关于页 Elsewhere 共用；也可用环境变量 NEXT_PUBLIC_CONTACT_TWITTER 覆盖
  XIYU_NAV_TWITTER: 'https://x.com/ohixyu',
  XIYU_NAV_TAGLINE: 'long · bitcoin', // brand 旁的等宽副标

  // —— Now 卡 ——
  XIYU_NOW_SLUG: 'now' // 首页 Now 卡引用的 Notion page slug，读不到时 fallback 到最新文章 summary
}
export default CONFIG

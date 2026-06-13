const CONFIG = {
  // —— 首页 Hero 区配置 ——
  XIYU_BITCOIN_YEARS: 7, // Hero 第三个数字 "Long BTC" 显示的年数

  // 大标题下方的轮换语录池（每 6 秒淡入淡出切换，点击翻下一句）
  // 想换/加直接编辑此数组，不需要改其他文件
  XIYU_HERO_TAGLINES: [
    '长期主义不是慢，是不被节奏带跑。',
    '写作是给三年后的自己留信。',
    '信号比噪声重要——比特币是慢信号。',
    'AI 让效率指数化，但判断力还是人。',
    '复利的前提：先活下来，然后熬下去。',
    '凡是值得做的事，做错也比不做好。',
    '比起预测未来，更值得练好等待。',
    '工具变了三轮，问题还是那几个。',
    '少一点观点，多一点观察。',
    '把时间花在 5 年后还存在的东西上。'
  ],

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

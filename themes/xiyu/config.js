const CONFIG = {
  // —— 首页 Hero 区配置 ——
  // Hero 副文案下方：从最近文章 tags 里聚合 N 个关键词显示"在想：xxx · xxx"
  XIYU_HERO_TOPICS_FROM: 8, // 取最近 N 篇文章聚合
  XIYU_HERO_TOPICS_LIMIT: 5, // 最多显示几个关键词

  // 大标题的「旧文重读」：跳过最近 N 篇（它们已经在下方列表里露脸了），
  // 从接下来的 M 篇里按天轮换一篇。调小 SKIP 会让 hero 和列表重复。
  XIYU_HERO_SKIP_RECENT: 3,
  XIYU_HERO_POOL: 40,

  // —— 关于页 ——
  XIYU_ABOUT_LOCATION: 'Based in anywhere', // 头部第三个标签

  // 时间轴：年份与小标题写在这里，正文按顺序取 Notion about 页的段落
  // （第 1/2/3 段 → 第 1/2/3 个时期）。段落不够时用 fallback。
  // ⚠️ 改 Notion 里 about 页的段落顺序会影响这里的对应关系。
  XIYU_ABOUT_TIMELINE: [
    {
      when: '2013 – 2022',
      title: '交易员',
      fallback:
        '做了十年交易，追过热点，也在维权群里见过别人的兴衰。后来想明白一件事：我根本就不该做交易。现在只观察，不预测，不参与。这个转变没什么戏剧性，就是亏够了。'
    },
    {
      when: '2023 – 2025',
      title: '比特币生态的一线记录',
      fallback:
        'ordinals 刚出来的时候我自己搭全节点铸铭文，从 Bitcoin Core 装起，一路写到 2-of-3 多签冷钱包的完整实施手册。这些文章现在看有些结论已经过时，但操作步骤和当时的判断都留在原处——日期就是它们的免责声明。'
    },
    {
      when: '2026 —',
      title: '用 AI Agent 给自己造系统',
      fallback:
        '日记、读书提炼、健康管理、邮件助理、比特币定投，这些原本要手动做的事现在跑在一套多 Agent 系统里。造的过程比结果更值得写，踩过的坑我都写了。'
    }
  ],
  XIYU_ABOUT_TOPICS: ['比特币', 'AI Agent', '自托管', '投资'], // 时间轴卡片底部的标签

  // 拆问题的三个框架
  XIYU_ABOUT_METHODS: [
    { icon: 'rank', name: '秩分析', desc: '找出最少的独立变量，其余都是它们的线性组合。' },
    { icon: 'first', name: '第一性原理', desc: '拆到不可再拆的事实，然后从零重建。' },
    { icon: 'lens', name: '人性透镜', desc: '看激励从哪来——谁在为什么样的结果买单。' }
  ],
  XIYU_ABOUT_METHODS_NOTE:
    '它们不保证结论对，但能逼我把假设写出来——这样错了以后，知道是错在哪一步。',

  // —— 页脚 ——
  XIYU_FOOT_QUOTE: '长期主义 · 记录思考', // 页脚副文案
  XIYU_FOOT_STACK: 'Notion × NotionNext × Vercel', // 页脚技术栈一行字（原关于页 Colophon 压缩版），空字符串则隐藏

  // —— 导航栏 / 联系方式 ——
  // X 链接：Nav 的 X 图标和关于页 Elsewhere 共用；也可用环境变量 NEXT_PUBLIC_CONTACT_TWITTER 覆盖
  // ⚠️ 原值是 ohixyu，与 GitHub 用户名和文章里的署名（ohxiyu）不一致，判定为笔误已更正
  XIYU_NAV_TWITTER: 'https://x.com/ohxiyu',
  // —— Now 卡 ——
  // 首页「Now · 最近在想」引用的 Notion page slug。
  // ⚠️ 读不到这个页面时会回落到最新文章的 summary，那段摘要于是在首页出现两次
  //（这张卡 + 列表大卡）。在 Notion 里建一篇 slug=now 的页面就能消掉。
  XIYU_NOW_SLUG: 'now',

  // brand 旁的等宽副标。2013 = 进加密货币行业那年，写死不跟 SINCE 走——
  // SINCE 在 blog.config.js 里是 2021，线上靠 NEXT_PUBLIC_SINCE 覆盖成 2013，
  // 万一那个环境变量没了，副标不该跟着变成 2021。留空则回退到 `since · ${SINCE}`。
  XIYU_NAV_TAGLINE: 'since 2013'
}
export default CONFIG

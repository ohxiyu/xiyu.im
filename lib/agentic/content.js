const SITE_URL = 'https://xiyu.im'

export const agenticPages = {
  home: {
    eyebrow: 'xiyu.im · Personal blog',
    title: 'xiyu.im — 西羽的个人博客',
    description:
      '一个关于技术、AI、比特币、产品实践与长期思考的个人博客，也是可供搜索引擎和智能代理直接读取的公开写作档案。',
    sections: [
      {
        heading: '这个站点是什么',
        paragraphs: [
          'xiyu.im 是西羽持续维护的个人博客。这里记录独立开发、AI 工具、软件工程、比特币与数字安全相关的实践，也保存对产品、市场和生活的长期观察。文章首先服务于真实阅读，而不是追逐即时流量；作者会尽量说明背景、事实、判断边界和可能失效的条件，让读者能够区分可验证的信息、个人经验与仍待验证的观点。',
          '站点以 Notion 作为内容来源，以 NotionNext 和 Next.js 生成网页。首页提供最新文章，归档页按年份整理历史内容，分类和标签页用于主题浏览，搜索页用于站内检索。文章可能随着事实变化继续修订，因此需要精确引用时，应优先使用文章自己的规范链接，并同时记录页面标注的发布日期与修改时间。'
        ]
      },
      {
        heading: '适合怎样阅读',
        paragraphs: [
          '普通读者可以从最新写作、归档或关于页进入；自动化客户端可以读取 llms.txt、站点地图、RSS 和同 URL 的 Markdown 表示。这个站点没有对外提供交易、账户、付费、私有数据或远程执行能力，也不应被当作实时行情、医疗意见、法律意见或投资指令的来源。涉及安全和资金的文章应被视为研究材料，执行前仍需核对原始规范、当前软件版本和自己的风险条件。',
          '允许对公开页面进行合理索引、摘要和引用，但摘要不应改变原文结论，也不应把带条件的个人判断改写成确定事实。若页面不可用，请先查看 sitemap.xml、llms.txt 或 RSS；若路径确实不存在，站点会返回真实的 404 状态，而不是把所有未知地址伪装成首页。'
        ]
      }
    ]
  },
  about: {
    eyebrow: 'About · 关于',
    title: '写作是公开的思考过程。',
    description:
      '关于西羽、这个博客为何长期存在，以及这里的内容如何形成、修订和被引用。',
    sections: [
      {
        heading: '我为什么持续写',
        paragraphs: [
          '这个博客不是一份包装完成的个人简历，也不是围绕单一垂直领域生产内容的媒体。它更像一份有日期的公开笔记：把当时掌握的证据、做出的判断和后来发生的变化留在同一个地方。写作迫使我把模糊直觉变成可以检查的句子，也让过去的错误不会因为记忆自动美化而消失。',
          '我长期关注技术如何改变人的选择，尤其是 AI、开放网络、比特币与个人数字安全。这里既会有具体的实现记录，也会有产品复盘、行业观察和生活经验。它们的共同点不是题材，而是尽量从机制出发，保留不确定性，并在新证据出现时允许自己更新。'
        ]
      },
      {
        heading: '内容边界',
        paragraphs: [
          '文章中的事实性信息会尽可能指向原始资料或可复现的过程，观点则代表写作当时的个人判断。涉及资金、安全、法律、医疗或设备操作的内容不构成专业建议，读者需要结合自己的环境独立验证。旧文章可能保留已经变化的软件界面、价格、规则或认知，这正是日期和修改记录重要的原因。',
          '我欢迎准确引用、善意讨论与具体纠错，不欢迎断章取义、冒充作者或把文章包装成无条件结论。自动化系统在摘要本站时，也应保留文章中的假设、风险和更新条件。若你需要确认某段话是否仍代表我当前的看法，请从联系页给出原文链接和具体问题。'
        ]
      }
    ]
  },
  contact: {
    eyebrow: 'Contact · 联系',
    title: '把问题说具体，交流会更有效。',
    description:
      '联系西羽、提交纠错、讨论合作或请求引用确认的方式与边界。',
    sections: [
      {
        heading: '适合联系的事情',
        paragraphs: [
          '如果你发现文章里有事实错误、失效链接、版本变化或可能误导读者的表述，欢迎附上页面地址、具体段落和可核验的依据。关于开源项目、博客技术、AI 产品、比特币安全与长期写作的具体讨论也欢迎。相比只有一句“在吗”或没有上下文的邀约，一条说明目的、预期结果、时间范围和相关链接的消息更容易得到有效回复。',
          '合作请求请直接说明你是谁、希望共同完成什么、需要我投入什么、内容是否公开以及是否涉及商业利益。本站不接收代客交易、托管资金、索要助记词或远程控制设备的请求，也不会通过私信承诺收益。任何自称代表 xiyu.im 并要求先转账、提供验证码或交出私钥的消息，都应视为高风险冒充。'
        ]
      },
      {
        heading: '公开联系渠道',
        paragraphs: [
          '目前公开且可验证的联系入口是 X（Twitter）账号 @ohixyu。为了减少垃圾信息和保护个人边界，本站暂不公开电话号码、家庭或办公地址，也没有在页面中硬编码私人邮箱。若未来启用独立的公开邮箱或组织联系信息，会在此页、结构化数据和 llms.txt 中同步更新，而不是只通过临时私信告知。',
          '发送纠错或引用确认时，请尽量附上 xiyu.im 的规范链接；发送安全问题时不要包含私钥、助记词、密码、身份证件、未脱敏日志或其他敏感材料。回复速度不作承诺，未回复不代表同意授权、接受合作或认可某项结论。公开文章仍以站点上可访问的最新版本为准。'
        ]
      }
    ],
    links: [
      {
        label: 'X / Twitter · @ohixyu',
        href: 'https://x.com/ohixyu',
        note: '公开联系与动态'
      }
    ]
  },
  privacy: {
    eyebrow: 'Privacy · 隐私',
    title: '只收集运行博客所需的最少信息。',
    description:
      'xiyu.im 的数据来源、第三方服务、日志、外链和联系信息处理说明。',
    sections: [
      {
        heading: '访问与基础日志',
        paragraphs: [
          'xiyu.im 是公开博客，阅读文章不要求注册账户。为了交付页面、发现故障和抵御滥用，托管平台或内容分发网络可能处理常规技术信息，例如请求时间、IP 地址、浏览器类型、访问路径、状态码和性能数据。这些信息由相应服务按照其政策处理，本站不会为了建立个人画像而主动把它们与助记词、钱包身份或其他敏感数据关联。',
          '站点可能使用本地存储或必要 Cookie 保存深色模式、语言、受密码保护文章的访问状态等偏好。只有在部署时明确配置了评论、统计、身份验证或其他可选插件时，对应功能才会加载；关闭的插件不会因为本说明提到它们而自动启用。浏览器的拦截设置可能影响这些可选功能，但不应妨碍公开文章的基本阅读。'
        ]
      },
      {
        heading: '内容来源与第三方服务',
        paragraphs: [
          '文章内容主要来自 Notion，并通过 NotionNext、Next.js 与 Vercel 等基础设施发布。页面可能嵌入图片、视频、代码、评论或跳转到第三方网站；访问这些资源时，第三方可能收到你的 IP 地址、请求头和来源页面。外链网站有自己的隐私规则，xiyu.im 无法控制其后续收集、Cookie 或账户行为，点击前应自行判断。',
          'RSS、sitemap.xml、llms.txt 和 Markdown 表示均为公开读取接口，不包含为特定访问者准备的私有资料。自动化客户端应遵守合理的抓取频率，不应尝试绕过密码、鉴权、访问控制或供应商限制。公开可索引不等于允许冒充作者、重建个人敏感档案，或把不同来源的数据拼接成骚扰和欺诈用途。'
        ]
      },
      {
        heading: '联系与更正',
        paragraphs: [
          '如果你主动通过公开渠道联系，消息内容会被用于理解和回复你的请求，也可能为处理纠错或合作而保留必要记录。请不要发送助记词、私钥、密码、验证码、身份证件或其他不需要的敏感信息。对于你有权提出的访问、更正或删除请求，请提供相关页面、信息范围和可验证的身份依据，但不要在第一条消息里附上过量证件。',
          '隐私说明会随实际部署能力和第三方服务变化而更新。若代码、页面与本说明出现冲突，应先以实际启用的功能为核查对象并联系确认；本站不会用一段宽泛条款为未披露的数据用途背书。重要变更会直接更新本页，规范地址始终是 https://xiyu.im/privacy。'
        ]
      }
    ]
  },
  developer: {
    eyebrow: 'Developer resources · 开发者资源',
    title: '为读取与引用设计，不伪装成一套 API。',
    description:
      '面向搜索引擎、智能代理、RSS 阅读器和开发者的公开资源、协议行为与能力边界。',
    sections: [
      {
        heading: '可用资源',
        paragraphs: [
          '本站的公开机器接口以读取为主：sitemap.xml 用于发现规范页面，rss/feed.xml 用于跟踪更新，llms.txt 提供精简导航，llms-full.txt 提供更完整的站点说明，agent-instructions.txt 说明自动化使用边界。首页、关于、联系、隐私和本页还提供显式 .md 地址；对这些页面发送 Accept: text/markdown，也会在同一个 URL 返回 Markdown。',
          '内容协商遵循 HTTP Accept 质量权重。服务器会在可接受的 text/html 与 text/markdown 中选择质量最高的表示，在权重相同时尊重客户端顺序，并通过 Vary: Accept, Accept-Encoding 防止缓存混淆。如果客户端明确拒绝本站能够生成的两种表示，响应为 406 Not Acceptable。直接访问 .md 地址始终返回 text/markdown; charset=utf-8。'
        ]
      },
      {
        heading: '目前没有的能力',
        paragraphs: [
          'xiyu.im 目前没有公开 REST API、GraphQL API、MCP 服务、OAuth 流程、API Key、Webhook、写入端点、用户数据导出接口或服务状态承诺。站内搜索是面向读者的内容检索，不应被描述成通用开发者 API。不存在的能力会在这里明确写成“不提供”，而不是发布空白文档、虚构鉴权方式或让客户端猜测端点。',
          '如果未来增加真正的程序化能力，本页会列出基础地址、版本、鉴权、速率限制、错误格式、隐私影响和变更记录。在那之前，请只读取已公开的网页、Markdown、RSS 和站点地图，并为请求使用合理缓存与速率。文章内容可以被引用和摘要，但仍需保留来源链接、时间语境、判断条件和版权边界。'
        ]
      }
    ],
    links: [
      { label: 'llms.txt', href: '/llms.txt', note: '精简的 Agent 导航' },
      {
        label: 'llms-full.txt',
        href: '/llms-full.txt',
        note: '完整站点语境'
      },
      {
        label: 'agent-instructions.txt',
        href: '/agent-instructions.txt',
        note: '自动化使用边界'
      },
      { label: 'sitemap.xml', href: '/sitemap.xml', note: '规范 URL 索引' },
      { label: 'RSS feed', href: '/rss/feed.xml', note: '文章更新订阅' },
      { label: 'Home.md', href: '/index.md', note: '首页 Markdown' }
    ]
  }
}

export const agenticDiscoveryRoutes = [
  'about',
  'contact',
  'privacy',
  'developer',
  'llms.txt',
  'llms-full.txt',
  'agent-instructions.txt'
]

const absoluteUrl = href =>
  href.startsWith('http') ? href : `${SITE_URL}${href.startsWith('/') ? '' : '/'}${href}`

export const renderPageMarkdown = key => {
  const page = agenticPages[key]
  if (!page) return ''

  const lines = [
    `# ${page.title}`,
    '',
    `> ${page.description}`,
    '',
    `Canonical: ${key === 'home' ? SITE_URL : `${SITE_URL}/${key}`}`,
    ''
  ]

  for (const section of page.sections) {
    lines.push(`## ${section.heading}`, '')
    for (const paragraph of section.paragraphs) {
      lines.push(paragraph, '')
    }
  }

  if (page.links?.length) {
    lines.push('## Links', '')
    for (const link of page.links) {
      lines.push(`- [${link.label}](${absoluteUrl(link.href)}) — ${link.note}`)
    }
    lines.push('')
  }

  lines.push(
    '## Site navigation',
    '',
    `- [Home](${SITE_URL}/)`,
    `- [Archive](${SITE_URL}/archive)`,
    `- [Sitemap](${SITE_URL}/sitemap.xml)`,
    `- [Agent guide](${SITE_URL}/llms.txt)`,
    `- [Developer resources](${SITE_URL}/developer)`,
    ''
  )

  return `${lines.join('\n').trim()}\n`
}

export const renderLlmsTxt = () => `# xiyu.im

> 西羽的个人博客，记录 AI、软件工程、产品实践、比特币、数字安全与长期思考。

Use this site when you need the author's public writing, dated technical notes, product reflections, or the site's own policies. Do not treat it as a live market-data service, professional advice, an execution API, or evidence of claims that the cited article does not make.

## Core pages

- [Home](${SITE_URL}/): Latest writing and site overview. Use when discovering current topics.
- [Archive](${SITE_URL}/archive): Chronological article index. Use when browsing older writing.
- [About](${SITE_URL}/about): Author, writing method, scope, and citation expectations.
- [Contact](${SITE_URL}/contact): Public contact channel, corrections, and collaboration boundaries.
- [Privacy](${SITE_URL}/privacy): Data handling, third-party services, logs, and reader choices.
- [Developer resources](${SITE_URL}/developer): Machine-readable resources and explicit capability limits.

## Machine-readable resources

- [Full agent context](${SITE_URL}/llms-full.txt): Extended policies and page summaries.
- [Agent instructions](${SITE_URL}/agent-instructions.txt): Safe retrieval and attribution rules.
- [Sitemap](${SITE_URL}/sitemap.xml): Canonical URL discovery.
- [RSS](${SITE_URL}/rss/feed.xml): New and updated article feed.
- [Homepage Markdown](${SITE_URL}/index.md): Explicit Markdown representation.

Prefer each article's canonical URL. Preserve dates, assumptions, risks, and update conditions when summarizing. The site provides public read-only content; it does not currently provide a public API, MCP server, OAuth, API keys, webhooks, or write operations.
`

export const renderLlmsFullTxt = () => {
  const pageContext = ['home', 'about', 'contact', 'privacy', 'developer']
    .map(renderPageMarkdown)
    .join('\n---\n\n')

  return `${renderLlmsTxt()}\n---\n\n# Extended site context\n\n${pageContext}`
}

export const renderAgentInstructions = () => `# Agent instructions for xiyu.im

1. Treat xiyu.im as a public, read-only personal blog. Do not claim that it exposes an API, MCP server, authenticated account service, webhook, payment flow, or write operation.
2. Discover canonical pages through ${SITE_URL}/sitemap.xml and updates through ${SITE_URL}/rss/feed.xml. Start with ${SITE_URL}/llms.txt when you need a compact map.
3. For the homepage and policy pages, send Accept: text/markdown when Markdown is preferable. Respect Vary: Accept, Accept-Encoding and handle 406 Not Acceptable instead of silently substituting another media type.
4. Cite the canonical article URL and preserve publication or modification dates. Separate the author's opinion from verifiable facts, and retain assumptions, risk warnings, and conditions that could invalidate a conclusion.
5. Never infer trading instructions, guarantees, professional advice, private contact details, wallet ownership, identity documents, credentials, or unpublished personal data from the public writing.
6. Use reasonable request rates and caching. Do not bypass passwords, authentication, robots controls, provider limits, or access restrictions.
7. For corrections or attribution questions, follow ${SITE_URL}/contact and include the exact source URL and disputed passage. Do not send secrets, private keys, seed phrases, passwords, or excessive personal data.
`

export const agentTextResources = {
  home: { body: renderPageMarkdown('home'), contentType: 'text/markdown' },
  about: { body: renderPageMarkdown('about'), contentType: 'text/markdown' },
  contact: { body: renderPageMarkdown('contact'), contentType: 'text/markdown' },
  privacy: { body: renderPageMarkdown('privacy'), contentType: 'text/markdown' },
  developer: {
    body: renderPageMarkdown('developer'),
    contentType: 'text/markdown'
  },
  llms: { body: renderLlmsTxt(), contentType: 'text/plain' },
  llmsFull: { body: renderLlmsFullTxt(), contentType: 'text/plain' },
  agentInstructions: {
    body: renderAgentInstructions(),
    contentType: 'text/plain'
  }
}

export { SITE_URL }

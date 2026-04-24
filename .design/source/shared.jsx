// Shared post data + nav + footer + article cards
// Loaded as a Babel script — exports to window for other scripts to use.

const POSTS = [
  {
    num: "0155",
    date: "2026-04-23",
    title: "OKB 爆量动量 + 自适应网格策略：设计逻辑全拆解",
    tags: ["AI/技术", "AI Agent", "自动化"],
    excerpt: "参加 OKX AI 交易大赛，用 AI 搭了一套全自动合约交易系统。双模式互斥切换（震荡跑网格 + 爆量做多），量能衰竭止盈，只看两个变量，纪律本身就是 alpha。",
    slug: "okb-momentum-grid-strategy-breakdown",
    featured: true,
  },
  {
    num: "0154",
    date: "2026-04-15",
    title: "AI 交易的护城河不是 Alpha，是纪律",
    tags: ["AI/技术", "AI Agent", "自动化"],
    excerpt: "用 AI 搭了个全自动合约交易代理参加 OKX 大赛，拆解双模式切换的设计逻辑、量能衰竭止盈的核心思路，以及为什么纪律本身就是 alpha。",
    slug: "ai-trading-moat-is-discipline",
  },
  {
    num: "0153",
    date: "2026-04-12",
    title: "Runes 不是发 Memecoin 的工具，它是比特币的「区块空间续命丸」",
    tags: ["第一性原理", "比特币", "符文"],
    excerpt: "市场给 Runes 的定价是「发 memecoin 的基础设施」，但从第一性原理推导，它真正的身份是比特币区块空间的需求引擎——减半后矿工安全预算问题的市场化回应。",
    slug: "runes-protocol-first-principles",
  },
  {
    num: "0152",
    date: "2026-04-05",
    title: "OpenClaw 踩坑记：Kimi 模型工具调用标记泄漏到用户对话",
    tags: ["AI/技术", "OpenClaw", "AI Agent"],
    excerpt: "使用 Kimi 模型的 OpenClaw agent 在 Discord/Telegram 对话中泄漏内部工具调用标记的问题分析与解决方案。",
    slug: "openclaw-kimi-tool-call-leakage",
    flag: "🔧",
  },
  {
    num: "0151",
    date: "2026-04-02",
    title: "人性透镜｜减肥",
    tags: ["思考", "健康"],
    excerpt: "减肥难，不是因为你不够自律，而是减肥这件事，本来就在和人性的默认设置对着干。人更擅长追求立刻的确定性奖励，不擅长坚持几个月后才兑现的抽象回报。",
    slug: "336a745569bb8163994be2fd96036645",
  },
  {
    num: "0150",
    date: "2026-04-01",
    title: "如何把健康模块从「数据仓库」改成「行动引擎」",
    tags: ["教程", "工具", "OpenClaw"],
    excerpt: "一个可复用的健康系统改造思路：怎么把健康模块从「记账本」改成真正能推动你行动的版本。我把它叫做健康模块 v2。",
    slug: "335a745569bb81b4a4c7cc11716f1cdf",
  },
  {
    num: "0149",
    date: "2026-03-23",
    title: "让 AI 帮你处理邮件：多账户 Gmail 助理实战",
    tags: ["邮件", "Gmail", "AI Agent"],
    excerpt: "每天打开邮箱，几十封未读。促销、通知、自动化报告、真正需要回的——全混在一起。你花 20 分钟筛完，回了 3 封，标记了 2 个待办。",
    slug: "32ca745569bb81e4b757fe651ac90622",
  },
  {
    num: "0148",
    date: "2026-03-20",
    title: "为什么 95% 的人炒币注定亏钱",
    tags: ["投资", "加密货币", "BTC"],
    excerpt: "我在币圈待了快七年。2017 年冲过 ICO，2021 年追过 NFT，中间还玩过合约。回头看，最大的教训不是买错了哪个币，而是——我根本就不该炒。",
    slug: "329a745569bb811888a8c80055c387ad",
  },
  {
    num: "0147",
    date: "2026-03-19",
    title: "让 AI Agent 直接操作链上资产：OKX OnchainOS Agentic Wallet 实战",
    tags: ["OnchainOS", "OKX", "AI Agent"],
    excerpt: "AI Agent 这两年进化得飞快。但一碰到链上操作立马回到石器时代：手动打开钱包，手动签名，手动确认。",
    slug: "328a745569bb817eb83cf55e9f1f2445",
  },
  {
    num: "0146",
    date: "2026-03-13",
    title: "你的 AI Agent 记不住事？聊聊记忆引擎的正确打开方式",
    tags: ["新闻", "工具"],
    excerpt: "跟你的 AI Agent 聊了半小时，它帮你理清了一个复杂决策。第二天再打开，它问你：你好，有什么可以帮你的？一切归零。金鱼记忆。",
    slug: "322a745569bb81728839ccf10c71d041",
  },
  {
    num: "0145",
    date: "2026-03-12",
    title: "别重启了，你的 Gateway 会热 reload",
    tags: ["交易", "思考"],
    excerpt: "我用 OpenClaw 搭了套 AI 自动化系统，跑在 Mac Mini 上，7×24 小时运行。Discord 接指令，Agent 干活，一切看起来很美好——直到我需要改个配置。",
    slug: "321a745569bb8191b4c3f2c0a6130a25",
  },
  {
    num: "0144",
    date: "2026-03-11",
    title: "我用 OKX Agent Trade Kit 构建了一套可以自动调整的比特币定投系统",
    tags: ["比特币", "区块链"],
    excerpt: "每周定投 $100 买 BTC，坚持了两年。BTC 跌到 $20k 我投 $100，涨到 $100k 我也投 $100——这不是蠢吗？",
    slug: "320a745569bb8168b4cdecf903a07c4d",
  },
];

const STATS = {
  years: 13,    // 2013-2026
  posts: 155,
  bitcoinYears: 7,
};

// ——— Formatters ———
function fmtDate(iso) {
  // 2026-04-23  →  Apr 23, 2026
  const d = new Date(iso + "T00:00:00");
  const mo = d.toLocaleString("en-US", { month: "short" });
  return `${mo} ${d.getDate()}, ${d.getFullYear()}`;
}
function fmtDateCN(iso) {
  const d = new Date(iso + "T00:00:00");
  return `${d.getFullYear()} · ${String(d.getMonth() + 1).padStart(2, "0")} · ${String(d.getDate()).padStart(2, "0")}`;
}

// ——— Nav ———
function SiteNav({ active, onToggleTheme, theme }) {
  return (
    <nav className="site-nav">
      <a href="#" className="brand" onClick={(e)=>e.preventDefault()}>
        <span className="brand-mark">xiyu<span className="brand-dot"></span></span>
        <span className="brand-tag">long · bitcoin</span>
      </a>
      <div className="nav-links">
        <a href="#" className={"nav-link" + (active==="writing"?" active":"")} onClick={(e)=>e.preventDefault()}>写作</a>
        <a href="#" className={"nav-link" + (active==="archive"?" active":"")} onClick={(e)=>e.preventDefault()}>归档</a>
        <a href="#" className={"nav-link" + (active==="about"?" active":"")} onClick={(e)=>e.preventDefault()}>关于</a>
        <a href="#" className="nav-link" onClick={(e)=>e.preventDefault()}>Twitter ↗</a>
        {onToggleTheme && (
          <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>
        )}
      </div>
    </nav>
  );
}

// ——— Footer ———
function SiteFoot() {
  return (
    <footer className="site-foot">
      <span>© xiyu 2013—2026</span>
      <span>xiyu.im · 长期主义 · 记录思考</span>
    </footer>
  );
}

// ——— Featured (first) article card ———
function FeaturedCard({ post }) {
  return (
    <article className="feature-card">
      <div className="feature-meta">
        <span className="post-num">#{post.num}</span>
        <span className="post-date">{fmtDate(post.date)}</span>
      </div>
      <div className="feature-body">
        <h2 className="post-title feature-title">
          <a href="#" className="feature-link" onClick={(e)=>e.preventDefault()}>{post.title}</a>
        </h2>
        <p className="post-excerpt feature-excerpt">{post.excerpt}</p>
        <div className="feature-tags">
          {post.tags.map((t, i) => (
            <React.Fragment key={t}>
              {i > 0 && <span className="tag-dot">·</span>}
              <span className="tag">{t}</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </article>
  );
}

// ——— List row article ———
function ArticleRow({ post }) {
  return (
    <article className="article-row">
      <div className="row-num-col">
        <span className="post-num">#{post.num}</span>
      </div>
      <div className="row-main">
        <h3 className="post-title row-title">
          <a href="#" className="row-link" onClick={(e)=>e.preventDefault()}>
            {post.flag && <span className="row-flag">{post.flag}</span>}
            {post.title}
          </a>
        </h3>
        <p className="post-excerpt row-excerpt">{post.excerpt}</p>
        <div className="row-tags">
          {post.tags.map((t, i) => (
            <React.Fragment key={t}>
              {i > 0 && <span className="tag-dot">·</span>}
              <span className="tag-plain">{t}</span>
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="row-date-col">
        <span className="post-date">{fmtDateCN(post.date)}</span>
      </div>
    </article>
  );
}

Object.assign(window, {
  POSTS, STATS, fmtDate, fmtDateCN,
  SiteNav, SiteFoot, FeaturedCard, ArticleRow,
});

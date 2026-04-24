// —— About Page ——

function AboutPage() {
  const topics = [
    { name: "比特币", count: 42 },
    { name: "AI Agent", count: 31 },
    { name: "思考", count: 28 },
    { name: "OpenClaw", count: 19 },
    { name: "投资", count: 24 },
    { name: "交易", count: 17 },
    { name: "健康", count: 9 },
    { name: "第一性原理", count: 7 },
    { name: "自动化", count: 14 },
    { name: "工具", count: 21 },
    { name: "新闻", count: 11 },
    { name: "复盘", count: 13 },
  ];

  return (
    <div className="page">
      <SiteNav active="about" />

      <section className="about-hero">
        <div>
          <div className="eyebrow">About · 关于我</div>
          <h1 className="about-h1">xiyu</h1>
          <p className="about-lead">
            一个币圈老韭菜，在这个市场摸爬滚打了十年。
            感谢比特币，让这个混乱的世界多了一份信仰。
          </p>
        </div>

        <div className="portrait-col">
          <div className="portrait">
            <div className="portrait-glyph">羽</div>
            <div className="portrait-scrim"></div>
          </div>
          <div className="portrait-caption">
            独立开发者 · 长期主义者<br/>
            Based in Shanghai · CN
          </div>
        </div>
      </section>

      <div className="about-body">
        <p>
          我从 2013 年开始写博客，到今天是第 13 年。最早写的是技术笔记，
          后来慢慢变成投资思考、AI 实验、生活观察的混合体。
          <strong>这里不是一个内容产品，它是我的公开思考档案</strong>——
          我写给三年后的自己看，顺便让愿意陪我读的人进来坐坐。
        </p>
        <p>
          我在币圈待了快七年。2017 年冲过 ICO，2021 年追过 NFT，中间还玩过合约、做过网格、研究过各种山寨。
          回头看，最大的教训不是买错了哪个币，而是——<strong>我根本就不该"炒"</strong>。
          现在我只做一件事：<em>长期持有比特币，观察市场，不参与，不预测。</em>
        </p>
        <p>
          近两年我把大部分精力放在 AI Agent 上。做了一个叫 OpenClaw 的开源框架，
          让非程序员也能搭一个 7×24 小时替自己干活的数字助理。
          它替我处理邮件、写交易报告、盯盘、做周报——<strong>我做减法，它做加法</strong>。
        </p>
      </div>

      <section className="about-facts">
        <div className="fact">
          <div className="fact-num">13<span className="unit">y</span></div>
          <div className="fact-label">Writing</div>
        </div>
        <div className="fact">
          <div className="fact-num">155</div>
          <div className="fact-label">Essays published</div>
        </div>
        <div className="fact">
          <div className="fact-num">7<span className="unit">y</span></div>
          <div className="fact-label">Long bitcoin</div>
        </div>
        <div className="fact">
          <div className="fact-num">1</div>
          <div className="fact-label">Open-source project</div>
        </div>
      </section>

      <div className="about-body">
        <p>
          如果你也在长期持有比特币，或者在折腾 AI Agent，或者只是喜欢一些反直觉的思考——
          欢迎通过下面的链接找我。我尽量回每一封邮件，不保证立刻。
        </p>
      </div>

      <section className="elsewhere">
        <h2 className="elsewhere-title">Elsewhere</h2>
        <div className="link-list">
          <a className="link-row" href="#"><span className="link-platform">Twitter</span><span className="link-handle">@ohxiyu →</span></a>
          <a className="link-row" href="#"><span className="link-platform">GitHub</span><span className="link-handle">@xiyu →</span></a>
          <a className="link-row" href="#"><span className="link-platform">Email</span><span className="link-handle">hi@xiyu.im →</span></a>
          <a className="link-row" href="#"><span className="link-platform">RSS</span><span className="link-handle">/feed.xml →</span></a>
          <a className="link-row" href="#"><span className="link-platform">OpenClaw</span><span className="link-handle">openclaw.dev →</span></a>
          <a className="link-row" href="#"><span className="link-platform">Newsletter</span><span className="link-handle">buttondown · weekly →</span></a>
        </div>
      </section>

      <section className="topics-wrap">
        <div className="topics-head">
          <div className="eyebrow">Topics · 我写些什么</div>
          <h2 className="section-title" style={{marginTop:"14px"}}>按主题浏览</h2>
        </div>
        <div className="topics-grid">
          {topics.map(t => (
            <a key={t.name} href="#" className="topic-cell" onClick={(e)=>e.preventDefault()}>
              <span className="topic-name">{t.name}</span>
              <span className="topic-count">{t.count} posts</span>
            </a>
          ))}
        </div>
      </section>

      <section className="colophon">
        <div className="colophon-head">
          <div className="eyebrow">Colophon · 这个博客怎么搭的</div>
          <h2 className="section-title" style={{marginTop:"14px"}}>技术栈与工作流</h2>
        </div>

        <div className="stack-grid">
          <div className="stack-item">
            <div className="stack-num">01</div>
            <div className="stack-role">写作</div>
            <div className="stack-name">Notion</div>
            <p className="stack-note">
              所有文章都在 Notion 里写。一个 database 管所有 post，
              tag、category、status、date 作为 property，
              发布状态改成 Published 就会自动上线。
            </p>
          </div>

          <div className="stack-item">
            <div className="stack-num">02</div>
            <div className="stack-role">框架</div>
            <div className="stack-name">NotionNext</div>
            <p className="stack-note">
              基于 Next.js 的静态博客生成器，直接把 Notion 当 CMS。
              我 fork 了一份，做了些样式与路由层面的改动，
              让它长成现在你看到的样子。
            </p>
          </div>

          <div className="stack-item">
            <div className="stack-num">03</div>
            <div className="stack-role">部署</div>
            <div className="stack-name">Vercel</div>
            <p className="stack-note">
              推到 GitHub 主分支就自动部署。
              Notion 改完文章触发一次 redeploy，
              从编辑到上线大概 60 秒。
            </p>
          </div>

          <div className="stack-item">
            <div className="stack-num">04</div>
            <div className="stack-role">域名与 CDN</div>
            <div className="stack-name">Cloudflare</div>
            <p className="stack-note">
              xiyu.im 的 DNS 与边缘缓存都走 Cloudflare。
              图床走 Notion 自带 + R2 兜底，
              让博客对国内访问也足够快。
            </p>
          </div>
        </div>

        <div className="workflow">
          <div className="workflow-label">日常工作流</div>
          <div className="workflow-line">
            <span className="wf-step">Notion 新建 page</span>
            <span className="wf-arrow">→</span>
            <span className="wf-step">写 & 编辑</span>
            <span className="wf-arrow">→</span>
            <span className="wf-step">status = Published</span>
            <span className="wf-arrow">→</span>
            <span className="wf-step">ISR 自动重建</span>
            <span className="wf-arrow">→</span>
            <span className="wf-step accent">xiyu.im 上线</span>
          </div>
          <p className="workflow-note">
            开源在 <a className="inline-link" href="#">github.com/xiyu/blog</a>，
            基于 <a className="inline-link" href="#">NotionNext</a>，
            魔改了主题、路由与字体加载。想自己搭一个类似的，可以直接 fork。
          </p>
        </div>
      </section>

      <SiteFoot />
    </div>
  );
}

window.AboutPage = AboutPage;

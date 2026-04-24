// —— Homepage ——

function HomePage() {
  const [featured, ...rest] = POSTS;
  return (
    <div className="page">
      <SiteNav active="writing" />

      <section className="hero">
        <div>
          <div className="eyebrow hero-eyebrow">xiyu's notebook · est. 2013</div>
          <h1 className="hero-title">
            在喧嚣与噪声里，<br/>
            写点<em>经得住时间</em>的东西。
          </h1>
          <p className="hero-subtitle">
            币圈十年，AI 三年，思考不停。这里记录投资体会、交易心得、AI Agent 实战，
            以及一些在边界上的个人观察。
          </p>
          <div className="hero-meta">
            <div>
              <span className="hero-meta-num">{STATS.posts}</span>
              <span className="hero-meta-label">Essays</span>
            </div>
            <div>
              <span className="hero-meta-num">{STATS.years}</span>
              <span className="hero-meta-label">Years writing</span>
            </div>
            <div>
              <span className="hero-meta-num">{STATS.bitcoinYears}</span>
              <span className="hero-meta-label">Long BTC</span>
            </div>
          </div>
        </div>

        <aside className="hero-card">
          <div className="hero-card-label">Now · 最近在想</div>
          <p className="hero-card-quote">
            AI 交易的护城河不是 alpha，是纪律。机器真正的优势不是比你更聪明，
            而是比你更一致——它不会在第 47 次止损时怀疑人生。
          </p>
          <div className="hero-card-attr">— #0154, 四月</div>
        </aside>
      </section>

      <section>
        <div className="section-head">
          <h2 className="section-title">最新写作</h2>
          <span className="section-count">2026 · {POSTS.length} posts shown</span>
        </div>

        <FeaturedCard post={featured} />

        <div>
          {rest.map((p) => <ArticleRow key={p.num} post={p} />)}
        </div>

        <nav className="pagination">
          <a href="#" className="page-link disabled" onClick={(e)=>e.preventDefault()}>← 更新的文章</a>
          <span className="page-indicator">page 1 / 13</span>
          <a href="#" className="page-link" onClick={(e)=>e.preventDefault()}>更早的文章 →</a>
        </nav>
      </section>

      <SiteFoot />
    </div>
  );
}

window.HomePage = HomePage;

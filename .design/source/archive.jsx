// —— Archive Page ——

function ArchivePage() {
  // Extended set — fabricate earlier post stubs so the archive feels full
  const extendedPosts = [
    ...POSTS,
    { num:"0143", date:"2026-03-05", title:"为什么我卸载了大部分交易软件", tags:["思考"] },
    { num:"0142", date:"2026-02-28", title:"用 Claude Code 重写我的网格策略：一个周末的产出", tags:["AI/技术"] },
    { num:"0141", date:"2026-02-20", title:"关于「等待」的复利", tags:["思考","投资"] },
    { num:"0140", date:"2026-02-14", title:"BTC 持仓七年后，我对「周期」的理解", tags:["比特币"] },
    { num:"0139", date:"2026-02-08", title:"OpenClaw 工程笔记（五）：状态机的取舍", tags:["OpenClaw"] },
    { num:"0138", date:"2026-01-30", title:"为什么我开始每天只看一次盘", tags:["思考"] },
    { num:"0137", date:"2026-01-22", title:"记账四年：我踩过的三个认知陷阱", tags:["理财"] },
    { num:"0136", date:"2026-01-15", title:"新年第一篇：把「愿望」拆成「系统」", tags:["思考"] },
    { num:"0135", date:"2026-01-05", title:"2025 年复盘 · 长期主义的第 13 年", tags:["复盘"] },
    { num:"0134", date:"2025-12-28", title:"减半前的 180 天，我在做什么", tags:["比特币"] },
    { num:"0133", date:"2025-12-20", title:"Agent 失败案例集（三）", tags:["AI Agent"] },
    { num:"0132", date:"2025-12-12", title:"关于「焦虑」的物理模型", tags:["思考"] },
    { num:"0131", date:"2025-12-02", title:"OnchainOS 首次实战：三小时搭一个小工具", tags:["OKX"] },
  ];

  const grouped = extendedPosts.reduce((acc, p) => {
    const y = p.date.slice(0,4);
    (acc[y] = acc[y] || []).push(p);
    return acc;
  }, {});
  const years = Object.keys(grouped).sort((a,b)=>b.localeCompare(a));

  return (
    <div className="page">
      <SiteNav active="archive" />

      <header className="archive-head">
        <div className="eyebrow">Archive · 十三年的文字</div>
        <h1 className="archive-title">所有写过的字，按年陈列。</h1>
        <p className="archive-sub">
          从 2013 到现在，一共 {STATS.posts} 篇文章。早期的幼稚和近年的克制，
          都在这里——我不删旧文，因为那也是我。
        </p>
      </header>

      {years.map(y => (
        <section className="archive-year" key={y}>
          <div>
            <div className="year-label">{y}</div>
            <span className="year-count">{grouped[y].length} posts</span>
          </div>
          <div className="year-list">
            {grouped[y].map(p => (
              <a key={p.num} href="#" className="archive-item" onClick={(e)=>e.preventDefault()}>
                <span className="post-num">#{p.num}</span>
                <span className="archive-item-title">{p.title}</span>
                <span className="archive-item-date">{p.date.slice(5).replace("-"," / ")}</span>
              </a>
            ))}
          </div>
        </section>
      ))}

      <SiteFoot />
    </div>
  );
}

window.ArchivePage = ArchivePage;

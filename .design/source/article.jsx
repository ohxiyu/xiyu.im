// —— Article Detail Page ——

function ArticlePage() {
  const post = POSTS.find(p => p.num === "0154");
  return (
    <div className="page">
      <SiteNav active="writing" />

      <div className="article-layout">
        <aside className="toc">
          <div className="toc-label">Contents</div>
          <ul className="toc-list">
            <li><a className="toc-link active" href="#sec-1">问题的起点</a></li>
            <li><a className="toc-link" href="#sec-2">双模式切换</a></li>
            <li><a className="toc-link" href="#sec-3">量能衰竭止盈</a></li>
            <li><a className="toc-link" href="#sec-4">纪律即 alpha</a></li>
            <li><a className="toc-link" href="#sec-5">回测与反思</a></li>
          </ul>
        </aside>

        <article>
          <header className="article-hero">
            <div className="article-head-meta">
              <span className="post-num">#{post.num}</span>
              <span className="post-date">{fmtDate(post.date)}</span>
              <span className="tag-dot">·</span>
              {post.tags.map((t,i)=>(
                <React.Fragment key={t}>
                  {i>0 && <span className="tag-dot">·</span>}
                  <span className="tag-plain">{t}</span>
                </React.Fragment>
              ))}
            </div>
            <h1 className="article-h1">{post.title}</h1>
            <p className="article-lead">
              机器真正的优势不是比你更聪明，而是比你更一致。它不会在第 47 次止损时怀疑人生，
              不会因为昨晚和老婆吵了一架就放大仓位。
            </p>
          </header>

          <div className="article-body">
            <h2 id="sec-1">问题的起点</h2>
            <p>
              我参加 OKX 今年的 AI 交易大赛，花了两周搭一个全自动合约交易代理。
              最开始我以为难点在模型——<strong>找更强的信号、更复杂的特征、更聪明的推理</strong>——
              但真正跑起来才发现，<code>alpha</code> 不是最稀缺的资源，<strong>纪律</strong>才是。
            </p>
            <p>
              人脑在高噪声环境里会自动降低采样频率——你盯着盘子看五分钟，
              每一根 K 线都在撒谎。AI 不会。它把一万根 K 线当成一万个平等的观察点，
              只按预先定义的规则出手。
            </p>

            <div className="callout">
              一个足够简单的策略 + 绝对严格的执行，在长期里几乎一定跑赢
              一个足够聪明的策略 + 半信半疑的执行。
            </div>

            <h2 id="sec-2">双模式切换</h2>
            <p>
              我把系统拆成两个互斥模式：<strong>震荡跑网格</strong> 与 <strong>爆量做多</strong>。
              切换条件只有两个变量：ATR 压缩度、成交量相对均值。两个都触发就进入动量模式，否则默认网格。
            </p>

            <pre><code>{`if volume > 2.5 * volume_ma and atr_rank < 0.2:
    mode = "momentum"
else:
    mode = "grid"`}</code></pre>

            <p>
              为什么这么粗暴？因为参数越多，过拟合越严重。
              在真实市场里，一个跑十年能稳定出单的系统，往往只有两三个变量。
            </p>

            <h2 id="sec-3">量能衰竭止盈</h2>
            <p>
              爆量入场容易，退出难。我不用固定百分比止盈，而是盯成交量的一阶差分：
              当 5 分钟成交量连续三根低于触发根的 40%，自动平仓。这让系统在动量衰减前一两根 K 线就已经离场，
              不贪最后一口汤。
            </p>

            <blockquote>
              贪心的本质是对尾部分布的过度乐观。量能衰竭止盈，是用观测到的事实替代想象中的可能。
            </blockquote>

            <h2 id="sec-4">纪律即 alpha</h2>
            <p>
              我对比了同样的信号规则在人工执行 vs AI 执行下的结果。
              信号完全一致，但人工版本的夏普比仅为 AI 版本的 63%——
              全部差距来源于"我犹豫了两分钟"、"我临时加仓了"、"我看它好像还能涨就没止损"。
            </p>

            <h2 id="sec-5">回测与反思</h2>
            <p>
              四个月的实盘数据跑下来，<strong>夏普 2.1，最大回撤 8.3%</strong>。
              不是最炸的结果，但关键是它每一单都按规则做，没有任何"临场发挥"。
            </p>
            <p>
              <strong>这套系统最大的价值不是它能赚多少钱，而是它替我建立了一个反直觉的认知：</strong>
              当一个策略的收益变低但稳定性变高时，资金曲线的终点往往更高。
            </p>

            <hr />
            <p>
              完整代码和策略参数在 <a className="inline-link" href="#">我的 GitHub</a>。
              如果你也在做类似的事，欢迎在 <a className="inline-link" href="#">Twitter</a> 聊。
            </p>
          </div>

          <footer className="article-foot">
            <div className="article-foot-tags">
              {post.tags.map(t => <span key={t} className="tag">{t}</span>)}
            </div>
            <div className="prev-next">
              <a href="#" className="pn-card" onClick={(e)=>e.preventDefault()}>
                <div className="pn-label">← 上一篇 · #0153</div>
                <div className="pn-title">Runes 不是发 Memecoin 的工具，它是比特币的「区块空间续命丸」</div>
              </a>
              <a href="#" className="pn-card pn-right" onClick={(e)=>e.preventDefault()}>
                <div className="pn-label">下一篇 · #0155 →</div>
                <div className="pn-title">OKB 爆量动量 + 自适应网格策略：设计逻辑全拆解</div>
              </a>
            </div>
          </footer>
        </article>

        <aside className="article-side">
          <div className="side-stat">
            <div className="side-stat-label">Reading time</div>
            <div className="side-stat-value">8 min</div>
          </div>
          <div className="side-stat">
            <div className="side-stat-label">Words</div>
            <div className="side-stat-value">2,134</div>
          </div>
          <div className="side-stat">
            <div className="side-stat-label">Series</div>
            <div className="side-stat-value">AI 交易 · 2/5</div>
          </div>
          <hr className="rule" style={{margin:"24px 0"}} />
          <div className="side-stat">
            <div className="side-stat-label">Share</div>
            <div style={{display:"flex",gap:"12px",marginTop:"10px"}}>
              <a className="inline-link" href="#" style={{fontSize:"13px"}}>Twitter</a>
              <a className="inline-link" href="#" style={{fontSize:"13px"}}>Copy link</a>
            </div>
          </div>
        </aside>
      </div>

      <SiteFoot />
    </div>
  );
}

window.ArticlePage = ArticlePage;

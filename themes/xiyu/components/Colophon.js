// 关于页 · 技术栈与工作流
const STACK = [
  { num: '01', role: '写作', name: 'Notion', note: '所有文章都在 Notion 里写。一个 database 管所有 post，tag/category/status/date 作为 property，发布状态改成 Published 就会自动上线。' },
  { num: '02', role: '框架', name: 'NotionNext', note: '基于 Next.js 的静态博客生成器，直接把 Notion 当 CMS。我 fork 了一份，做了些样式与路由层面的改动，让它长成现在你看到的样子。' },
  { num: '03', role: '部署', name: 'Vercel', note: '推到 GitHub 主分支就自动部署。Notion 改完文章触发一次 redeploy，从编辑到上线大概 60 秒。' },
  { num: '04', role: '域名与 CDN', name: 'Cloudflare', note: 'xiyu.im 的 DNS 与边缘缓存都走 Cloudflare。图床走 Notion 自带 + R2 兜底，让博客对国内访问也足够快。' }
]

const Colophon = () => (
  <section className='colophon'>
    <div className='colophon-head'>
      <div className='eyebrow'>Colophon · 这个博客怎么搭的</div>
      <h2 className='section-title' style={{ marginTop: '14px' }}>技术栈与工作流</h2>
    </div>
    <div className='stack-grid'>
      {STACK.map(s => (
        <div key={s.num} className='stack-item'>
          <div className='stack-num'>{s.num}</div>
          <div className='stack-role'>{s.role}</div>
          <div className='stack-name'>{s.name}</div>
          <p className='stack-note'>{s.note}</p>
        </div>
      ))}
    </div>
    <div className='workflow'>
      <div className='workflow-label'>日常工作流</div>
      <div className='workflow-line'>
        <span className='wf-step'>Notion 新建 page</span>
        <span className='wf-arrow'>→</span>
        <span className='wf-step'>写 &amp; 编辑</span>
        <span className='wf-arrow'>→</span>
        <span className='wf-step'>status = Published</span>
        <span className='wf-arrow'>→</span>
        <span className='wf-step'>ISR 自动重建</span>
        <span className='wf-arrow'>→</span>
        <span className='wf-step accent'>xiyu.im 上线</span>
      </div>
      <p className='workflow-note'>
        开源在 GitHub，基于 NotionNext 魔改了主题、路由与字体加载。想自己搭一个类似的，可以直接 fork。
      </p>
    </div>
  </section>
)

export default Colophon

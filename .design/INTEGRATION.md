# xiyu 主题 · 集成到 NotionNext 指南

这份文档说明怎么把当前的设计稿（`xiyu.im.html` + CSS + JSX）转成一套可以直接用在你的 NotionNext fork 里的主题。

---

## 一、概念对齐

**NotionNext** 用 `themes/<name>/` 目录来组织每套主题。每个主题至少包含：

- `index.js` — 主题导出，把各页面类型（`LayoutIndex`、`LayoutPost`、`LayoutArchive`、`LayoutSlug`、`LayoutPage` 等）映射到具体 React 组件
- `components/` — 卡片、导航、页脚、文章列表等可复用组件
- `style.js` 或 `style.css` — 主题样式（可以直接 import CSS，或者用 styled-jsx）
- `config.js` — 主题自己的配置项（哪些 tag 高亮、是否启用深色切换等）
- `README.md` — 使用说明

目标就是把现在的 `styles.css` / `pages.css` / `home.jsx` / `article.jsx` / `archive.jsx` / `about.jsx` / `shared.jsx` 改写成这套目录结构。

---

## 二、建议的目录结构

把主题取名为 `xiyu`（你自己改也行）：

```
themes/
└── xiyu/
    ├── index.js                    # 入口，导出各 Layout
    ├── config.js                   # 主题配置（accent 色、默认字体等）
    ├── style.js                    # 全局样式注入（来自 styles.css + pages.css）
    ├── LayoutBase.js               # 套壳：Nav + main + Footer + 字体引入
    ├── LayoutIndex.js              # 首页：Hero + 文章列表
    ├── LayoutPostList.js           # 通用文章列表（归档/分类/标签 共用）
    ├── LayoutSlug.js               # 文章详情页（带 TOC）
    ├── LayoutArchive.js            # 归档页（按年份分组）
    ├── LayoutPage.js               # 独立 Notion 页面（关于页走这个）
    ├── LayoutSearch.js             # 搜索页（复用 LayoutPostList）
    ├── Layout404.js                # 404
    └── components/
        ├── SiteNav.js
        ├── SiteFoot.js
        ├── Hero.js                 # 首页 Hero 区
        ├── NowCard.js              # "最近在想" 卡片
        ├── FeaturedCard.js         # 首篇大卡
        ├── ArticleRow.js           # 列表行
        ├── ArticleLead.js          # 文章首段引语
        ├── TOC.js                  # 文章详情左侧目录
        ├── PrevNext.js             # 上一篇/下一篇
        ├── Colophon.js             # 关于页技术栈区
        ├── AboutHero.js            # 关于页 Hero（羽字肖像）
        └── Topics.js               # 主题网格
```

---

## 三、文件映射 · 当前设计稿 → 主题文件

| 设计稿里的文件 | 对应到主题里的位置 |
|---|---|
| `styles.css`（设计系统 tokens / nav / footer / 通用卡片） | `themes/xiyu/style.js` 的第一部分 |
| `pages.css`（页面专属样式） | `themes/xiyu/style.js` 的第二部分 |
| `shared.jsx` 里的 `SiteNav` / `SiteFoot` | `components/SiteNav.js` / `components/SiteFoot.js` |
| `shared.jsx` 里的 `FeaturedCard` / `ArticleRow` | `components/FeaturedCard.js` / `components/ArticleRow.js` |
| `home.jsx` 的 `HomePage` | `LayoutIndex.js`（把 Hero 拆成 `components/Hero.js`） |
| `article.jsx` 的 `ArticlePage` | `LayoutSlug.js`（正文区交给 NotionNext 自己的 `NotionPage`） |
| `archive.jsx` 的 `ArchivePage` | `LayoutArchive.js` |
| `about.jsx` 的 `AboutPage` | `LayoutPage.js`（判断 slug === 'about' 时走这套） |
| `shared.jsx` 里的 `POSTS` 假数据 | **不需要**，改成 NotionNext 传入的 `props.posts` |

---

## 四、具体改动步骤

### Step 1 · 创建主题目录与入口

在 fork 的仓库里：

```bash
cp -r themes/heo themes/xiyu        # 用 heo 做模板复制一份，改动最小
# 或者
cp -r themes/hexo themes/xiyu
```

然后清空 `themes/xiyu/style.js` 和各 `Layout*.js` 的内容，保留文件骨架与 import 路径。

### Step 2 · 把样式塞进 `style.js`

NotionNext 的 theme 样式一般用 styled-jsx 的 `<style jsx global>`。把当前 `styles.css` + `pages.css` 合并后整个丢进 `LayoutBase.js` 里：

```jsx
// themes/xiyu/LayoutBase.js
import SiteNav from './components/SiteNav'
import SiteFoot from './components/SiteFoot'

const LayoutBase = ({ children, ...props }) => (
  <div className="xiyu-theme">
    <SiteNav active={props.slotTop?.active} />
    <main className="page">{children}</main>
    <SiteFoot />

    {/* 字体 */}
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;600;700&family=Noto+Sans+SC:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

    <style jsx global>{`
      /* 把 styles.css 所有内容粘进来 */
      :root { --bg: #faf7f2; /* ... */ }
      /* 把 pages.css 所有内容粘进来 */
      .hero { /* ... */ }
    `}</style>
  </div>
)

export { LayoutBase }
```

### Step 3 · 改 `LayoutIndex.js` 吃真实数据

```jsx
// themes/xiyu/LayoutIndex.js
import { LayoutBase } from './LayoutBase'
import Hero from './components/Hero'
import FeaturedCard from './components/FeaturedCard'
import ArticleRow from './components/ArticleRow'

const LayoutIndex = (props) => {
  const { posts = [] } = props               // ← NotionNext 默认传入
  const [featured, ...rest] = posts

  return (
    <LayoutBase slotTop={{ active: 'writing' }}>
      <Hero stats={{
        posts: posts.length,
        years: new Date().getFullYear() - 2013,
        bitcoinYears: 7
      }} />

      <section>
        <div className="section-head">
          <h2 className="section-title">最新写作</h2>
          <span className="section-count">
            {new Date().getFullYear()} · {posts.length} posts
          </span>
        </div>
        {featured && <FeaturedCard post={featured} />}
        {rest.slice(0, 11).map(p => <ArticleRow key={p.id} post={p} />)}
      </section>
    </LayoutBase>
  )
}

export { LayoutIndex }
```

### Step 4 · 适配 Notion 数据字段

当前设计稿里每篇 post 的字段 `{ num, date, title, tags, excerpt, slug }` 对应 NotionNext 的字段约定是：

| 设计字段 | Notion 字段 | 备注 |
|---|---|---|
| `num` | 自定义 property `num` 或用 `post.index`/`post.id` 末几位 | Notion 里建一个 `Number` property 叫 `num` 最简单 |
| `date` | `post.date?.start_date` 或 `post.publishDate` | NotionNext 自己会解析 `Date` property |
| `title` | `post.title` | ✓ |
| `tags` | `post.tags` | 字符串数组 |
| `excerpt` | `post.summary` | Notion 里建一个 `Text` property 叫 `summary` |
| `slug` | `post.slug` | ✓ |
| `flag` | 自定义 property `flag`（文本，可选 emoji） | 可选 |

**Notion 数据库要新增的 properties：**
- `num`（Number）· 文章编号
- `summary`（Text）· 摘要（如果你没建过）
- `flag`（Text，可选）· 前缀 emoji 标志

然后在 `shared.jsx` 里那个 `POSTS` 假数据里你用的字段名，改到组件里去读 `post.num` / `post.summary` / `post.tags` / `post.slug` 就能直接驳上。

### Step 5 · 文章详情页

NotionNext 的 `LayoutSlug` 会拿到 `post.blockMap`（Notion 的块数据）。你不用自己渲染正文，交给 `<NotionPage post={post} />` 就行。我们只改外壳：

```jsx
// themes/xiyu/LayoutSlug.js
import { LayoutBase } from './LayoutBase'
import TOC from './components/TOC'
import ArticleLead from './components/ArticleLead'
import PrevNext from './components/PrevNext'
import NotionPage from '@/components/NotionPage'

const LayoutSlug = (props) => {
  const { post, prev, next, toc } = props
  return (
    <LayoutBase>
      <div className="article-layout">
        <TOC toc={toc} />
        <article>
          <header className="article-hero">
            <div className="article-head-meta">
              <span className="post-num">#{post.num}</span>
              <span className="post-date">{post.publishDay}</span>
              {post.tags?.map(t => <span key={t} className="tag-plain">{t}</span>)}
            </div>
            <h1 className="article-h1">{post.title}</h1>
            {post.summary && <ArticleLead>{post.summary}</ArticleLead>}
          </header>
          <div className="article-body">
            <NotionPage post={post} />
          </div>
          <PrevNext prev={prev} next={next} tags={post.tags} />
        </article>
      </div>
    </LayoutBase>
  )
}

export { LayoutSlug }
```

### Step 6 · 归档页

NotionNext 会把 `posts` 直接传进来，按年分组这个逻辑搬过去就行：

```jsx
// themes/xiyu/LayoutArchive.js
const LayoutArchive = ({ archivePosts = {} }) => {
  const years = Object.keys(archivePosts).sort((a,b)=>b.localeCompare(a))
  return (
    <LayoutBase>
      <header className="archive-head">…</header>
      {years.map(y => (
        <section className="archive-year" key={y}>
          <div>
            <div className="year-label">{y}</div>
            <span className="year-count">{archivePosts[y].length} posts</span>
          </div>
          <div className="year-list">
            {archivePosts[y].map(p => (
              <a key={p.id} href={`/article/${p.slug}`} className="archive-item">
                <span className="post-num">#{p.num}</span>
                <span className="archive-item-title">{p.title}</span>
                <span className="archive-item-date">{p.publishDay?.slice(5)}</span>
              </a>
            ))}
          </div>
        </section>
      ))}
    </LayoutBase>
  )
}
```

### Step 7 · 关于页

`LayoutPage` 处理 Notion 里 `type = Page` 的独立页面。判断 slug 是不是 `about`，是的话加载我们特制的 AboutHero + Colophon；其他页面走通用 `NotionPage` 渲染：

```jsx
// themes/xiyu/LayoutPage.js
import AboutHero from './components/AboutHero'
import Colophon from './components/Colophon'
import Topics from './components/Topics'
import NotionPage from '@/components/NotionPage'

const LayoutPage = ({ post, categoryOptions, tagOptions }) => {
  if (post?.slug === 'about') {
    return (
      <LayoutBase>
        <AboutHero />
        <div className="about-body"><NotionPage post={post} /></div>
        {/* 或者全部自写 */}
        <Topics tags={tagOptions} />
        <Colophon />
      </LayoutBase>
    )
  }
  return (
    <LayoutBase>
      <article className="page"><NotionPage post={post} /></article>
    </LayoutBase>
  )
}
```

---

## 五、在 `index.js` 里导出 & 启用

```js
// themes/xiyu/index.js
export { LayoutBase } from './LayoutBase'
export { LayoutIndex } from './LayoutIndex'
export { LayoutPostList } from './LayoutPostList'
export { LayoutSearch } from './LayoutSearch'
export { LayoutArchive } from './LayoutArchive'
export { LayoutSlug } from './LayoutSlug'
export { LayoutPage } from './LayoutPage'
export { Layout404 } from './Layout404'
```

然后在项目根的 `blog.config.js` 里：

```js
module.exports = {
  // ...
  THEME: 'xiyu',           // ← 改成你的主题名
  THEME_SWITCH: false,     // 锁定主题
  // ...
}
```

---

## 六、本地调试

```bash
yarn install
yarn dev
# → http://localhost:3000
```

如果主题找不到，确认：
- `themes/xiyu/index.js` 存在并正确 `export`
- `blog.config.js` 里 `THEME: 'xiyu'` 拼写一致
- Notion 数据库里 `summary` / `num` property 已经加好

---

## 七、部署（Vercel）

推到 GitHub 主分支 → Vercel 自动拉起新构建。第一次部署如果有 Notion token 相关报错，去 Vercel 项目的 Environment Variables 补上：

- `NOTION_PAGE_ID`
- `NOTION_API_SECRET`（可选，公开 database 不需要）

---

## 八、后续迭代建议

1. **先跑起来最小可用版本** · 只改 `LayoutIndex` + `LayoutBase`，其它 Layout 先沿用 heo 默认值，确认整条链路通了再慢慢替换
2. **Notion Now 卡片** · 在 Notion 里单独建一个 page 叫 `/now`，用它的最新一段当 Hero 右边的引言（就不用手动改了）
3. **深色模式** · 目前 CSS 里 `[data-theme="dark"]` 的分支已经写好，把开关接到 NotionNext 自带的 dark mode context 就行
4. **字体加载优化** · `display=swap` 已经加了，但可以考虑把 Noto Serif SC 换成体积更小的子集（只保留 GB2312）

---

有任何 Layout 的具体代码不清楚怎么搬，告诉我是哪一块，我可以把那一部分完整改写成 NotionNext 格式。

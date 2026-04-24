# xiyu 主题 · NotionNext 实现任务

你是一位资深 Next.js / React 开发者，任务是把这个目录下的设计稿实现成一套可直接运行的 **NotionNext** 主题。

---

## 📁 这个包里有什么

```
handoff/
├── CLAUDE.md                  ← 你正在读的这份任务书
├── README.md                  ← 人类使用者的说明
├── INTEGRATION.md             ← 完整集成指南（权威参考）
│
├── mockups/                   ← 设计稿（最终效果，以这个为准）
│   ├── xiyu.im.html           · design_canvas：首页浅/深、文章页、归档、关于
│   ├── Logo Final.html        · Logo 最终版 + 落地场景
│   └── Logo.html              · Logo 探索过程（6 方向，仅参考）
│
├── source/                    ← 设计稿源码（直接搬进主题）
│   ├── styles.css             · 全局 tokens + 通用组件
│   ├── pages.css              · 各页面专属样式
│   ├── shared.jsx             · SiteNav / SiteFoot / FeaturedCard / ArticleRow
│   ├── home.jsx               · 首页结构
│   ├── article.jsx            · 文章详情结构
│   ├── archive.jsx            · 归档页结构
│   ├── about.jsx              · 关于页结构
│   └── design-canvas.jsx      · 画布预览（不需要搬）
│
└── brand-assets/              ← Logo / favicon / OG 图（最终落地文件）
    ├── logo-mark.svg · logo-mark-dark.svg · logo-mark-yellow.svg
    ├── logo-lockup.svg · logo-256.png · logo-dark-256.png
    ├── favicon.svg · favicon-16.png · favicon-32.png
    ├── apple-touch-icon.png · maskable-512.png · og-image.png
    ├── manifest.json · head-snippet.html
    └── README.md              · 品牌素材详细说明
```

**关键原则**：设计稿 HTML/CSS/JSX 里的 DOM 结构 + className + 数据字段就是视觉契约，**一个类名都不要改**。只改数据来源，从静态 `POSTS` 换成 NotionNext 的 `props`。

---

## 🎯 交付标准

一个可以 `cp -r themes/xiyu <NotionNext 仓库>/themes/xiyu` 再改一行 `THEME: 'xiyu'` 就能跑起来的主题目录。必须：

1. **视觉像素级对齐** `mockups/xiyu.im.html` 的最终稿
2. **跑得起来** · `yarn dev` 无报错，首页/文章/归档/关于四种路由都正常
3. **浅/深两模式** · 都实现，跟随 NotionNext 的 theme context
4. **Notion 数据真实驳通** · 不保留任何 mock 数据

---

## 📐 目录结构（必须严格按这个做）

```
themes/xiyu/
├── index.js                   # 主题入口，export 全部 Layout
├── config.js                  # 主题配置（accent 色等）
├── LayoutBase.js              # 套壳 + 字体 + 全局样式注入
├── LayoutIndex.js             # 首页
├── LayoutPostList.js          # 通用列表（分类/标签/搜索共用）
├── LayoutSlug.js              # 文章详情
├── LayoutArchive.js           # 归档
├── LayoutSearch.js            # 搜索（复用 LayoutPostList）
├── LayoutCategoryIndex.js     # 分类总览
├── LayoutTagIndex.js          # 标签总览
├── LayoutPage.js              # 独立页（关于页走这个）
├── Layout404.js               # 404
├── style.js                   # 全局样式（styled-jsx global）
├── README.md                  # 主题说明
│
└── components/
    ├── SiteNav.js             # 顶部导航 + 主题切换
    ├── SiteFoot.js            # 页脚
    ├── Hero.js                # 首页 Hero（标题 + stats + Now 卡）
    ├── NowCard.js             # "最近在想" 卡片
    ├── FeaturedCard.js        # 首篇大卡
    ├── ArticleRow.js          # 列表行
    ├── ArchiveYear.js         # 归档年份块
    ├── AboutHero.js           # 关于页 Hero（羽字肖像）
    ├── AboutFacts.js          # 关于页四宫格
    ├── Colophon.js            # 技术栈区
    ├── Topics.js              # 主题网格
    ├── TOC.js                 # 文章详情左侧目录
    ├── ArticleSide.js         # 文章详情右侧字数/时长/分享
    ├── PrevNext.js            # 上一篇/下一篇
    └── ThemeToggle.js         # 浅/深切换按钮
```

---

## 🔑 Notion 字段约定

用户的 Notion 数据库需要这些 property（告诉用户去加）：

| Property | 类型 | 说明 | 必填 |
|---|---|---|---|
| `title` | Title | 文章标题 | ✓ |
| `slug` | Rich text | URL slug | ✓ |
| `date` | Date | 发布日期 | ✓ |
| `tags` | Multi-select | 标签 | ✓ |
| `summary` | Rich text | 摘要（Hero 卡 + 列表 excerpt 都用） | ✓ |
| `num` | Number | 文章编号（自增，用作 #0155 这种） | ✓ |
| `flag` | Rich text | 行首 emoji 标（可选，如 🔧） | - |
| `type` | Select | `Post` / `Page` / `Notice` | ✓ |
| `status` | Select | `Published` / `Draft` | ✓ |

组件里的字段映射：

```js
post.num       → Notion num property
post.title     → post.title（NotionNext 原生）
post.slug      → post.slug
post.date      → post.publishDay（NotionNext 已格式化 "YYYY-MM-DD"）
post.tags      → post.tags（已是数组）
post.summary   → post.summary → 渲染为 excerpt
post.flag      → 自定义从 post.pageProperties 里读
```

---

## 🛠 实现步骤（建议顺序）

### Phase 1 · 跑起来最小骨架（半天）
1. `cp -r themes/heo themes/xiyu` 作为起点
2. 清空所有 Layout，只保留 `index.js` 的 export 骨架
3. 写 `LayoutBase.js`：引入 Google Fonts + 把 `source/styles.css` + `source/pages.css` 全部塞进 `<style jsx global>`
4. 写 `components/SiteNav.js` + `components/SiteFoot.js`（从 `source/shared.jsx` 搬）
5. 写最简 `LayoutIndex.js`：吃 `props.posts`，`map` 一遍用 `<ArticleRow>` 渲染
6. `blog.config.js` 改 `THEME: 'xiyu'`，`yarn dev` 确认首页起码不报错

### Phase 2 · 首页完整化（半天）
7. `components/Hero.js` 从 `source/home.jsx` 摘出 hero 区，stats 数字从 `posts.length` / 年份差计算
8. `components/NowCard.js` · "最近在想"卡 · 建议从 Notion 读一个 slug 为 `now` 的 Page 的第一段作为引言；读不到就 fallback 到最新文章的 summary
9. `components/FeaturedCard.js` 搬过来，渲染 `posts[0]`
10. `LayoutIndex.js` 完整串起：Hero + FeaturedCard + ArticleRow list + Pagination

### Phase 3 · 文章详情（半天）
11. `LayoutSlug.js` · 骨架 = `.article-layout` 三栏布局
12. `components/TOC.js` · 消费 `props.toc` (NotionNext 生成的 heading 数组)
13. `components/ArticleSide.js` · 字数/时长/分享，字数从 `post.blockMap` 粗估或直接 `post.wordCount`
14. 正文区用 NotionNext 原生的 `<NotionPage post={post} />`，外层加 `.article-body` 套壳
15. `components/PrevNext.js` · `props.prev` / `props.next` 是 NotionNext 传的

### Phase 4 · 归档 + 关于（半天）
16. `LayoutArchive.js` · 消费 `props.archivePosts`（NotionNext 已按年份分组 `{ 2026: [...], 2025: [...] }`）
17. `LayoutPage.js` · 判断 `post.slug === 'about'`，走定制布局（AboutHero + AboutFacts + Colophon + Topics）；其它 page 走通用 `NotionPage` 渲染
18. `components/Topics.js` · 消费 `props.tagOptions`（NotionNext 的标签统计）

### Phase 5 · 配件页（半天）
19. `LayoutPostList.js` · 给分类/标签/搜索页复用，结构 = `SectionHead + ArticleRow * n + Pagination`
20. `LayoutSearch.js` / `LayoutCategoryIndex.js` / `LayoutTagIndex.js` · 都基于 `LayoutPostList`
21. `Layout404.js` · 简单页，不需要复杂

### Phase 6 · 打磨（半天）
22. 浅/深模式切换：接上 NotionNext 的 `useGlobal().isDarkMode`，给 `<html>` 加 `data-theme="dark"`（CSS 里已经写好）
23. `ThemeToggle.js` 按钮接上 dispatch
24. 字体 preload 优化（`<link rel="preload" as="font">`）
25. favicon / OG image · 把 `brand-assets/` 里的东西按 `brand-assets/README.md` 第 1-3 步搬到 `public/`
26. 改 `pages/_document.js` · 贴 `brand-assets/head-snippet.html` 的内容

---

## ⚠️ 注意事项

- **NotionNext 有原生的 `LayoutBase`** 在主题目录下，里面自带 `Loading`、`AdminBar` 等。你自己的 `LayoutBase` 如果继承自 heo 的，注意只替换视觉外壳，别把 NotionNext 的内部机制砍了
- **字体必须 `display=swap`**，否则首屏会长时间白屏
- **`<style jsx global>` 里不要用 CSS 变量 `var(--xxx)` 语法在某些 styled-jsx 版本会被转义**，如果遇到 → 用字符串模板 `${}` 或者直接改用独立 `.css` 文件通过 `_app.js` import
- **深色模式**：CSS 里用的是 `[data-theme="dark"]`。NotionNext 自己的 dark 用的可能是 `.dark` 或 `html.dark`。需要做一次适配 —— 要么改 CSS、要么改开关脚本。选择改 CSS（全局 replace 一次即可）
- **图片**：NotionNext 默认会处理 Notion 里的图片 URL，不需要你自己做。只有主题自带的 logo / og-image 从 `public/` 走
- **没有 Notion 数据时的 fallback**：`posts` 可能是空数组，别崩。Hero stats 要算动态数字；文章列表空时显示"还没开始写"

---

## ✅ 验收清单

- [ ] `yarn dev` 无报错 · 首页正常
- [ ] `/` 首页 · Hero + Featured + ArticleRow list + 分页
- [ ] `/archive` 归档页 · 按年份分组、sticky 年份、hover 缩进
- [ ] `/article/<slug>` 文章详情 · 左 TOC、中正文（首字下沉）、右侧栏、上一篇/下一篇
- [ ] `/about` 关于页 · AboutHero + 四宫格 stats + Elsewhere 链接 + Topics 网格 + Colophon
- [ ] `/category/<name>` · 列表页
- [ ] `/tag/<name>` · 列表页
- [ ] `/search?q=xxx` · 搜索结果
- [ ] 浅/深模式切换正常，切换后刷新保留
- [ ] Tab 图标 16px 下可辨
- [ ] iOS "添加到主屏" 图标正常
- [ ] 分享到 Twitter / Telegram 能拿到 OG 图
- [ ] Lighthouse Performance ≥ 85

---

## 📝 提交时

在主题目录下写一份 `themes/xiyu/README.md`，告诉用户：
1. 怎么启用（改 `THEME`）
2. Notion 数据库需要哪些 property
3. 哪些 property 是可选的
4. 常见问题（字体加载慢、深色模式不切换等）

祝施工顺利 🛠

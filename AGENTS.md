# AGENTS.md

给在这个仓库里干活的 AI agent 看的。人也可以看。

---

## 这是什么

**xiyu.im —— 一个人的博客。** 内容写在 Notion，站点用 Next.js 渲染，部署在 Vercel。

代码源自 [NotionNext](https://github.com/tangly1024/NotionNext)，但**本仓库不是 NotionNext 的发行版**：
不对外分发、不接受主题投稿、不维护面向用户的文档站、不承诺跟上游同步。

### 这条为什么重要

上游 NotionNext 是"一套代码给几百人用"的产品，因此它的目录里有 29 套主题、22 个配置文件、
一个 VitePress 用户文档站、一套登录体系、Docker 发布流水线、给 fork 用的上游同步 workflow。
**这些抽象对本仓库全部不成立。**

判断某段代码该不该留，标准只有一条：**xiyu.im 这一个站点需不需要它。**
"上游有""别的用户可能要""保持可切换性"都不是理由。

历史教训：曾经有一次审计把 `themes/`、`docs/`、Clerk 判成"产品面、不可删"，
依据是 README 写着"主题全览""用户作品"——那份 README 是上游的，不代表本仓库的定位。
**别再被上游的痕迹误导。**

---

## 架构速览

| | |
|---|---|
| 框架 | Next.js 15，**Pages Router**（不是 App Router） |
| 数据源 | Notion，走 `notion-client` 的非官方 API |
| 渲染 | `getStaticProps` + ISR（`revalidate`），按需刷新走 `POST /api/revalidate` |
| 主题 | 只有 `themes/xiyu`。`themes/theme.js` 负责动态装配布局 |
| 样式 | Tailwind + `public/css/xiyu.css`（站点自定义） |
| 部署 | Vercel |
| Node | 22（见 `.nvmrc`） |

关键路径：

```
pages/[prefix]/index.js     文章详情页
lib/db/getSiteData.js       Notion 数据聚合入口
lib/db/notion/              Notion 解析（目录提取、页面属性等）
themes/xiyu/                唯一主题
conf/                       分领域配置，blog.config.js 汇总
public/css/xiyu.css         站点自定义样式
```

---

## 常用命令

```bash
yarn dev            # 本地开发
yarn build          # 生产构建（BUILD_MODE=true）
yarn test           # jest（不写具体数量，写了就会过期）
yarn lint           # next lint
yarn type-check     # tsc --noEmit
yarn bundle-report  # ANALYZE=true 构建，看产物构成
```

CI（`.github/workflows/ci.yml`）跑四件事：`Lint & type-check`、`Unit tests`、
`Lockfile consistency`、`VitePress build`。

---

## 改之前必须知道的坑

这些都是真出过问题、修完留下的记录。改到相关区域时先读这一节。

### 1. 文章详情页的 grid 不能依赖「DOM 里有几个子元素」

`<TOC>` 在文章没有标题块时 `return null`——**React 不产生任何 DOM 节点**（这跟 `display:none`
完全不同）。当年 `.article-layout` 是三栏、三个子元素平铺，grid 的隐式自动布局就按
"现存子元素数量"重新分配轨道：正文被挤进本该给目录的窄列，右侧留一大片空白。
触发条件是**文章没有二级标题**，不是"文章年代久远"。

现在是两栏 `210px minmax(0, 1fr)`，防线有两层：

1. **结构**：`<TOC>` 和 `<ArticleSide>` 一起包在 `.article-rail` 里，
   grid 的直接子元素恒为 `.article-rail` + `<article>` 两个，TOC 返回 null 也改不了这个数。
2. **样式**：这两个子元素仍各自显式写 `grid-column`。

**别把 TOC 从 rail 里挪出去，也别删那两行 `grid-column`**，
`__tests__/styles/article-layout-grid.test.js` 两层都盯着。

顺带：rail 在 DOM 里排在 `<article>` 前面，所以 ≤1024px 收成单栏时用的是
`flex-direction: column` + `order`，不是 `display: block`——block 流没法把它挪到正文下方。

**`/about` 也走这套骨架**（`.article-layout.about-layout`），左轨里是
目录 + 站点数字 + 联系方式。两个差别：

- 关于页的目录是**合成**的（`AboutRail` 用 `eraAnchor(i)` 生成 `{id,text,indentLevel}`
  喂给同一个 `<TOC>`），正文那边的 `id` 必须用同一个 `eraAnchor()` 生成——
  两边对不上，滚动高亮就是死的，页面看不出问题。测试盯着这条。
- ≤768px 时文章页把整根 rail `display:none` 了；关于页**不能**跟着藏，
  站点数字和联系方式只存在于轨里。所以 `.about-layout` 在那个断点单独
  保持 flex + order。

### 2. Notion 的折叠标题既是标题、又有子内容

`lib/db/notion/getPageTableOfContents.js` 里，"这个块是不是标题"和"这个块有没有子内容"
必须当成两件独立的事处理。写成 `if/else` 二选一，折叠标题（toggle heading）就会从目录里消失——
它折叠起来的内容是它的子节点，两个条件同时成立。

同一个函数里有贯穿递归的 `visited: Set`，用来防同步块（transclusion）互相引用成环时爆栈。
**别把它优化掉。**

### 3. `notion-utils` 只发 ESM

`jest.config.js` 的 `transformIgnorePatterns` 是 `'/node_modules/'` 一刀切。
任何 import 了 `notion-utils` 的测试文件会在**加载阶段**就 `SyntaxError`，整个 suite 跑不起来。

现有做法是在测试里 `jest.mock('notion-utils', ...)`。放宽 `transformIgnorePatterns` 会波及
另外 53 个 suite 的加载，代价不对等。

### 4. `console.*` 的第一个参数是格式字符串

CodeQL 的 `js/tainted-format-string` 会在这里报警：任何把用户输入（HTTP body、query）
直接放进 `console.log(userInput)` 第一个参数位的写法都会被拦。

**`String.replace()` 不是 CodeQL 认可的净化手段**，别指望转义能过。
正确做法是固定格式字符串：`console.log('[%s] %s', tag, msg)`。

### 5. `notion-client` 的构造参数是 `ofetchOptions`

`notion-client@7.x` 的构造签名是 `{apiBaseUrl, authToken, activeUser, userTimeZone, ofetchOptions}`。
曾经这里传的是 `kyOptions`——那是旧版本的名字，新版本**静默丢弃**它，导致请求不带 User-Agent，
Notion 直接回 403，整站空白。

改 `lib/db/notion/getNotionAPI.js` 时，先去 `node_modules/notion-client/build/index.js`
确认当前版本的参数名，别照抄网上的示例。

### 6. `yarn.lock` 里有 713 个 `resolved` 指向 `registry.npmmirror.com`

yarn 1 **按 lockfile 里的 URL 取包**，忽略你配置的 registry。在拿不到 npmmirror 的网络环境里
（比如某些 CI 沙箱）`yarn install` 会直接失败。

需要在这种环境里装依赖时，把 lockfile **副本**里的 URL 改写成 `registry.npmjs.org` 再装，
tarball 内容一致、integrity 校验仍然成立。**不要**因此去改仓库里的 `yarn.lock`，除非是专门的一个 PR。

### 7. `jsdom` 的 `canvas` 是可选原生依赖

用 `--ignore-scripts` 装依赖时 `canvas` 不会编译，41 个 suite 会以
`Cannot find module '../build/Release/canvas.node'` 失败。
`rm -rf node_modules/canvas` 即可，jsdom 会优雅降级。

### 8. shadcn 组件必须拆成「轻触发器 + 懒加载面板」

`components/ui/` 下的交互组件（⌘K 面板、移动端抽屉）都是一对文件：

| 轻 | 重 |
|---|---|
| `CommandPalette.js` | `CommandDialog.js` |
| `MobileNav.js` | `MobileNavDrawer.js` |

轻的那半只有按钮和键盘监听，进首屏；重的那半用 `next/dynamic` 在首次打开时才拉。
**直接静态 import 会把 Radix + cmdk 塞进共享的 `_app` chunk，实测首屏 JS 从 219 kB 涨到 246 kB。**
拆开之后是 220 kB。加新的 shadcn 组件时照这个模式来。

不要整体 `dynamic()`：那样触发按钮在 chunk 到达前不渲染，导航栏会闪。

### 9. Radix 的内容渲染在 portal 里，取不到 `#theme-xiyu` 的变量

Dialog / DropdownMenu 的内容挂在 `document.body` 下，而站点的颜色令牌原本
只定义在 `:root` 和 `#theme-xiyu` 上。`public/css/xiyu.css` 末尾的「Tailwind 令牌桥」
把 RGB 三元组同时写进 `:root` / `html.dark` / `#theme-xiyu` / `html.dark #theme-xiyu`
四个作用域，portal 里的组件才能正确取色。

**改颜色时，上面的 hex 和末尾的 `-rgb` 必须一起改。**

### 10. 首屏组件用 `cx`，懒加载组件才用 `cn`

两个几乎同名的工具，区别只有一个依赖：

| | 依赖 | 给谁用 |
|---|---|---|
| `lib/cx.js` 的 `cx` | 只有 `clsx` | 会进首屏的（Card / Badge） |
| `lib/cn.js` 的 `cn` | `clsx` + `tailwind-merge` | 只在懒加载的（CommandDialog / MobileNavDrawer） |

**它们必须待在两个文件里。** 放同一个模块时，只要首屏组件 import 了其中任何一个导出，
webpack 就会把整个模块连同 `tailwind-merge` 一起打进 `_app` chunk——tree shaking 摘不掉。
实测：合在一起 231 kB，拆开 222 kB。想确认有没有漏进去，
`grep -c conflictingClassGroups .next/static/chunks/pages/_app-*.js`，那是 tailwind-merge
压缩后仍然认得出的数据表，应该是 0。

代价：用 `cx` 的组件，调用方**不能**靠传 `className` 去覆盖同属性的基础工具类
（给 `py-[18px]` 的组件传 `py-1.5` 不保证赢，胜负取决于产物顺序）。
需要不同尺寸时加语义类——用两个类名（`.a .b`，0-2-0）稳压 Tailwind 的单类（0-1-0）——
或者给组件开一个 variant。

### 11. 不要用 `extend.fontFamily` 覆盖 `sans` / `serif`

`tailwind.config.js` 顶层的 `theme.fontFamily` 来自 `lib/utils/font.js`，是全站字体。
在 `extend` 里写同名 key 会把它覆盖掉，全站字体都变。
shadcn 组件要用的字体已另起名为 `font-xiyu-serif` / `font-xiyu-mono`。

### 12. 站点只有一套视觉语言，加新区块前先去找现成的类

这个博客的语言是**细线、留白、大衬线字 + mono 小标签**，全站只有一张卡
（首页右上角的 Now）。有过三次返工：关于页、归档页、文章左轨都曾被改成
shadcn 的卡片风，然后又一个个改回来。加区块之前先看有没有现成的：

| 想要的东西 | 用这个 | 别新造 |
|---|---|---|
| 区块标题（橙短线 + 标签 + 延伸到右的细线） | `.rule-head` + `.rule-head-rule` / `.rule-head-count` | 首页年份、归档年份、关于页区块**都是它** |
| 一组数字 | `.hero-meta` + `.hero-meta-num` / `.hero-meta-label` | 首页、归档、关于页共用 |
| 「在想 / 在做」那一行 | `.hero-status` + `.hero-status-label` / `.hero-status-topics` | |
| 页面顶部的小字 | `.eyebrow` | |
| 行内链接 | `.inline-link`（常态带下划线，hover 变色） | 别用按钮 |
| 左轨里的段落起头 | `.toc-label` / `.side-label`（同一条规则） | |

**别把共用样式写成 inline style。** `.rule-head` 就是因为首页当初写成了 JSX 里的
inline style、关于页另写一套 CSS，两边长得像但各改各的，后来才合并的。

### 13. 组件里不能直接读 `Date`，日期要从 `getStaticProps` 传进来

首页大标题「旧文重读」每天换一篇。轮换的种子是 `pages/index.js` 里算好、
当作 `props.renderedOn` 传下来的 UTC 日期字符串（`Hero` 再拿它做 FNV-1a 取模）。

**不能在组件里 `new Date()`**：SSG 的 HTML 是构建那天生成的，客户端 hydration
是访问那天算的，两边选中的文章不一样，React 会报 hydration 不匹配。
同理不能用 `Math.random()`。`themes/xiyu/lib/format.js` 里所有日期函数都走 UTC，
也是这个原因（`formatYear` / `parseUTC`）。

### 14. 沙箱里跑不出真实页面，别拿本地渲染当验证

构建时到 `app.notion.com` 的请求会 403（每次 9 条错误，`main` 上也一样，
不是谁改坏的），于是**文章数据是空的**——首页 Hero、归档列表在本地都渲染不出内容。
`yarn build` 能过只说明代码能编译。

还有个坑：`.next/server/pages/zh-CN.html` 是上一次构建留下的，
`yarn start` 会照旧供它，看起来像"改了没生效"。要验证输出先 `rm -rf .next` 再构建，
然后直接 grep 那个 html，别去 curl `next start`。

真正的视觉验证只有 Vercel 的 PR preview。需要在本地断言渲染结果时，
写 `__tests__/themes/` 下那种带假数据的 RTL 测试。
注意 `toHaveTextContent` 是**子串**匹配，断言「不是第 1 篇」时它会被「文章 12」骗过去，
这种地方要用全等。

---

## 验证改动

按代价从低到高：

1. `yarn test` —— 秒级，先跑这个
2. `yarn lint && yarn type-check`
3. `yarn build` —— 真正的门禁。构建会去 Notion 拉数据，需要网络能到 `notion.so`
4. Vercel 的 PR preview —— 视觉/运行时问题只有这里能发现

**改主题布局、CSS、目录提取逻辑时，测试全绿不代表没问题**——这三处的问题通常只在渲染后可见，
一定要看 preview（原因见第 14 条）。

---

## 别做的事

- **别为了"以后可能用得上"保留代码。** git 历史里什么都在，需要时捞得回来。
- **别在没量之前优化。** 有过一次教训：从文件大小推断"CI 每次都在下载 173MB 文档图片"，
  实测发现 `actions/checkout` 用的是 `--filter=blob:none` 部分克隆，整个 checkout 只有 2.5 秒。
  先看计时器，再动手。
- **别直接推 `main`。** 开分支 → PR → 等 CI 绿 → 合并。
- **别在 commit message、PR 描述、代码注释里写模型名。**
- **改 Notion 里的文章内容前先问。** 站点内容是作者本人写的，措辞不是随便能动的。

---

## 内容侧的约定

文章写在 Notion 数据库里，字段：`title` / `slug` / `status`（`Published` 才发布）/
`category` / `tags` / `date` / `summary` / `password`。

文章要出目录，正文里必须有**真正的标题块**（标题 1/2/3）。
纯文本行看着像小标题也不会进目录——折叠标题现在是支持的。

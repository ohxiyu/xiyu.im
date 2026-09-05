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
yarn test           # jest，54 个 suite / 295 个用例
yarn lint           # next lint
yarn type-check     # tsc --noEmit
yarn bundle-report  # ANALYZE=true 构建，看产物构成
```

CI（`.github/workflows/ci.yml`）跑四件事：`Lint & type-check`、`Unit tests`、
`Lockfile consistency`、`VitePress build`。

---

## 改之前必须知道的坑

这些都是真出过问题、修完留下的记录。改到相关区域时先读这一节。

### 1. 文章详情页是三栏 grid，每个子元素都要显式声明 `grid-column`

`public/css/xiyu.css` 里 `.article-layout` 是 `grid-template-columns: 200px 1fr 200px`。

`<TOC>` 在文章没有标题块时 `return null`——**React 不产生任何 DOM 节点**（这跟 `display:none`
完全不同）。于是 grid 的隐式自动布局会按"现存子元素数量"重新分配轨道，正文被挤进本该给目录的
200px 窄列，右侧留一大片空白。

所以 `.toc` / `article` / `.article-side` 三者都显式写死了 `grid-column`。
**不要删这三行**，`__tests__/styles/article-layout-grid.test.js` 会盯着它们。

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

---

## 验证改动

按代价从低到高：

1. `yarn test` —— 秒级，先跑这个
2. `yarn lint && yarn type-check`
3. `yarn build` —— 真正的门禁。构建会去 Notion 拉数据，需要网络能到 `notion.so`
4. Vercel 的 PR preview —— 视觉/运行时问题只有这里能发现

**改主题布局、CSS、目录提取逻辑时，测试全绿不代表没问题**——这三处的问题通常只在渲染后可见，
一定要看 preview。

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

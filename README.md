# xiyu.im

我的个人博客。内容写在 [Notion](https://www.notion.so)，站点用 Next.js 渲染，部署在 Vercel。

线上地址：<https://www.xiyu.im>

---

## 这是什么

一个人的博客，不是一个可供他人使用的产品。

代码起源于 [NotionNext](https://github.com/tangly1024/NotionNext)——一个很好的开源项目，
感谢作者。但本仓库已经按自己的需要做了大幅裁剪：只保留一套主题、去掉了登录体系与多部署目标、
移除了面向其他用户的文档站。**不再跟上游同步，也不建议直接 fork 本仓库来搭博客**——
想用 NotionNext 请去上游，那里的完整版本才是给你的。

## 技术栈

| | |
|---|---|
| 框架 | Next.js 15，Pages Router |
| 内容 | Notion 作 CMS，走 `notion-client` |
| 渲染 | `getStaticProps` + ISR，按需刷新走 `POST /api/revalidate` |
| 样式 | Tailwind CSS + `public/css/xiyu.css` |
| 主题 | `themes/xiyu`（唯一） |
| 部署 | Vercel |

## 本地跑起来

需要 Node 22（见 `.nvmrc`）。

```bash
yarn install
cp .env.example .env.local   # 填入 NOTION_PAGE_ID
yarn dev
```

常用命令：

```bash
yarn build          # 生产构建
yarn test           # 单元测试
yarn lint           # ESLint
yarn type-check     # tsc --noEmit
yarn bundle-report  # 分析产物构成
```

## 目录

```
pages/           路由（Pages Router）
  [prefix]/      文章详情页
  api/           revalidate、rss、og 等
components/      跨主题通用组件
themes/xiyu/     站点主题
lib/             Notion 数据层、缓存、工具
  db/notion/     Notion 解析（目录提取、页面属性）
conf/            分领域配置，由 blog.config.js 汇总
public/css/      站点自定义样式
```

## 给 AI agent

如果你是在这个仓库里干活的 AI，请先读 [`AGENTS.md`](./AGENTS.md)。
那里写了产品定位、必须知道的坑，以及不该做的事。

## 许可

源项目 NotionNext 采用 MIT 许可，本仓库沿用。见 [LICENSE](./LICENSE)。

# 控制 Vercel ISR 写入额度

Vercel 免费版每月 200,000 次 ISR 写入。这份文档说明写入量是怎么被烧掉的、
本仓库做了哪些改动，以及日常怎么操作。

## 写入量是怎么算的

ISR 的机制是：页面在 `revalidate` 秒内是纯静态的；超过之后**下一个访问**会触发
后台重新生成，生成完把新页面写进缓存——**这一次写入就计入额度**。

关键点：**写入量由「有流量的页面数 × 每天再生次数」决定，跟你发了几篇文章没关系。**

| revalidate | 单个持续有流量的页面 | 每天写入 | 每月写入 |
|---|---|---|---|
| 60 秒 | 每分钟再生一次 | ~1,440 | ~43,200 |
| 3600 秒 | 每小时再生一次 | 24 | ~720 |
| 86400 秒 | 每天再生一次 | 1 | ~30 |

按 60 秒算，**只要 5 个页面被持续访问（含爬虫），一个月就是 216,000 次，直接爆额度。**

## 两个元凶

### 1. `NEXT_REVALIDATE_SECOND = 60`

原默认值。全站 18 条路由都用它。这是最主要的放大器。

**已改为 3600（1 小时），写入量降到原来的 1/60。**

### 2. `/search/[keyword]` 的关键词空间是无界的

这条路由是 `fallback: true`，意味着**任何**关键词被访问时都会现场生成一个新页面
并写一次缓存。爬虫或者随手改 URL 的人可以无限制地制造写入，而且生成之后这些页面
还会各自按 revalidate 间隔持续再生。

三处修复：

- 搜索路由改用独立的 `SEARCH_REVALIDATE_SECOND`（默认 86400，一天一次）
- `robots.txt` 加 `Disallow: /search/`，不让爬虫去制造这些页面
- 这些页面的内容本来就由客户端从 `allPosts` 实时过滤，频繁再生没有意义

## 代价与补偿

调到 1 小时之后，改完 Notion 最多要等 1 小时才生效。

补偿手段是**按需刷新**：配置环境变量 `REVALIDATE_SECRET` 后，可以主动刷指定页面。

```bash
# 刷新首页
curl "https://www.xiyu.im/api/revalidate?secret=你的密钥&path=/"

# 刷新单篇文章
curl "https://www.xiyu.im/api/revalidate?secret=你的密钥&path=/my-post"

# 一次刷多个（一次最多 20 个）
curl "https://www.xiyu.im/api/revalidate?secret=你的密钥&path=/&path=/about"
```

返回：

```json
{ "ok": true, "revalidated": ["/"], "failed": [] }
```

部分失败返回 HTTP 207，`failed` 里会说明原因。

安全约束：

- 未配置 `REVALIDATE_SECRET` 时接口直接返回 503（不会变成公开的回源端点）
- secret 用常数时间比较，防止用响应时间猜
- path 必须是站内绝对路径，挡掉 `//evil.com`、`../` 和控制字符
- 一次最多 20 个路径，防止单个请求打爆 Notion 配额

## 需要在 Vercel 配置什么

改动已经把默认值写进 `blog.config.js`，**不配任何环境变量也会生效**。

想调整的话：

| 变量 | 默认 | 说明 |
|---|---|---|
| `NEXT_PUBLIC_REVALIDATE_SECOND` | 3600 | 全站再生间隔（秒） |
| `NEXT_PUBLIC_SEARCH_REVALIDATE_SECOND` | 86400 | 搜索页再生间隔（秒） |
| `REVALIDATE_SECRET` | 无 | 配置后启用 `/api/revalidate` |

## 额度已经打满了怎么办

额度是按月重置的，等下个账单周期即可。在那之前：

- 已生成的页面**仍然正常访问**，只是不再更新（Vercel 超额后停止写入，不停止读取）
- 部署本身不受影响

如果 3600 秒还是嫌多，可以继续往上调（比如 21600 = 6 小时），
配合 `/api/revalidate` 做到「平时几乎不写，发文时手动刷一次」。

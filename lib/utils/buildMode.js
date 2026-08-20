/**
 * 构建模式
 *
 * 这里有两个容易混淆的概念，必须分清：
 *
 * isExport()     —— 真·静态导出（next.config.js 会设 output:'export'）。
 *                   产物是纯 HTML，**没有 Node 服务端**：API 路由、
 *                   getServerSideProps 全部不可用。
 *
 * isFullStatic() —— 全量预渲染 + 关闭 ISR，但**保留 Next 服务端**。
 *                   所有页面在构建期生成，运行时不再回源 Notion、
 *                   也不产生任何 ISR 写入；API 路由和 SSR 页面照常工作。
 *
 * 之前这两件事被 isExport() 一个开关捆在一起，导致「想去掉 ISR」就必须
 * 连 API 路由一起砍掉。拆开后，默认走 isFullStatic()。
 *
 * 为什么默认全量静态：
 *   ISR 的写入量 = 有流量的页面数 × 每天再生次数，与发文频率无关。
 *   revalidate=60 时单页每天约 1440 次写入，几个页面就能打满 Vercel
 *   免费版 200,000 次/月的额度（已实际发生过）。
 *   另外 ISR 会在运行时回源 Notion——Notion 一旦抖动或返回 403，
 *   空数据就可能被生成并缓存，首页直接变空。全量静态后这条路径不存在：
 *   构建失败则保留上一个成功的部署，站点不会变空。
 *
 * 代价：发文后不会自动上线，需要触发一次重新构建。
 */
function isExport() {
  return process.env.EXPORT === 'true'
}

/**
 * 是否全量预渲染且不启用 ISR
 * 默认开启；确需回到 ISR 模式时设 FULL_STATIC=false
 */
function isFullStatic() {
  if (isExport()) return true
  return process.env.FULL_STATIC !== 'false'
}

module.exports = { isExport, isFullStatic }

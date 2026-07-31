# 付费阅读（USDT）配置指南

给某篇文章设个价，读者转 USDT 后粘贴交易哈希即可永久解锁。支持 BSC / ERC20 / TRC20。

## 一、Notion 侧

### 1. 文章数据库加一列
| 列名 | 类型 | 说明 |
|---|---|---|
| `price` | Number（或 Text） | 售价，如 `5`。**留空 = 免费文章** |

### 2. 新建订单数据库（可选但强烈建议）
不建的话交易哈希不会去重——一个人付款后把哈希发出去，别人也能解锁。

新建一个 Notion 数据库（名字随意，比如「付费订单」），加这些列：

| 列名 | 类型 |
|---|---|
| `txHash` | **Title**（必须是标题列） |
| `slug` | Text |
| `chain` | Select |
| `amount` | Number |
| `payer` | Text |

然后：
1. 打开 https://www.notion.so/my-integrations → New integration → 拿到 `secret_xxx` token
2. 回到订单数据库页面 → 右上 `…` → Connections → 连接刚建的 integration
3. 复制数据库 ID：URL 里 `notion.so/xxxxx?v=yyy` 中的 `xxxxx` 那段

## 二、环境变量（Vercel → Settings → Environment Variables）

必填：
```
PAYWALL_EVM_ADDRESS   = 0x...        # BSC 和 ERC20 共用
PAYWALL_TRON_ADDRESS  = T...         # 不收 TRC20 可留空
PAYWALL_JWT_SECRET    = 一串长随机字符串（≥16位）
```

订单去重（建议填）：
```
NOTION_API_KEY        = secret_xxx
PAYWALL_ORDERS_DB_ID  = 订单数据库 ID
```

可选：
```
PAYWALL_PREVIEW_BLOCKS = 2      # 免费预览几段，默认 2
PAYWALL_MAX_AGE_DAYS   = 30     # 超过 N 天的付款不再接受，默认 30
PAYWALL_TOKEN_TTL_SEC  =        # 凭证有效期秒数，留空 = 永久
PAYWALL_BSC_RPC / PAYWALL_ETH_RPC / PAYWALL_TRON_API   # 自建节点，留空用公共节点
PAYWALL_TRON_API_KEY                                   # TronGrid key，提高限额
```

> ⚠️ 只配 `PAYWALL_EVM_ADDRESS` 就只显示 BSC / ERC20 两个 tab；只配 Tron 地址就只显示 TRC20。没配地址的链不会出现在付费墙上。

## 三、工作原理

```
Notion price > 0
   ↓
getStaticProps（resolvePostProps）
   → applyPaywall() 剥离 blockMap / content / toc，只留前 N 段预览
   → 正文绝不进入 __NEXT_DATA__
   ↓
读者看到付费墙：选链 → 转账 → 粘贴 TX Hash
   ↓
POST /api/unlock
   ① Notion 订单表查这笔 hash 用过没
   ② RPC 验链上：交易成功 / 收款地址正确 / USDT 合约正确 / 金额足够 / 未超时效
   ③ 写订单 + 签发 JWT
   ④ 返回完整 blockMap
   ↓
凭证存 localStorage，回访自动解锁
```

## 四、内容防泄漏清单

付费文章的正文在这些地方都已阻断：
- ✅ 页面 HTML / `__NEXT_DATA__`（`applyPaywall` 剥离）
- ✅ RSS（`createFeedContent` 只输出摘要）
- ✅ Algolia 全文索引（`processPostData` 跳过付费文章）
- ✅ `/api/unlock` 响应设 `Cache-Control: no-store`

## 五、常见问题

**读者说付了但解锁失败**
1. 让他确认选对了链（BSC 付的款不能在 ERC20 tab 提交）
2. 查 Vercel Functions 日志里的 `[paywall]` 开头的行
3. 实在不行：在 Notion 订单表手动加一行（txHash 填任意唯一值），但这不会自动解锁——直接把文章内容发他，或临时把 `price` 清空

**想给某人免费看**
把 `price` 暂时清空，等他看完再填回去。

**改价格**
直接改 Notion 的 `price`，60 秒后生效。已购买者的凭证不受影响（凭证绑的是 slug，不是价格）。

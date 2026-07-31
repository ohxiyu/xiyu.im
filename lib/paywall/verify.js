/**
 * 链上 USDT 转账验证：给定 txHash，确认这是一笔到本站收款地址的、金额足够的 USDT 转账
 * 用原生 fetch 调 RPC，零依赖
 */
import { CHAINS, getReceiveAddress } from './chains'

// keccak256("Transfer(address,address,uint256)")
const TRANSFER_TOPIC =
  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'

const B58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

/** Tron base58 地址 -> 41 开头的 hex（不带 0x），用于和链上日志比较 */
function tronBase58ToHex(addr) {
  let num = 0n
  for (const ch of addr) {
    const idx = B58_ALPHABET.indexOf(ch)
    if (idx < 0) throw new Error('非法 Tron 地址')
    num = num * 58n + BigInt(idx)
  }
  let hex = num.toString(16)
  if (hex.length % 2) hex = '0' + hex
  // 去掉尾部 4 字节校验和，保留 21 字节地址体
  return hex.slice(0, hex.length - 8).padStart(42, '0').toLowerCase()
}

/** 把最小单位金额换算成人类可读的 USDT 数值 */
function toAmount(rawHexOrDec, decimals) {
  const raw =
    typeof rawHexOrDec === 'string' && rawHexOrDec.startsWith('0x')
      ? BigInt(rawHexOrDec)
      : BigInt(rawHexOrDec)
  const base = 10n ** BigInt(decimals)
  const whole = raw / base
  const frac = raw % base
  return Number(whole) + Number(frac) / Number(base)
}

async function rpc(url, method, params) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params })
  })
  if (!res.ok) throw new Error(`RPC ${method} HTTP ${res.status}`)
  const json = await res.json()
  if (json.error) throw new Error(`RPC ${method}: ${json.error.message}`)
  return json.result
}

/** EVM 链（BSC / Ethereum）验证 */
async function verifyEvm(chain, txHash, receiver) {
  const receipt = await rpc(chain.rpc, 'eth_getTransactionReceipt', [txHash])
  if (!receipt) return { ok: false, reason: '交易不存在或尚未上链，请稍后重试' }
  if (receipt.status !== '0x1') return { ok: false, reason: '该交易执行失败' }

  const want = receiver.toLowerCase()
  const transfer = (receipt.logs || []).find(log => {
    if ((log.address || '').toLowerCase() !== chain.usdt) return false
    if (!log.topics || log.topics[0] !== TRANSFER_TOPIC) return false
    // topics[2] 是收款方，32 字节右对齐
    const to = '0x' + log.topics[2].slice(26).toLowerCase()
    return to === want
  })
  if (!transfer) {
    return { ok: false, reason: '该交易中没有找到转入本站收款地址的 USDT' }
  }

  const amount = toAmount(transfer.data, chain.decimals)
  const from = '0x' + transfer.topics[1].slice(26).toLowerCase()

  // 取区块时间用于时效校验
  let timestamp = null
  try {
    const block = await rpc(chain.rpc, 'eth_getBlockByNumber', [
      receipt.blockNumber,
      false
    ])
    if (block?.timestamp) timestamp = Number(BigInt(block.timestamp)) * 1000
  } catch (e) {
    /* 时间拿不到就跳过时效校验 */
  }

  return { ok: true, amount, from, timestamp }
}

/** Tron（TRC20）验证 */
async function verifyTron(chain, txHash, receiver) {
  const clean = txHash.replace(/^0x/, '')
  const headers = { 'Content-Type': 'application/json' }
  if (process.env.PAYWALL_TRON_API_KEY) {
    headers['TRON-PRO-API-KEY'] = process.env.PAYWALL_TRON_API_KEY
  }

  const res = await fetch(`${chain.rpc}/wallet/gettransactioninfobyid`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ value: clean })
  })
  if (!res.ok) throw new Error(`TronGrid HTTP ${res.status}`)
  const info = await res.json()
  if (!info || !info.id) {
    return { ok: false, reason: '交易不存在或尚未上链，请稍后重试' }
  }
  if (info.receipt?.result && info.receipt.result !== 'SUCCESS') {
    return { ok: false, reason: '该交易执行失败' }
  }

  const usdtHex = tronBase58ToHex(chain.usdt)
  const wantHex = tronBase58ToHex(receiver)

  const transfer = (info.log || []).find(log => {
    // log.address 是不带 41 前缀的 20 字节 hex
    const contract = ('41' + (log.address || '')).toLowerCase()
    if (contract !== usdtHex) return false
    const topics = log.topics || []
    if (topics[0]?.toLowerCase() !== TRANSFER_TOPIC.slice(2)) return false
    const to = ('41' + topics[2].slice(24)).toLowerCase()
    return to === wantHex
  })
  if (!transfer) {
    return { ok: false, reason: '该交易中没有找到转入本站收款地址的 USDT' }
  }

  const amount = toAmount('0x' + transfer.data, chain.decimals)
  const from = '41' + (transfer.topics[1] || '').slice(24)
  return {
    ok: true,
    amount,
    from,
    timestamp: info.blockTimeStamp || null
  }
}

/**
 * 统一入口
 * @returns {{ok:boolean, reason?:string, amount?:number, from?:string, timestamp?:number}}
 */
export async function verifyPayment({ chainId, txHash, minAmount }) {
  const chain = CHAINS[chainId]
  if (!chain) return { ok: false, reason: '不支持的链' }

  const receiver = getReceiveAddress(chainId)
  if (!receiver) return { ok: false, reason: `${chain.name} 收款地址未配置` }

  // 基本格式校验，避免把垃圾串打到 RPC
  const clean = txHash.trim()
  if (!/^(0x)?[0-9a-fA-F]{64}$/.test(clean)) {
    return { ok: false, reason: '交易哈希格式不正确' }
  }

  const hash = chain.kind === 'evm'
    ? (clean.startsWith('0x') ? clean : '0x' + clean)
    : clean

  let result
  try {
    result = chain.kind === 'evm'
      ? await verifyEvm(chain, hash, receiver)
      : await verifyTron(chain, hash, receiver)
  } catch (e) {
    console.warn('[paywall] verify error:', e?.message || e)
    return { ok: false, reason: '链上查询失败，请稍后重试' }
  }
  if (!result.ok) return result

  // 金额校验（留 1% 容差，避免精度换算误差卡住正常付款）
  if (minAmount && result.amount < minAmount * 0.99) {
    return {
      ok: false,
      reason: `付款金额不足：需要 ${minAmount} USDT，实际收到 ${result.amount}`
    }
  }

  // 时效校验：避免用很久以前的无关付款来解锁
  const maxAgeDays = Number(process.env.PAYWALL_MAX_AGE_DAYS || 30)
  if (result.timestamp && maxAgeDays > 0) {
    const age = Date.now() - result.timestamp
    if (age > maxAgeDays * 86400000) {
      return { ok: false, reason: `该交易超过 ${maxAgeDays} 天，请使用新的付款` }
    }
  }

  return result
}

/**
 * 付费墙支持的链与 USDT 合约配置
 * 优先级：BSC > ERC20 > TRC20
 *
 * ⚠️ USDT 各链精度不同：BSC 18 位，Ethereum / Tron 均 6 位
 */

export const CHAINS = {
  bsc: {
    id: 'bsc',
    name: 'BSC (BEP20)',
    kind: 'evm',
    // 公共节点，无需 API key；可用 PAYWALL_BSC_RPC 覆盖为付费节点
    rpc: process.env.PAYWALL_BSC_RPC || 'https://bsc-dataseed.binance.org',
    usdt: '0x55d398326f99059ff775485246999027b3197955',
    decimals: 18,
    explorer: 'https://bscscan.com/tx/',
    // BSC 与 Ethereum 同为 EVM，收款地址通用
    addressEnv: 'PAYWALL_EVM_ADDRESS'
  },
  erc20: {
    id: 'erc20',
    name: 'Ethereum (ERC20)',
    kind: 'evm',
    rpc: process.env.PAYWALL_ETH_RPC || 'https://eth.llamarpc.com',
    usdt: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    decimals: 6,
    explorer: 'https://etherscan.io/tx/',
    addressEnv: 'PAYWALL_EVM_ADDRESS'
  },
  trc20: {
    id: 'trc20',
    name: 'Tron (TRC20)',
    kind: 'tron',
    rpc: process.env.PAYWALL_TRON_API || 'https://api.trongrid.io',
    usdt: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
    decimals: 6,
    explorer: 'https://tronscan.org/#/transaction/',
    addressEnv: 'PAYWALL_TRON_ADDRESS'
  }
}

// 按优先级排列，前端 tab 顺序也用这个
export const CHAIN_ORDER = ['bsc', 'erc20', 'trc20']

/** 取某条链的收款地址（服务端用） */
export function getReceiveAddress(chainId) {
  const chain = CHAINS[chainId]
  if (!chain) return ''
  return (process.env[chain.addressEnv] || '').trim()
}

/** 给前端用的公开信息（不含 RPC / 私密配置） */
export function getPublicChainInfo() {
  return CHAIN_ORDER.map(id => {
    const c = CHAINS[id]
    return {
      id: c.id,
      name: c.name,
      address: getReceiveAddress(id),
      explorer: c.explorer
    }
  }).filter(c => c.address) // 没配地址的链不展示
}

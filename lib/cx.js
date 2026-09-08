import { clsx } from 'clsx'

/**
 * cx —— 只做条件类名拼接，不带 tailwind-merge。
 *
 * 为什么单独一个文件、而不是和 cn 放一起：webpack 不会把同一模块里
 * 「没被用到的那个导出所依赖的包」摘掉——只要 card/badge/button 从
 * lib/cn.js 里 import 任何东西，tailwind-merge 就跟着进首屏 chunk。
 * 拆成两个模块，依赖边界才真的分开。
 *
 * 会进首屏的组件（Card / Badge / Button）用这个；
 * 懒加载的（CommandDialog / MobileNavDrawer）才用 lib/cn.js 的 cn。
 *
 * 代价：调用方**不能**靠传 className 覆盖同一属性的基础工具类
 * （比如给 py-[18px] 的组件传 py-1.5），谁赢取决于产物里的先后顺序，不可靠。
 * 需要不同间距时加语义类（可以用两个类名提高优先级），或给组件开一个 variant。
 */
export function cx(...inputs) {
  return clsx(inputs)
}

export default cx

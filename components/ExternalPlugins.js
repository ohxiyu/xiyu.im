import { convertInnerUrl } from '@/lib/db/notion/convertInnerUrl'
import { isBrowser, loadExternalResource } from '@/lib/utils'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { GlobalStyle } from './GlobalStyle'

/**
 * 外部插件挂载点
 *
 * 上游版本在这里接了约 40 个第三方集成（评论 6 家、统计 5 家、广告、
 * AI 摘要、聊天机器人、樱花/烟花/彩带等特效……），每个都由一个配置开关
 * 控制。本站这些开关全部关闭，xiyu 主题也没有任何一处渲染它们，
 * 于是 500 多行代码只为三件真正在执行的事服务：
 *
 *   1. GlobalStyle —— 全局样式
 *   2. 加载 /css/custom.css 与 /js/custom.js
 *   3. convertInnerUrl —— 把 Notion 内链映射成站内路径（缺了它，
 *      正文里指向其它页面的链接会指向 notion.so）
 *
 * 精简后只保留这三件。将来要加回某个集成，从 git 历史里取即可。
 */
const ExternalPlugin = props => {
  const { lang } = useGlobal()
  const router = useRouter()

  // 本地自定义样式与脚本（文件不存在时 loadExternalResource 自行忽略）
  if (isBrowser) {
    loadExternalResource('/css/custom.css', 'css')
    loadExternalResource('/js/custom.js', 'js')
  }

  useEffect(() => {
    // 延迟执行：等 Notion 正文渲染完成后再改写内链
    const timer = setTimeout(() => {
      convertInnerUrl({ allPages: props?.allNavPages, lang })
    }, 500)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, props?.allNavPages, lang])

  return <GlobalStyle />
}

export default ExternalPlugin

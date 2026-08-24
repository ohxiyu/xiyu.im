import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { agenticPages } from './content'

export const getAgenticPageStaticProps = async ({ pageKey, locale }) => {
  const props =
    (await fetchGlobalAllData({ from: `agentic-${pageKey}`, locale })) || {}
  const page = agenticPages[pageKey]

  return {
    props: {
      ...props,
      agenticPageKey: pageKey,
      seo: {
        title: `${page.title} | ${props.siteInfo?.title || 'xiyu.im'}`,
        description: page.description,
        slug: pageKey,
        type: 'website'
      }
    },
    revalidate: process.env.EXPORT
      ? undefined
      : siteConfig(
          'NEXT_REVALIDATE_SECOND',
          BLOG.NEXT_REVALIDATE_SECOND,
          props.NOTION_CONFIG
        )
  }
}

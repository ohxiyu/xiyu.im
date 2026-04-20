import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'

/**
 * 文章列表上方嵌入
 * @param {*} props
 * @returns
 */
export default function BlogPostBar(props) {
  const { tag, category, postCount = 0, tagOptions = [], categoryOptions = [], posts = [] } = props
  const { locale } = useGlobal()

  const latestPublishDate = posts?.[0]?.publishDate
    ? new Date(posts[0].publishDate).toLocaleDateString()
    : null

  if (tag) {
    return (
      <div className='flex items-center text-xl py-2'>
        <i className='mr-2 fas fa-tag' />
        {locale.COMMON.TAGS}: {tag}
      </div>
    )
  } else if (category) {
    return (
      <div className='flex items-center text-xl py-2'>
        <i className='mr-2 fas fa-th' />
        {locale.COMMON.CATEGORY}: {category}
      </div>
    )
  } else {
    return (
      <section className='mb-8 space-y-4'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
          <div className='rounded-lg border border-gray-200 dark:border-gray-800 p-3 bg-gray-50 dark:bg-hexo-black-gray'>
            <div className='text-xs text-gray-500'>{locale.NAV.INDEX}</div>
            <div className='text-xl font-semibold'>{postCount}</div>
          </div>
          <div className='rounded-lg border border-gray-200 dark:border-gray-800 p-3 bg-gray-50 dark:bg-hexo-black-gray'>
            <div className='text-xs text-gray-500'>{locale.COMMON.CATEGORY}</div>
            <div className='text-xl font-semibold'>{categoryOptions?.length || 0}</div>
          </div>
          <div className='rounded-lg border border-gray-200 dark:border-gray-800 p-3 bg-gray-50 dark:bg-hexo-black-gray'>
            <div className='text-xs text-gray-500'>{locale.COMMON.TAGS}</div>
            <div className='text-xl font-semibold'>{tagOptions?.length || 0}</div>
          </div>
          <div className='rounded-lg border border-gray-200 dark:border-gray-800 p-3 bg-gray-50 dark:bg-hexo-black-gray'>
            <div className='text-xs text-gray-500'>{locale.COMMON.LATEST_POSTS}</div>
            <div className='text-sm md:text-base font-semibold'>{latestPublishDate || '-'}</div>
          </div>
        </div>

        <div className='flex flex-wrap items-center gap-2 text-sm'>
          <SmartLink
            href='/archive'
            className='px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors'>
            <i className='fas fa-archive mr-1' />
            {locale.NAV.ARCHIVE}
          </SmartLink>
          <SmartLink
            href='/category'
            className='px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors'>
            <i className='fas fa-folder mr-1' />
            {locale.COMMON.CATEGORY}
          </SmartLink>
          <SmartLink
            href='/tag'
            className='px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors'>
            <i className='fas fa-tag mr-1' />
            {locale.COMMON.TAGS}
          </SmartLink>
        </div>
      </section>
    )
  }
}

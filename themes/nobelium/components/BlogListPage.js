import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import BlogPost from './BlogPost'

/**
 * 将按时间倒序的文章按年份分组
 */
const groupPostsByYear = posts => {
  if (!Array.isArray(posts)) return []
  const groups = []
  let currentYear = null
  let currentGroup = null
  for (const post of posts) {
    const year =
      (post?.publishDay || '').slice(0, 4) ||
      (post?.date?.start_date || '').slice(0, 4) ||
      ''
    if (year !== currentYear) {
      currentYear = year
      currentGroup = { year, posts: [] }
      groups.push(currentGroup)
    }
    currentGroup.posts.push(post)
  }
  return groups
}

export const BlogListPage = props => {
  const { page = 1, posts, postCount } = props
  const { locale } = useGlobal()
  const router = useRouter()
  const { NOTION_CONFIG } = useGlobal()
  const POSTS_PER_PAGE = siteConfig('POSTS_PER_PAGE', null, NOTION_CONFIG)
  const totalPage = Math.ceil(postCount / POSTS_PER_PAGE)
  const currentPage = +page

  const showPrev = currentPage > 1
  const showNext = currentPage < totalPage && posts?.length > 0
  const pagePrefix = router.asPath
    .split('?')[0]
    .replace(/\/page\/[1-9]\d*/, '')
    .replace(/\/$/, '')
    .replace('.html', '')

  const grouped = groupPostsByYear(posts)

  return (
    <div className='w-full md:pr-12 my-6'>
      <div id='posts-wrapper'>
        {grouped.map(group => (
          <section key={group.year || 'no-year'}>
            {group.year && (
              <h3 className='text-xs font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-6 mt-2 flex items-center gap-3'>
                <span>{group.year}</span>
                <span className='flex-1 h-px bg-gray-200 dark:bg-gray-700'></span>
              </h3>
            )}
            {group.posts.map(post => (
              <BlogPost key={post.id} post={post} />
            ))}
          </section>
        ))}
      </div>

      <div className='flex justify-between text-xs'>
        <SmartLink
          href={{
            pathname:
              currentPage - 1 === 1
                ? `${pagePrefix}/`
                : `${pagePrefix}/page/${currentPage - 1}`,
            query: router.query.s ? { s: router.query.s } : {}
          }}
          className={`${showPrev ? '  ' : ' invisible block pointer-events-none '}no-underline py-2 px-3 rounded transition-colors hover:bg-gray-100 dark:hover:bg-gray-800`}>
          <button rel='prev' className='block cursor-pointer'>
            ← {locale.PAGINATION.PREV}
          </button>
        </SmartLink>
        <SmartLink
          href={{
            pathname: `${pagePrefix}/page/${currentPage + 1}`,
            query: router.query.s ? { s: router.query.s } : {}
          }}
          className={`${showNext ? '  ' : 'invisible pointer-events-none '}  no-underline py-2 px-3 rounded transition-colors hover:bg-gray-100 dark:hover:bg-gray-800`}>
          <button rel='next' className='block cursor-pointer'>
            {locale.PAGINATION.NEXT} →
          </button>
        </SmartLink>
      </div>
    </div>
  )
}

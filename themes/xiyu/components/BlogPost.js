import NotionIcon from '@/components/NotionIcon'
import NotionPage from '@/components/NotionPage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'

const BlogPost = ({ post }) => {
  const { NOTION_CONFIG } = useGlobal()
  const showPreview =
    siteConfig('POST_LIST_PREVIEW', false, NOTION_CONFIG) && post?.blockMap

  const tags = Array.isArray(post?.tags) ? post.tags.slice(0, 2) : []

  return (
    <SmartLink href={post?.href}>
      <article key={post.id} className='group mb-8 md:mb-12'>
        <header className='flex flex-col justify-between md:flex-row md:items-baseline'>
          <h2 className='text-lg md:text-xl font-medium mb-2 leading-relaxed cursor-pointer text-black dark:text-white transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400'>
            {siteConfig('POST_TITLE_ICON') && (
              <NotionIcon icon={post.pageIcon} />
            )}
            {post.title}
          </h2>
          <time className='flex-shrink-0 text-gray-600 dark:text-gray-400 text-sm'>
            {post?.publishDay}
          </time>
        </header>

        {/* 元信息：分类 · 标签 */}
        {(post?.category || tags.length > 0) && (
          <div className='flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mb-2'>
            {post?.category && (
              <span className='inline-flex items-center'>
                <i className='far fa-folder mr-1'></i>
                {post.category}
              </span>
            )}
            {post?.category && tags.length > 0 && <span>·</span>}
            {tags.map((tag, idx) => (
              <span key={tag} className='inline-flex items-center'>
                <i className='fas fa-hashtag mr-0.5 text-[10px]'></i>
                {tag}
                {idx < tags.length - 1 && <span className='mx-1'>·</span>}
              </span>
            ))}
          </div>
        )}

        <main>
          {!showPreview && (
            <p className='line-clamp-2 leading-8 text-gray-700 dark:text-gray-300'>
              {post.summary}
            </p>
          )}
          {showPreview && post?.blockMap && (
            <div className='overflow-ellipsis truncate'>
              <NotionPage post={post} />
              <hr className='border-dashed py-4' />
            </div>
          )}
        </main>
      </article>
    </SmartLink>
  )
}

export default BlogPost

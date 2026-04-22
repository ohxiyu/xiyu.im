import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'

const Hero = ({ siteInfo }) => {
  const bio = siteConfig('BIO')
  const description = siteConfig('DESCRIPTION')
  const subtitle = bio || description

  return (
    <section className='mb-10 flex items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-8'>
      {siteInfo?.icon && (
        <LazyImage
          src={siteInfo.icon}
          width={56}
          height={56}
          alt={siteConfig('AUTHOR')}
          className='rounded-full flex-shrink-0'
        />
      )}
      <div className='flex flex-col'>
        <h1 className='text-2xl font-semibold text-black dark:text-white'>
          {siteConfig('AUTHOR') || siteConfig('TITLE')}
        </h1>
        {subtitle && (
          <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
            {subtitle}
          </p>
        )}
      </div>
    </section>
  )
}

export default Hero

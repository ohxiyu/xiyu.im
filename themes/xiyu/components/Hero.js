import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'

const Hero = ({ siteInfo }) => {
  const author = siteConfig('AUTHOR') || siteConfig('TITLE')
  const bio = siteConfig('BIO')
  const description = siteConfig('DESCRIPTION')
  const subtitle = bio || description

  return (
    <section className='hero-fade-in mb-10 flex items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-8'>
      {siteInfo?.icon && (
        <LazyImage
          src={siteInfo.icon}
          width={56}
          height={56}
          alt={author}
          className='rounded-full flex-shrink-0 ring-2 ring-gray-100 dark:ring-gray-800'
        />
      )}
      <div className='flex flex-col'>
        <h1 className='text-2xl font-semibold text-black dark:text-white flex items-center'>
          {author}
          <span className='ml-2 inline-block w-1 h-5 bg-indigo-500 dark:bg-indigo-400 hero-blink'></span>
        </h1>
        {subtitle && (
          <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
            {subtitle}
          </p>
        )}
      </div>
      <style jsx>{`
        .hero-fade-in {
          animation: hero-fade-in 0.6s ease-out both;
        }
        @keyframes hero-fade-in {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .hero-blink {
          animation: hero-blink 1.1s steps(2, start) infinite;
        }
        @keyframes hero-blink {
          to {
            visibility: hidden;
          }
        }
      `}</style>
    </section>
  )
}

export default Hero

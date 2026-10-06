import Head from 'next/head'
import SmartLink from '@/components/SmartLink'

export default function Custom500() {
  return (
    <>
      <Head><title>暂时无法访问 | xiyu.im</title></Head>
      <main className='server-error'>
        <div className='eyebrow'>XIYU.IM / SERVER ERROR</div>
        <strong className='server-error-code'>500</strong>
        <h1>服务器暂时出了点问题。</h1>
        <p>请稍后重试，或先返回首页。</p>
        <SmartLink className='context-link' href='/'>返回首页 ↗</SmartLink>
      </main>
    </>
  )
}

// The error page must render even when the content source is unavailable.
export function getStaticProps() {
  return {
    props: {
      NOTION_CONFIG: {
        AUTHOR: 'xiyu',
        SINCE: 2013,
        BLOG_LOGO: '/images/logo/logo-mark.svg',
        BLOG_LOGO_DARK: '/images/logo/logo-mark-dark.svg',
        LINK: 'https://xiyu.im',
        BIO: '长期主义 · 记录思考'
      }
    }
  }
}

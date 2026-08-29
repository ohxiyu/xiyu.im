import Head from 'next/head'

/**
 * xiyu theme head assets.
 * Keep theme-specific CSS, fonts and brand metadata inside the theme so the
 * rest of the application can stay aligned with upstream NotionNext.
 */
export const CSS = ''

export const Style = () => (
  <Head>
    <meta
      key='xiyu-viewport'
      name='viewport'
      content='width=device-width, initial-scale=1, viewport-fit=cover'
    />
    <link key='xiyu-favicon-svg' rel='icon' type='image/svg+xml' href='/favicon.svg' />
    <link key='xiyu-favicon-32' rel='icon' type='image/png' sizes='32x32' href='/favicon-32.png' />
    <link key='xiyu-favicon-16' rel='icon' type='image/png' sizes='16x16' href='/favicon-16.png' />
    <link key='xiyu-apple-touch-icon' rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
    <link key='xiyu-mask-icon' rel='mask-icon' href='/favicon.svg' color='#557a46' />
    <meta key='xiyu-theme-color' name='theme-color' content='#f7f8f5' />
    <meta key='xiyu-app-title' name='apple-mobile-web-app-title' content='xiyu' />
    <link key='xiyu-manifest' rel='manifest' href='/manifest.json' />
    <link key='xiyu-fonts-preconnect' rel='preconnect' href='https://fonts.googleapis.com' />
    <link key='xiyu-fonts-static-preconnect' rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
    <link
      key='xiyu-fonts'
      rel='stylesheet'
      href='https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@500;600&family=Noto+Sans+SC:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap'
    />
    <link key='xiyu-css' rel='stylesheet' href='/css/xiyu.css' />
  </Head>
)

export default Style

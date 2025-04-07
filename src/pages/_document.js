import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        {/* 网站图标 */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/images/favicon/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/images/favicon/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="apple-touch-icon" href="/images/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/images/favicon/site.webmanifest" />
        <meta name="theme-color" content="#003366" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 
import { ChakraProvider } from '@chakra-ui/react'
import Head from 'next/head'
import theme from '@/lib/theme'
import '@/styles/globals.scss'
import '@/styles/markdown-chat.scss'

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>Tino Tools - 月一科技开发工具集</title>
        <meta name="description" content="月一科技（Mooniq）开发工具集，提供各种实用的开发工具和实用程序" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* 网站图标 */}
        <link rel="icon" type="image/svg+xml" href="/images/favicon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
        <link rel="manifest" href="/images/site.webmanifest" />
        <meta name="theme-color" content="#0020B0" />
      </Head>
      <Component {...pageProps} />
    </ChakraProvider>
  )
} 
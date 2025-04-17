import { ChakraProvider } from '@chakra-ui/react'
import Head from 'next/head'
import theme from '@/lib/theme'
import '@/styles/globals.scss'

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>小匠工具集 (Tino Tools) - 让工作更高效</title>
        <meta name="description" content="小匠工具集 (Tino Tools) 是一个专注于提升工作效率的在线工具平台，提供多种实用工具和功能。" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#003366" />
      </Head>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp 
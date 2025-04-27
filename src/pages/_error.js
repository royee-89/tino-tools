import { Box, Container, Heading, Text, Button } from '@chakra-ui/react'
import Layout from '@/components/Layout'
import Link from 'next/link'

function Error({ statusCode }) {
  return (
    <Layout>
      <Container maxW="container.md" py={20}>
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={4}>
            {statusCode ? `${statusCode} - 服务器错误` : '出错了'}
          </Heading>
          <Text fontSize="xl" mb={8}>
            {statusCode
              ? '抱歉，服务器出现了一些问题'
              : '抱歉，页面加载时出现了一些问题'}
          </Text>
          <Link href="/" passHref>
            <Button colorScheme="blue" size="lg">
              返回首页
            </Button>
          </Link>
        </Box>
      </Container>
    </Layout>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error 
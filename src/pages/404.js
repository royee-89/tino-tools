import { Box, Container, Heading, Text, Button } from '@chakra-ui/react'
import Layout from '@/components/Layout'
import Link from 'next/link'

export default function Custom404() {
  return (
    <Layout>
      <Container maxW="container.md" py={20}>
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={4}>
            404 - 页面不存在
          </Heading>
          <Text fontSize="xl" mb={8}>
            抱歉，您访问的页面不存在或已被移除
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
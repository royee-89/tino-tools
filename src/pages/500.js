import { Box, Container, Heading, Text, Button } from '@chakra-ui/react'
import Layout from '@/components/Layout'
import Link from 'next/link'

export default function Custom500() {
  return (
    <Layout>
      <Container maxW="container.md" py={20}>
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={4}>
            500 - 服务器错误
          </Heading>
          <Text fontSize="xl" mb={8}>
            抱歉，服务器出现了一些问题，请稍后再试
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
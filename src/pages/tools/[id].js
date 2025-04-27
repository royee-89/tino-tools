import { useRouter } from 'next/router'
import { Box, Container, Heading, Text } from '@chakra-ui/react'
import Layout from '@/components/Layout'
import { getToolById } from '@/lib/tools'

export default function ToolPage({ toolId }) {
  const router = useRouter()
  const tool = getToolById(toolId)
  
  // 如果页面正在生成，显示加载状态
  if (router.isFallback) {
    return (
      <Layout>
        <Container maxW="var(--max-width)" py={8}>
          <Text>加载中...</Text>
        </Container>
      </Layout>
    )
  }

  // 如果没有找到工具，显示错误信息
  if (!tool) {
    return (
      <Layout>
        <Container maxW="var(--max-width)" py={8}>
          <Text>未找到该工具</Text>
        </Container>
      </Layout>
    )
  }

  // 渲染工具详情
  return (
    <Layout>
      <Container maxW="var(--max-width)" py={8}>
        <Box bg="white" p={6} borderRadius="16px" boxShadow="sm">
          <Heading as="h1" size="lg" mb={4}>
            {tool.info.icon} {tool.info.name}
          </Heading>
          <Text color="brand.gray.600" mb={6}>
            {tool.info.description}
          </Text>
          
          {/* 渲染工具组件 */}
          {tool.components.detail && <tool.components.detail />}
        </Box>
      </Container>
    </Layout>
  )
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true
  }
}

export async function getStaticProps({ params }) {
  const tool = getToolById(params.id)
  
  if (!tool) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      toolId: params.id
    },
    revalidate: 60 // 每分钟重新生成页面
  }
} 
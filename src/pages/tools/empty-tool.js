import { Box, Container, Text, Button, VStack } from '@chakra-ui/react'
import Layout from '@/components/Layout'

export default function EmptyToolPage() {
  return (
    <Layout>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* 标题区域 */}
          <Box bg="white" p={6} borderRadius="16px" boxShadow="sm">
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              空白工具
            </Text>
            <Text color="gray.500">
              这是一个用于调试的空白工具页面，你可以在这里进行功能测试和开发。
            </Text>
          </Box>

          {/* 功能区域 */}
          <Box bg="white" p={6} borderRadius="16px" boxShadow="sm">
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              功能区域
            </Text>
            <Box
              p={4}
              borderWidth="1px"
              borderStyle="dashed"
              borderColor="gray.200"
              borderRadius="md"
            >
              <Text color="gray.500" textAlign="center">
                这里可以添加任何需要调试的功能组件
              </Text>
            </Box>
          </Box>

          {/* 调试区域 */}
          <Box bg="white" p={6} borderRadius="16px" boxShadow="sm">
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              调试区域
            </Text>
            <VStack spacing={4}>
              <Button size="sm" colorScheme="blue">
                测试按钮
              </Button>
              <Box
                p={4}
                bg="gray.50"
                borderRadius="md"
                width="100%"
                minH="200px"
              >
                <Text color="gray.500" textAlign="center">
                  调试输出区域
                </Text>
              </Box>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Layout>
  )
} 
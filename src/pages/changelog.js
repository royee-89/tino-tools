import { Box, Container, VStack, Text, Divider } from '@chakra-ui/react'
import Layout from '@/components/Layout'

const ChangelogPage = () => {
  const updates = [
    {
      version: 'v1.0.1',
      date: '2024-03-21',
      changes: [
        {
          type: '✨ 新功能',
          items: [
            '添加工具搜索功能，支持模糊匹配',
            '新增空白调试工具页面'
          ]
        },
        {
          type: '🎨 界面优化',
          items: [
            '优化聊天气泡样式，更贴近微信界面',
            '工具卡片使用不同配色，提升视觉区分度'
          ]
        },
        {
          type: '🐛 问题修复',
          items: [
            '修复移动端布局显示问题'
          ]
        }
      ]
    },
    {
      version: 'v1.0.0',
      date: '2024-03-20',
      changes: [
        {
          type: '🎉 首次发布',
          items: [
            '支持 Markdown 转微信聊天气泡功能',
            '响应式设计，支持移动端访问',
            '工具分类展示'
          ]
        }
      ]
    }
  ]

  return (
    <Layout>
      <Container maxW="var(--max-width)" py={8}>
        <Box bg="white" p={6} borderRadius="16px" boxShadow="sm">
          <Text fontSize="2xl" fontWeight="bold" mb={6}>
            更新日志
          </Text>
          
          <VStack spacing={8} align="stretch">
            {updates.map((update, index) => (
              <Box key={update.version}>
                <Box mb={4}>
                  <Text fontSize="xl" fontWeight="bold" color="brand.primary">
                    {update.version}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {update.date}
                  </Text>
                </Box>

                <VStack spacing={4} align="stretch">
                  {update.changes.map((change, changeIndex) => (
                    <Box key={changeIndex}>
                      <Text fontSize="md" fontWeight="medium" mb={2}>
                        {change.type}
                      </Text>
                      <VStack spacing={1} align="stretch" pl={4}>
                        {change.items.map((item, itemIndex) => (
                          <Text key={itemIndex} color="gray.600">
                            • {item}
                          </Text>
                        ))}
                      </VStack>
                    </Box>
                  ))}
                </VStack>

                {index < updates.length - 1 && (
                  <Divider my={6} borderColor="gray.200" />
                )}
              </Box>
            ))}
          </VStack>
        </Box>
      </Container>
    </Layout>
  )
}

export default ChangelogPage 
import MarkdownChat from './components/MarkdownChat'
import { Box, Text } from '@chakra-ui/react'

// 预览组件
const Preview = () => (
  <Box p={4} bg="white" borderRadius="md">
    <Text>将 Markdown 文本转换为微信风格的聊天气泡</Text>
  </Box>
)

// 图标组件
const Icon = () => <Text fontSize="2xl">💬</Text>

export const config = {
  info: {
    id: 'markdown-chat',
    name: 'Markdown 转聊天',
    description: '将 Markdown 文本转换为微信风格的聊天气泡',
    icon: '💬',
    category: 'productivity',
  },
  
  routes: {
    index: '/tools/markdown-chat',
  },
  
  components: {
    icon: Icon,
    preview: Preview,
    detail: MarkdownChat,
  }
} 
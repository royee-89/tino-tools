import MarkdownChat from './components/MarkdownChat'

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
    detail: MarkdownChat,
  }
} 
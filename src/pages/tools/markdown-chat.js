import { Box, Container } from '@chakra-ui/react'
import Layout from '@/components/Layout'
import { marked } from 'marked'
import { useState } from 'react'
import '@/styles/markdown-chat.scss'

export default function MarkdownChatPage() {
  const [markdown, setMarkdown] = useState('')
  const [html, setHtml] = useState('')

  const handleConvert = () => {
    const messages = markdown.split('\n\n').map(msg => {
      return marked.parse(msg)
    })

    const chatHtml = messages.map((msg, index) => {
      const isReceived = index % 2 === 0
      const timestamp = new Date().toLocaleTimeString('zh-CN', { 
        hour: 'numeric',
        minute: 'numeric',
        hour12: true 
      })

      return `
        <div class="message ${isReceived ? 'received' : 'sent'}">
          <div class="timestamp">${timestamp}</div>
          <div class="bubble">${msg}</div>
        </div>
      `
    }).join('')

    setHtml(chatHtml)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(html)
  }

  return (
    <Layout>
      <Container maxW="container.xl" py={8}>
        <Box mb={8}>
          <h2>输入格式说明</h2>
          <pre>
            每段 Markdown 文本之间用空行分隔
            支持的 Markdown 语法:
            # 标题
            **粗体** *斜体*
            {'>'}引用
            - 列表项
            [链接](url)
            ![图片](url)
            `代码`
            ```
            代码块
            ```
          </pre>
        </Box>

        <Box mb={8}>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="在此输入 Markdown 文本..."
            style={{ width: '100%', height: '200px' }}
          />
        </Box>

        <Box mb={8}>
          <button onClick={handleConvert}>转换</button>
          <button onClick={handleCopy} ml={4}>复制 HTML</button>
        </Box>

        <Box className="chat-container" dangerouslySetInnerHTML={{ __html: html }} />
      </Container>
    </Layout>
  )
} 
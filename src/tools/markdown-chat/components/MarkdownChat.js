import { useState } from 'react'
import {
  Box,
  VStack,
  Textarea,
  Button,
  Text,
  useToast,
  HStack,
  IconButton,
} from '@chakra-ui/react'
import { marked } from 'marked'
import analytics from '@/lib/analytics'

const MarkdownChat = () => {
  const [markdown, setMarkdown] = useState('')
  const [preview, setPreview] = useState([])
  const toast = useToast()

  // 处理 Markdown 转换
  const handleConvert = () => {
    analytics.event('markdown', 'convert', 'Markdown 转换')
    if (window.MtaH5) {
      window.MtaH5.clickStat('convert_markdown');
    }
    if (!markdown.trim()) {
      toast({
        title: '请输入 Markdown 文本',
        status: 'warning',
        duration: 2000,
      })
      return
    }

    // 将 Markdown 文本按行分割
    const lines = markdown.split('\n')
    const messages = []
    let currentMessage = ''

    lines.forEach((line) => {
      if (line.trim() === '') {
        if (currentMessage) {
          messages.push(currentMessage)
          currentMessage = ''
        }
      } else {
        currentMessage += line + '\n'
      }
    })

    if (currentMessage) {
      messages.push(currentMessage)
    }

    // 转换为聊天消息
    const chatMessages = messages.map((msg, index) => ({
      id: index,
      content: marked(msg),
      type: index % 2 === 0 ? 'sent' : 'received',
      timestamp: new Date().toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }))

    setPreview(chatMessages)
  }

  // 复制 HTML
  const handleCopy = () => {
    analytics.event('markdown', 'copy', 'HTML 复制')
    if (window.MtaH5) {
      window.MtaH5.clickStat('copy_html');
    }
    const chatHtml = preview
      .map(
        (msg) => `
        <div class="chat-message ${msg.type}">
          <div class="chat-bubble">
            ${msg.content}
          </div>
          <div class="chat-time">${msg.timestamp}</div>
        </div>
      `
      )
      .join('')

    const fullHtml = `
      <style>
        .chat-container {
          max-width: 100%;
          margin: 0 auto;
          padding: 20px;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .chat-message {
          margin: 16px 0;
          display: flex;
          flex-direction: column;
        }
        .chat-message.sent {
          align-items: flex-end;
        }
        .chat-message.received {
          align-items: flex-start;
        }
        .chat-bubble {
          max-width: 70%;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 15px;
          line-height: 1.5;
        }
        .chat-message.sent .chat-bubble {
          background-color: #95B79D;
          color: #fff;
        }
        .chat-message.received .chat-bubble {
          background-color: #fff;
          border: 1px solid #E5E7EB;
        }
        .chat-time {
          font-size: 12px;
          color: #9CA3AF;
          margin-top: 4px;
        }
      </style>
      <div class="chat-container">
        ${chatHtml}
      </div>
    `

    navigator.clipboard.writeText(fullHtml).then(() => {
      toast({
        title: '已复制到剪贴板',
        status: 'success',
        duration: 2000,
      })
    })
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* 输入区域 */}
      <Box>
        <Text mb={2} fontSize="sm" color="gray.600">
          在下方输入 Markdown 文本，空行将自动分割为不同的消息
        </Text>
        <Textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          placeholder="输入 Markdown 文本..."
          minH="200px"
          bg="white"
        />
      </Box>

      {/* 操作按钮 */}
      <HStack>
        <Button colorScheme="blue" onClick={handleConvert}>
          转换
        </Button>
        {preview.length > 0 && (
          <Button variant="outline" onClick={handleCopy}>
            复制 HTML
          </Button>
        )}
      </HStack>

      {/* 预览区域 */}
      {preview.length > 0 && (
        <Box
          bg="gray.50"
          p={4}
          borderRadius="md"
          maxW="500px"
          mx="auto"
          w="100%"
        >
          {preview.map((msg) => (
            <Box
              key={msg.id}
              mb={4}
              display="flex"
              flexDir="column"
              alignItems={msg.type === 'sent' ? 'flex-end' : 'flex-start'}
            >
              <Box
                maxW="70%"
                bg={msg.type === 'sent' ? '#95B79D' : 'white'}
                color={msg.type === 'sent' ? 'white' : 'inherit'}
                p={3}
                borderRadius="lg"
                border={msg.type === 'received' ? '1px solid' : 'none'}
                borderColor="gray.200"
                dangerouslySetInnerHTML={{ __html: msg.content }}
              />
              <Text fontSize="xs" color="gray.500" mt={1}>
                {msg.timestamp}
              </Text>
            </Box>
          ))}
        </Box>
      )}
    </VStack>
  )
}

export default MarkdownChat 
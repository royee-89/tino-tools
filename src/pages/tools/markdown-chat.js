import { Box, Container, Text, Button, Textarea, VStack, HStack, useToast, Code } from '@chakra-ui/react'
import Layout from '@/components/Layout'
import { marked } from 'marked'
import { useState } from 'react'

// 对话模板示例
const dialogTemplate = {
  title: '对话模板',
  description: '点击复制模板内容到剪贴板',
  content: `问：请问如何使用这个工具？

答：很简单，按照这个格式写对话就可以了：
1. 每个问答之间空一行
2. "问："和"答："后面紧跟内容
3. 支持Markdown语法，可以用**加粗**、*斜体*等

问：支持哪些Markdown语法？

答：支持以下常用语法：
- **加粗文本**
- *斜体文本*
- [超链接](链接地址)
- \`代码\`
- > 引用文本
- 1. 有序列表
- - 无序列表`
}

// 生成随机时间间隔（1-3分钟）
const getRandomInterval = () => {
  return Math.floor(Math.random() * 2 * 60 + 60) * 1000 // 60-180秒
}

// 格式化时间
const formatTime = (date) => {
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

export default function MarkdownChatPage() {
  const [markdown, setMarkdown] = useState('')
  const [html, setHtml] = useState('')
  const toast = useToast()

  const handleConvert = () => {
    if (!markdown.trim()) {
      toast({
        title: '请输入对话内容',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      })
      return
    }

    // 将文本按空行分割成段落
    const paragraphs = markdown.split(/\n\s*\n/)
    
    // 生成基准时间（当前时间往前推一些，以防显示超过当前时间）
    let currentTime = new Date()
    currentTime.setHours(currentTime.getHours() - 1)
    
    // 处理每个段落
    const chatHtml = paragraphs.map(para => {
      const trimmedPara = para.trim()
      const isQuestion = trimmedPara.startsWith('问：')
      const isAnswer = trimmedPara.startsWith('答：')
      
      // 如果不是问题或答案，跳过
      if (!isQuestion && !isAnswer) return ''
      
      // 移除"问："或"答："前缀
      const content = trimmedPara.substring(2).trim()
      
      // 转换Markdown为HTML
      const parsedContent = marked.parse(content)
      
      // 生成时间并递增
      const messageTime = formatTime(currentTime)
      currentTime = new Date(currentTime.getTime() + getRandomInterval())
      
      return `
        <div class="message ${isQuestion ? 'received' : 'sent'}">
          <div class="timestamp">${messageTime}</div>
          <div class="bubble">${parsedContent}</div>
        </div>
      `
    }).filter(html => html).join('\n')

    setHtml(chatHtml)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(html)
    toast({
      title: 'HTML 已复制到剪贴板',
      status: 'success',
      duration: 2000,
      isClosable: true,
    })
  }

  const handleTemplateClick = () => {
    navigator.clipboard.writeText(dialogTemplate.content).then(() => {
      toast({
        title: '模板已复制到剪贴板',
        description: '现在可以直接粘贴使用了',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
    })
  }

  return (
    <Layout>
      <Container maxW="container.xl" py={8}>
        {/* 模板区域 */}
        <Box mb={8}>
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            使用模板
          </Text>
          <Box
            p={4}
            bg="white"
            borderWidth="1px"
            borderStyle="dashed"
            borderColor="gray.200"
            borderRadius="12px"
            cursor="pointer"
            _hover={{ transform: 'translateY(-2px)', transition: 'all 0.2s' }}
            onClick={handleTemplateClick}
          >
            <Text fontWeight="medium" mb={2}>{dialogTemplate.title}</Text>
            <Text fontSize="sm" color="gray.500" mb={4}>
              {dialogTemplate.description}
            </Text>
            <Code
              display="block"
              whiteSpace="pre-wrap"
              p={4}
              borderRadius="md"
              fontSize="sm"
              bg="gray.50"
            >
              {dialogTemplate.content}
            </Code>
          </Box>
        </Box>

        {/* 编辑区域 */}
        <Box mb={8}>
          <HStack justify="space-between" mb={4}>
            <Text fontSize="xl" fontWeight="bold">
              编辑区
            </Text>
            <HStack spacing={2}>
              <Button size="sm" onClick={() => setMarkdown('')}>清空</Button>
              <Button size="sm" onClick={handleConvert}>转换</Button>
              <Button size="sm" onClick={handleCopy}>复制 HTML</Button>
            </HStack>
          </HStack>
          <Textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="在此输入对话内容，问答之间请空一行..."
            minH="280px"
            p={4}
            borderWidth="1px"
            borderStyle="dashed"
            borderRadius="12px"
            _focus={{
              borderColor: 'brand.primary',
              boxShadow: 'none'
            }}
          />
        </Box>

        {/* 对话区域 */}
        <Box>
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            对话区
          </Text>
          <Box
            p={4}
            bg="white"
            borderWidth="1px"
            borderStyle="dashed"
            borderRadius="12px"
            minH="370px"
          >
            <Box className="chat-container" dangerouslySetInnerHTML={{ __html: html }} />
          </Box>
        </Box>
      </Container>
    </Layout>
  )
} 
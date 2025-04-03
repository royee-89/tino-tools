import { useState, useCallback } from 'react'
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Text,
  VStack,
  HStack,
  Image,
  Button,
  useBreakpointValue,
  Link as ChakraLink,
} from '@chakra-ui/react'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { tools } from '@/lib/tools'
import { debounce } from 'lodash'

// 工具分类
const categories = [
  { id: 'code', name: '代码编辑', icon: '💻' },
  { id: 'design', name: '设计工具', icon: '🎨' },
  { id: 'productivity', name: '效率工具', icon: '⚡' },
  { id: 'ai', name: 'AI 工具', icon: '🤖' },
]

// 工具卡片颜色方案
const cardColors = [
  {
    bg: 'rgba(0, 32, 176, 0.05)',
    border: 'rgba(0, 32, 176, 0.1)',
    hover: 'rgba(0, 32, 176, 0.08)'
  },
  {
    bg: 'rgba(255, 183, 0, 0.05)',
    border: 'rgba(255, 183, 0, 0.1)',
    hover: 'rgba(255, 183, 0, 0.08)'
  },
  {
    bg: 'rgba(46, 204, 113, 0.05)',
    border: 'rgba(46, 204, 113, 0.1)',
    hover: 'rgba(46, 204, 113, 0.08)'
  },
  {
    bg: 'rgba(155, 89, 182, 0.05)',
    border: 'rgba(155, 89, 182, 0.1)',
    hover: 'rgba(155, 89, 182, 0.08)'
  }
]

// 获取工具卡片颜色
const getCardColor = (index) => cardColors[index % cardColors.length]

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const isMobile = useBreakpointValue({ base: true, md: false })

  // 搜索工具函数
  const searchTools = (query) => {
    if (!query.trim()) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    const normalizedQuery = query.toLowerCase()
    
    const results = tools.filter(tool => {
      const name = tool.info.name.toLowerCase()
      const description = tool.info.description.toLowerCase()
      const tags = tool.info.tags?.map(tag => tag.toLowerCase()) || []
      
      return name.includes(normalizedQuery) || 
             description.includes(normalizedQuery) ||
             tags.some(tag => tag.includes(normalizedQuery))
    })

    setSearchResults(results)
  }

  // 防抖处理
  const debouncedSearch = useCallback(
    debounce((query) => searchTools(query), 300),
    []
  )

  // 处理搜索输入
  const handleSearchInput = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    debouncedSearch(query)
  }

  return (
    <Layout>
      <VStack spacing={8} align="stretch">
        {/* 搜索框 */}
        <Box bg="white" p={6} borderRadius="16px" boxShadow="sm">
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            快速寻找工具
          </Text>
          <InputGroup>
            <InputLeftElement pointerEvents="none" children="🔍" />
            <Input
              placeholder="输入关键词搜索工具"
              value={searchQuery}
              onChange={handleSearchInput}
              bg="brand.bg"
              border="2px dashed"
              borderColor="brand.primary"
              _placeholder={{ color: 'brand.gray.400' }}
            />
          </InputGroup>

          {/* 搜索结果 */}
          {isSearching && (
            <Box mt={4}>
              {searchResults.length > 0 ? (
                <VStack spacing={3} align="stretch">
                  {searchResults.map((tool) => (
                    <Link key={tool.info.id} href={tool.routes.index} passHref>
                      <ChakraLink
                        display="block"
                        _hover={{ textDecoration: 'none' }}
                      >
                        <Box
                          p={4}
                          borderRadius="12px"
                          border="1px dashed"
                          borderColor={tool.info.category === 'ai' ? 'rgba(0, 32, 176, 0.1)' : 'rgba(255, 183, 0, 0.1)'}
                          bg={tool.info.category === 'ai' ? 'rgba(0, 32, 176, 0.05)' : 'rgba(255, 183, 0, 0.05)'}
                          _hover={{ transform: 'translateY(-2px)', transition: 'all 0.2s' }}
                        >
                          <HStack spacing={4}>
                            <Text fontSize="2xl">{tool.info.icon}</Text>
                            <Box>
                              <Text fontWeight="medium">{tool.info.name}</Text>
                              <Text fontSize="sm" color="brand.gray.500">
                                {tool.info.description}
                              </Text>
                            </Box>
                          </HStack>
                        </Box>
                      </ChakraLink>
                    </Link>
                  ))}
                </VStack>
              ) : searchQuery.trim() ? (
                <Box p={4} textAlign="center" color="gray.500">
                  <Text>未找到相关工具</Text>
                  <Text fontSize="sm" mt={2}>
                    试试其他关键词，或者
                    <Button
                      variant="link"
                      color="brand.primary"
                      ml={1}
                      onClick={() => {
                        setSearchQuery('')
                        setSearchResults([])
                        setIsSearching(false)
                      }}
                    >
                      清空搜索
                    </Button>
                  </Text>
                </Box>
              ) : null}
            </Box>
          )}

          <Box mt={4} p={4} bg="rgba(0, 32, 176, 0.05)" borderRadius="12px" border="1px dashed" borderColor="rgba(0, 32, 176, 0.1)">
            <Text fontSize="md" fontWeight="medium" textAlign="center" mb={2}>
              没找到需要的工具？
            </Text>
            <Text fontSize="sm" color="brand.gray.500" textAlign="center" mb={4}>
              告诉我们你的需求，我们会及时收集相关工具
            </Text>
            <Button size="md" mx="auto" display="block">
              提交需求
            </Button>
          </Box>
        </Box>

        {/* 工具分类 */}
        {!isSearching && (
          <>
            <SimpleGrid columns={4} spacing={4}>
              {categories.map((category) => (
                <VStack
                  key={category.id}
                  p={4}
                  bg="white"
                  borderRadius="12px"
                  cursor="pointer"
                  _hover={{ transform: 'translateY(-2px)', transition: 'all 0.2s' }}
                >
                  <Text fontSize="2xl">{category.icon}</Text>
                  <Text fontSize="sm" color="brand.gray.700">
                    {category.name}
                  </Text>
                </VStack>
              ))}
            </SimpleGrid>

            {/* 热门工具 */}
            <Box bg="white" p={6} borderRadius="16px" boxShadow="sm">
              <Text fontSize="xl" fontWeight="bold" mb={4}>
                热门工具
              </Text>
              <SimpleGrid columns={isMobile ? 1 : 2} spacing={4}>
                {tools.map((tool, index) => {
                  const cardColor = getCardColor(index)
                  return (
                    <Link key={tool.info.id} href={tool.routes.index} passHref legacyBehavior>
                      <ChakraLink _hover={{ textDecoration: 'none' }}>
                        <Box
                          p={4}
                          borderRadius="16px"
                          border="1px dashed"
                          borderColor={cardColor.border}
                          bg={cardColor.bg}
                          _hover={{ 
                            transform: 'translateY(-2px)', 
                            transition: 'all 0.2s',
                            bg: cardColor.hover
                          }}
                        >
                          <HStack spacing={4}>
                            <Text fontSize="2xl">{tool.info.icon}</Text>
                            <Box>
                              <Text fontWeight="medium">{tool.info.name}</Text>
                              <Text fontSize="sm" color="brand.gray.500">
                                {tool.info.description}
                              </Text>
                            </Box>
                          </HStack>
                        </Box>
                      </ChakraLink>
                    </Link>
                  )
                })}
              </SimpleGrid>
            </Box>

            {/* 最新工具 */}
            <Box bg="white" p={6} borderRadius="16px" boxShadow="sm">
              <HStack spacing={2} mb={4}>
                <Text fontSize="xl" fontWeight="bold">
                  最新工具
                </Text>
                <Text fontSize="xl">⏰</Text>
              </HStack>
              <VStack spacing={4} align="stretch">
                {tools.map((tool) => (
                  <HStack
                    key={tool.info.id}
                    justify="space-between"
                    p={4}
                    bg="white"
                    borderRadius="8px"
                    boxShadow="sm"
                  >
                    <HStack spacing={4}>
                      <Text fontSize="2xl">{tool.info.icon}</Text>
                      <Box>
                        <Text fontWeight="medium">{tool.info.name}</Text>
                        <Text fontSize="sm" color="brand.gray.500">
                          {tool.info.description}
                        </Text>
                      </Box>
                    </HStack>
                    <Link href={tool.routes.index} passHref legacyBehavior>
                      <Button as={ChakraLink} size="sm">立即体验</Button>
                    </Link>
                  </HStack>
                ))}
              </VStack>
            </Box>
          </>
        )}
      </VStack>
    </Layout>
  )
} 
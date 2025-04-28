import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Text,
  VStack,
  HStack,
  Button,
  useBreakpointValue,
  Link as ChakraLink,
} from '@chakra-ui/react'
import Link from 'next/link'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import Layout from '@/components/Layout'
import { tools } from '@/lib/tools'
import { debounce } from 'lodash'
import { SearchIcon } from '@chakra-ui/icons'

// 工具分类
const categories = [
  { id: 'code', name: '代码编辑', icon: '💻' },
  { id: 'design', name: '设计工具', icon: '🎨' },
  { id: 'efficiency', name: '效率工具', icon: '⚡' },
  { id: 'ai', name: 'AI 工具', icon: '🤖' }
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
  const { t } = useTranslation('common')
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const isMobile = useBreakpointValue({ base: true, md: false })

  // 搜索工具函数
  const searchTools = debounce((term) => {
    if (!term.trim()) {
      setSearchResults([])
      setIsSearching(false)
      return
    }
    setIsSearching(true)
    const results = tools.filter(tool =>
      tool.info.name.toLowerCase().includes(term.toLowerCase()) ||
      tool.info.description.toLowerCase().includes(term.toLowerCase())
    )
    setSearchResults(results)
    setIsSearching(false)
  }, 300)

  useEffect(() => {
    searchTools(searchTerm)
  }, [searchTerm])

  return (
    <Layout>
      <VStack spacing={8} align="stretch">
        {/* 搜索框 */}
        <Box bg="white" p={6} borderRadius="16px" boxShadow="sm">
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            {t('tools.search.title')}
          </Text>
          <InputGroup>
            <InputLeftElement 
              pointerEvents="none" 
              children={<SearchIcon color="gray.400" />}
              height="100%"
              paddingTop="3"
            />
            <Input
              placeholder={t('tools.search.placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              bg="brand.bg"
              border="2px dashed"
              borderColor="brand.primary"
              _placeholder={{ color: 'brand.gray.400' }}
              height="48px"
              fontSize="md"
            />
          </InputGroup>

          {/* 搜索结果 */}
          {(searchTerm.trim() !== '' || isSearching) && (
            <Box mt={4}>
              {searchResults.length > 0 ? (
                <VStack spacing={3} align="stretch">
                  {searchResults.map((tool) => (
                    <Link key={tool.info.id} href={tool.routes.index} passHref legacyBehavior>
                      <ChakraLink _hover={{ textDecoration: 'none' }}>
                        <Box
                          p={4}
                          borderRadius="12px"
                          border="1px dashed"
                          borderColor="rgba(0, 32, 176, 0.1)"
                          bg="rgba(0, 32, 176, 0.05)"
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
              ) : searchTerm.trim() ? (
                <Box textAlign="center" p={6} bg="gray.50" borderRadius="12px">
                  <Text fontSize="xl" mb={2}>{t('tools.search.empty')}</Text>
                  <Text color="gray.600" mb={4}>
                    {t('tools.search.emptyDesc')}
                  </Text>
                  <Button colorScheme="blue">{t('tools.search.button')}</Button>
                </Box>
              ) : null}
            </Box>
          )}
        </Box>

        {/* 工具分类 */}
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
            {tools.slice(0, 4).map((tool, index) => (
              <Link key={tool.info.id} href={tool.routes.index} passHref legacyBehavior>
                <ChakraLink _hover={{ textDecoration: 'none' }}>
                  <Box
                    p={4}
                    borderRadius="12px"
                    border="1px dashed"
                    borderColor={getCardColor(index).border}
                    bg={getCardColor(index).bg}
                    _hover={{ transform: 'translateY(-2px)', transition: 'all 0.2s', bg: getCardColor(index).hover }}
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
            {tools.slice(0, 2).map((tool) => (
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
                  <Button as={ChakraLink} size="sm">立即使用</Button>
                </Link>
              </HStack>
            ))}
          </VStack>
        </Box>
      </VStack>
    </Layout>
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  }
} 
import { useState } from 'react'
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

// 工具分类
const categories = [
  { id: 'code', name: '代码编辑', icon: '💻' },
  { id: 'design', name: '设计工具', icon: '🎨' },
  { id: 'productivity', name: '效率工具', icon: '⚡' },
  { id: 'ai', name: 'AI 工具', icon: '🤖' },
]

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const isMobile = useBreakpointValue({ base: true, md: false })

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
              onChange={(e) => setSearchQuery(e.target.value)}
              bg="brand.bg"
              border="2px dashed"
              borderColor="brand.primary"
              _placeholder={{ color: 'brand.gray.400' }}
            />
          </InputGroup>
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
            {tools.map((tool) => (
              <Link key={tool.info.id} href={tool.routes.index} passHref>
                <ChakraLink _hover={{ textDecoration: 'none' }}>
                  <Box
                    p={4}
                    borderRadius="16px"
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
                <Link href={tool.routes.index} passHref>
                  <Button as="a" size="sm">立即体验</Button>
                </Link>
              </HStack>
            ))}
          </VStack>
        </Box>
      </VStack>
    </Layout>
  )
} 
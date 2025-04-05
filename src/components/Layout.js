import { Box, Container, Flex, Text, IconButton, useBreakpointValue, VStack, HStack, Link as ChakraLink, Tooltip } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Link from 'next/link'

const Layout = ({ children }) => {
  const router = useRouter()
  const isMobile = useBreakpointValue({ base: true, md: false })

  const navItems = [
    { label: '首页', href: '/', icon: '🏠' },
    { label: '发现', href: '/discover', icon: '🔍' },
    { label: '更新', href: '/changelog', icon: '📋' },
    { label: '收藏', href: '/favorites', icon: '⭐' },
    { label: '我的', href: '/profile', icon: '👤' },
  ]

  return (
    <Box minH="100vh" position="relative" pb={isMobile ? '120px' : '80px'}>
      {/* 顶部导航 */}
      <Box bg="white" borderBottom="1px solid" borderColor="brand.gray.200" position="sticky" top={0} zIndex={1000}>
        <Container maxW="var(--max-width)" py={3}>
          <Flex justify="space-between" align="center">
            <Link href="/" passHref>
              <Text fontSize="xl" fontWeight="bold" color="brand.primary">
                Tino Tools
              </Text>
            </Link>
            <Flex gap={6} className="desktop-only">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} passHref>
                  <Tooltip label={item.label} placement="bottom" hasArrow>
                    <Text
                      cursor="pointer"
                      fontSize="xl"
                      color={router.pathname === item.href ? 'brand.primary' : 'brand.gray.600'}
                      _hover={{ color: 'brand.primary', transform: 'scale(1.1)' }}
                      transition="all 0.2s"
                    >
                      {item.icon}
                    </Text>
                  </Tooltip>
                </Link>
              ))}
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* 主要内容 */}
      <Container maxW="var(--max-width)" py={4}>
        {children}
      </Container>

      {/* 页脚 */}
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        bg="white"
        borderTop="1px solid"
        borderColor="brand.gray.200"
        py={4}
      >
        <Container maxW="var(--max-width)">
          <VStack spacing={2} align="center">
            <HStack spacing={2} fontSize="sm" color="brand.gray.500">
              <Text>© 2024</Text>
              <Text>
                月一科技 Mooniq
              </Text>
            </HStack>
            <HStack spacing={2} fontSize="sm" color="brand.gray.500">
              <ChakraLink href="https://beian.miit.gov.cn" isExternal>
                京ICP备2025114896号-1
              </ChakraLink>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* 移动端底部导航 */}
      {isMobile && (
        <Box
          position="fixed"
          bottom={0}
          left={0}
          right={0}
          bg="white"
          borderTop="1px solid"
          borderColor="brand.gray.200"
          py={2}
          zIndex={1000}
        >
          <Flex justify="space-around" align="center">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} passHref>
                <Flex
                  direction="column"
                  align="center"
                  color={router.pathname === item.href ? 'brand.primary' : 'brand.gray.600'}
                >
                  <Text fontSize="xl">{item.icon}</Text>
                  <Text fontSize="xs">{item.label}</Text>
                </Flex>
              </Link>
            ))}
          </Flex>
        </Box>
      )}
    </Box>
  )
}

export default Layout 
import { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Box,
  Text,
  Collapse,
  VStack,
  HStack,
  Badge,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react'
import { InfoIcon, CloseIcon } from '@chakra-ui/icons'
import { listenForUpdates, getCacheStats } from '@/utils/version'

export default function UpdatePrompt() {
  const { t } = useTranslation('common')
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false)
  const [cacheStats, setCacheStats] = useState(null)
  const { isOpen, onToggle } = useDisclosure()

  useEffect(() => {
    // 监听更新
    listenForUpdates(() => {
      setShowUpdatePrompt(true)
    })

    // 获取缓存统计信息
    const updateStats = async () => {
      const stats = await getCacheStats()
      setCacheStats(stats)
    }
    updateStats()

    // 每分钟更新一次统计信息
    const interval = setInterval(updateStats, 60000)
    return () => clearInterval(interval)
  }, [])

  const handleUpdate = () => {
    // 刷新页面以应用更新
    window.location.reload()
  }

  const handleClose = () => {
    setShowUpdatePrompt(false)
  }

  if (!showUpdatePrompt && !cacheStats) return null

  return (
    <Box
      position="fixed"
      bottom="4"
      right="4"
      zIndex="toast"
    >
      <VStack spacing={4} align="stretch">
        {/* 更新提示 */}
        <Collapse in={showUpdatePrompt}>
          <Alert
            status="info"
            variant="solid"
            borderRadius="md"
            pr="8"
          >
            <AlertIcon />
            <Box flex="1">
              <AlertTitle>发现新版本</AlertTitle>
              <AlertDescription display="block">
                网站有新的更新可用，请刷新页面以获取最新内容。
              </AlertDescription>
              <Button
                mt="3"
                size="sm"
                colorScheme="blue"
                onClick={handleUpdate}
              >
                立即更新
              </Button>
            </Box>
            <IconButton
              position="absolute"
              right="1"
              top="1"
              size="sm"
              icon={<CloseIcon />}
              onClick={handleClose}
              variant="ghost"
              color="white"
              _hover={{ bg: 'whiteAlpha.200' }}
            />
          </Alert>
        </Collapse>

        {/* 缓存统计 */}
        {cacheStats && (
          <Alert
            status="info"
            variant="subtle"
            borderRadius="md"
            opacity={isOpen ? 1 : 0.7}
            _hover={{ opacity: 1 }}
          >
            <AlertIcon />
            <Box flex="1">
              <HStack justify="space-between" align="center">
                <AlertTitle>缓存状态</AlertTitle>
                <IconButton
                  size="sm"
                  icon={<InfoIcon />}
                  onClick={onToggle}
                  variant="ghost"
                />
              </HStack>
              <Collapse in={isOpen}>
                <VStack align="stretch" mt="2" spacing="1">
                  <Text fontSize="sm">
                    总缓存项: {cacheStats.totalItems}
                  </Text>
                  <HStack spacing="2" wrap="wrap">
                    <Badge colorScheme="blue">HTML: {cacheStats.types.html}</Badge>
                    <Badge colorScheme="green">CSS: {cacheStats.types.css}</Badge>
                    <Badge colorScheme="yellow">JS: {cacheStats.types.js}</Badge>
                    <Badge colorScheme="purple">图片: {cacheStats.types.images}</Badge>
                    <Badge colorScheme="gray">其他: {cacheStats.types.other}</Badge>
                  </HStack>
                </VStack>
              </Collapse>
            </Box>
          </Alert>
        )}
      </VStack>
    </Box>
  )
} 
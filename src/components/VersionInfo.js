import { Box, Text, Tooltip, Flex, Badge } from '@chakra-ui/react'
import { useState, useEffect } from 'react'

let buildInfo = {
  version: '开发版本',
  date: new Date().toISOString(),
  commitMsg: '本地开发',
  commitAuthor: '开发人员'
}

// 动态导入版本信息
const getVersionInfo = async () => {
  try {
    // 仅在生产环境导入版本信息
    if (process.env.NODE_ENV === 'production') {
      const versionModule = await import('../lib/version')
      if (versionModule) {
        buildInfo = {
          version: versionModule.BUILD_VERSION || '未知版本',
          date: versionModule.BUILD_DATE || new Date().toISOString(),
          commitMsg: versionModule.COMMIT_MSG || '未知提交',
          commitAuthor: versionModule.COMMIT_AUTHOR || '未知作者'
        }
      }
    }
    return buildInfo
  } catch (error) {
    console.log('获取版本信息失败', error)
    return buildInfo
  }
}

// 版本信息组件
export default function VersionInfo({ showDetails = false }) {
  const [versionData, setVersionData] = useState(buildInfo)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    let isMounted = true
    
    getVersionInfo().then(info => {
      if (isMounted) {
        setVersionData(info)
        setIsLoaded(true)
      }
    })
    
    return () => {
      isMounted = false
    }
  }, [])

  if (!isLoaded && process.env.NODE_ENV === 'production') {
    return null // 生产环境下加载前不显示
  }

  // 简洁模式 - 只显示版本号和日期的前10个字符（日期部分）
  if (!showDetails) {
    return (
      <Tooltip label={`完整版本信息: ${versionData.version}\n构建时间: ${versionData.date}\n提交: ${versionData.commitMsg}\n作者: ${versionData.commitAuthor}`}>
        <Badge 
          fontSize="xs" 
          colorScheme="blue" 
          variant="outline" 
          borderRadius="full"
          px={2}
          cursor="pointer"
        >
          v{versionData.version.split('-')[0]}
        </Badge>
      </Tooltip>
    )
  }

  // 详细模式 - 显示完整版本信息
  return (
    <Box fontSize="xs" color="gray.500" mt={4}>
      <Flex direction="column" gap={1}>
        <Text>
          <Text as="span" fontWeight="bold">版本:</Text> {versionData.version}
        </Text>
        <Text>
          <Text as="span" fontWeight="bold">构建时间:</Text> {versionData.date}
        </Text>
        <Text>
          <Text as="span" fontWeight="bold">提交信息:</Text> {versionData.commitMsg}
        </Text>
        <Text>
          <Text as="span" fontWeight="bold">提交者:</Text> {versionData.commitAuthor}
        </Text>
      </Flex>
    </Box>
  )
} 
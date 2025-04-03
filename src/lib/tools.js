import { config as markdownChatConfig } from '@/tools/markdown-chat'

// 空工具配置（用于调试）
const emptyToolConfig = {
  info: {
    id: 'empty-tool',
    name: '空白工具',
    description: '这是一个用于调试的空白工具',
    icon: '🔧',
    category: 'code',
    tags: ['demo', 'debug']
  },
  routes: {
    index: '/tools/empty-tool',
  }
}

// 工具配置接口
export const ToolConfig = {
  // 工具基本信息
  info: {
    id: String,          // 工具唯一标识
    name: String,        // 工具名称
    description: String, // 工具描述
    icon: String,        // 工具图标
    category: String,    // 工具分类
  },
  
  // 工具路由配置
  routes: {
    index: String,      // 工具首页路由
    api: String,        // 工具 API 路由（可选）
  },
  
  // 工具组件配置
  components: {
    icon: Function,    // 工具图标组件
    preview: Function, // 工具预览组件
    detail: Function,  // 工具详情组件
  }
}

// 注册工具
export const tools = [
  markdownChatConfig,
  emptyToolConfig,
]

// 获取所有工具
export const getAllTools = () => {
  return tools
}

// 根据 ID 获取工具
export const getToolById = (id) => {
  return tools.find(tool => tool.info.id === id)
}

// 根据分类获取工具
export const getToolsByCategory = (category) => {
  return tools.filter(tool => tool.info.category === category)
}

// 搜索工具
export const searchTools = (query) => {
  const lowercaseQuery = query.toLowerCase()
  return tools.filter(tool => 
    tool.info.name.toLowerCase().includes(lowercaseQuery) ||
    tool.info.description.toLowerCase().includes(lowercaseQuery)
  )
} 
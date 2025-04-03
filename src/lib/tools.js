import { config as markdownChatConfig } from '@/tools/markdown-chat'

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
    icon: Component,    // 工具图标组件
    preview: Component, // 工具预览组件
    detail: Component,  // 工具详情组件
  }
}

// 注册工具
export const tools = [
  markdownChatConfig,
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
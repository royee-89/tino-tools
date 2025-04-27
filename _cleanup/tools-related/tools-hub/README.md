# Tools Hub

一个集成各种实用工具的平台，包括 Markdown 转聊天气泡等工具。

## 功能特点

- 响应式设计，支持 PC 和移动端
- 工具分类和搜索
- 工具集成接口
- 热门工具推荐
- 最新工具展示

## 开发技术

- Next.js
- React
- Chakra UI
- SCSS

## 快速开始

1. 克隆项目

```bash
git clone <repository-url>
cd tools-hub
```

2. 安装依赖

```bash
npm install
```

3. 启动开发服务器

```bash
npm run dev
```

4. 打开浏览器访问 http://localhost:3000

## 工具集成

要将新工具集成到平台中，需要：

1. 在 `src/tools` 目录下创建工具目录
2. 实现工具的组件和功能
3. 在 `src/lib/tools.js` 中注册工具配置

工具配置示例：

```javascript
export const toolConfig = {
  info: {
    id: 'tool-id',
    name: '工具名称',
    description: '工具描述',
    icon: '🔧',
    category: 'category',
  },
  
  routes: {
    index: '/tools/tool-id',
    api: '/api/tools/tool-id',
  },
  
  components: {
    icon: ToolIcon,
    preview: ToolPreview,
    detail: ToolDetail,
  }
}
```

## 目录结构

```
tools-hub/
├── src/
│   ├── components/    # 共享组件
│   ├── lib/          # 工具函数和配置
│   ├── pages/        # 页面组件
│   ├── styles/       # 样式文件
│   └── tools/        # 工具实现
├── public/           # 静态资源
└── package.json
```

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

ISC 
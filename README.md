# Tino Tools

一个多功能的开发工具集合网站，提供各种实用的开发工具和实用程序。

## 功能特点

- 🔄 Markdown 转换器
  - 支持将 Markdown 转换为微信公众号聊天气泡样式
  - 实时预览转换效果
  - 一键复制转换后的内容

- 🎨 现代化的用户界面
  - 响应式设计，支持移动端和桌面端
  - 简洁直观的操作界面
  - 优雅的动画效果

## 技术栈

- ⚛️ Next.js - React 框架
- 🎨 Chakra UI - UI 组件库
- 📝 Marked - Markdown 解析
- 🎯 TypeScript - 类型安全
- 📱 响应式设计

## 开始使用

1. 克隆仓库
```bash
git clone https://github.com/royee-89/tino-tools.git
```

2. 安装依赖
```bash
cd tino-tools
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 打开浏览器访问 `http://localhost:3000`

## 工具列表

### Markdown 转微信聊天气泡
将 Markdown 文本转换为微信风格的聊天气泡样式，支持：
- 基础 Markdown 语法
- 自动时间戳
- 左右对话气泡布局
- 一键复制转换后的内容

## 开发计划

- [x] 工具集首页开发
  - [x] 工具卡片布局
  - [x] 分类展示
  - [ ] 搜索功能

- [ ] Markdown 转换工具优化
  - [ ] 更多 Markdown 语法支持
  - [ ] 代码块显示优化
  - [ ] 图片上传功能
  - [ ] 表情符号支持

## 部署

本项目使用 GitHub Actions 进行自动部署。每次推送到 master 分支时会自动触发部署流程：

1. 自动构建
2. 部署到服务器 (https://tinotools.cn)
3. 重启服务

### 手动部署

如需手动触发部署，可以在GitHub Actions页面手动运行部署工作流。

### 服务器维护

服务器配置和监控脚本位于 `deploy/scripts/` 目录下：

- `setup.sh`: 服务器初始化配置脚本
- `healthcheck.sh`: 服务器健康检查脚本
- `monitor.sh`: 应用监控和自动恢复脚本

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目。

## 许可证

MIT License 
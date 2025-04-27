# 问题清单

## 部署相关问题

### 1. macOS 系统文件导致构建失败

**问题描述**：
在 macOS 系统下打包部署文件时，系统会自动生成一些隐藏文件（如 `.DS_Store`、`._*` 等），这些文件包含非 UTF-8 编码的内容，导致 Next.js 构建失败。

**错误信息**：
```
Failed to compile.
./src/pages/.__app.js
./src/pages/.__document.js
./src/pages/.__error.js
./src/pages/._changelog.js
./src/pages/._index.js
```

**解决方案**：
1. 在打包时排除 macOS 系统文件：
```bash
# 创建不包含系统文件的文件列表
find . -type f ! -path "./node_modules/*" ! -path "./.next/*" ! -name ".DS_Store" ! -name "._*" ! -name ".AppleDouble" ! -name ".LSOverride" ! -name "deploy.tar.gz" ! -name ".*" ! -name "__*" -print > files_to_archive.txt

# 创建部署包时排除 macOS 元数据
tar --no-xattrs --no-mac-metadata -czf deploy.tar.gz -T files_to_archive.txt
```

2. 在服务器上部署前清理隐藏文件：
```bash
find . -name '._*' -delete && find . -name '.DS_Store' -delete
```

### 2. PM2 进程管理问题

**问题描述**：
多次部署后，服务器上可能存在多个 PM2 进程实例，有些处于 error 状态。

**解决方案**：
1. 部署前清理所有 PM2 进程：
```bash
pm2 delete all
```

2. 使用唯一的应用名称启动新进程：
```bash
pm2 start npm --name tino-tools -- start
```

### 3. 部署流程优化建议

**待优化项目**：
1. 自动化部署流程
   - 创建部署脚本，简化命令执行
   - 添加环境变量配置
   - 集成到 CI/CD 流程

2. 部署安全性
   - 添加部署密钥管理
   - 实现环境隔离
   - 添加部署日志记录

3. 部署可靠性
   - 添加部署回滚机制
   - 实现自动备份
   - 添加健康检查

4. 监控告警
   - 添加应用监控
   - 设置错误告警
   - 实现日志收集

## 使用说明

### 手动部署步骤

1. 在本地准备部署包：
```bash
# 清理并创建部署包
find . -type f ! -path "./node_modules/*" ! -path "./.next/*" ! -name ".DS_Store" ! -name "._*" ! -name ".AppleDouble" ! -name ".LSOverride" ! -name "deploy.tar.gz" ! -name ".*" ! -name "__*" -print > files_to_archive.txt && tar --no-xattrs --no-mac-metadata -czf deploy.tar.gz -T files_to_archive.txt
```

2. 上传并部署：
```bash
# 上传文件并执行部署
scp -P 22 deploy.tar.gz root@175.27.254.35:/www/wwwroot/tino-tools/ && ssh -p 22 root@175.27.254.35 "cd /www/wwwroot/tino-tools && find . -name '._*' -delete && find . -name '.DS_Store' -delete && tar -xzf deploy.tar.gz && rm deploy.tar.gz && rm -rf .next node_modules && export NODE_ENV=production && npm install && npm run build && export PORT=3000 HOST=0.0.0.0 && pm2 start npm --name tino-tools -- start"
```

### 部署检查清单

- [ ] 清理本地构建缓存（`.next`、`node_modules`）
- [ ] 排除系统隐藏文件
- [ ] 检查服务器磁盘空间
- [ ] 清理服务器上的旧文件
- [ ] 确认 PM2 进程状态
- [ ] 验证应用是否正常运行
- [ ] 检查应用日志是否有错误

## GitHub Actions 部署说明

### 当前部署流程

1. 触发条件：
   - 推送到 `main` 分支
   - 手动触发工作流

2. 部署步骤：
   - 检出代码
   - 设置 Node.js 环境
   - 安装依赖
   - 构建项目
   - 使用 SSH 部署到服务器

3. 环境变量配置：
   - `SSH_PRIVATE_KEY`: SSH 私钥
   - `SERVER_HOST`: 服务器地址
   - `SERVER_PORT`: SSH 端口
   - `SERVER_PATH`: 部署目录

### 手动部署方式

如果 GitHub Actions 部署失败，可以参考上面的"手动部署步骤"进行部署。

### 常见问题处理

1. GitHub Actions 部署失败时：
   - 检查 Actions 日志
   - 确认环境变量配置
   - 验证 SSH 连接
   - 检查服务器状态

2. 部署后应用无法访问：
   - 检查 PM2 进程状态
   - 查看应用日志
   - 确认端口配置
   - 验证服务器防火墙设置 
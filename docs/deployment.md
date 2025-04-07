# 小匠工具集部署和监控指南

## 部署系统

小匠工具集使用GitHub Actions自动化部署系统，支持自动部署、回滚和通知功能。

### 自动部署流程

每当代码推送到`master`分支时，会自动触发部署流程：

1. 检出代码并设置Node.js环境
2. 生成带时间戳和Git提交哈希的唯一版本号
3. 安装依赖并构建项目
4. 将版本信息写入应用
5. 创建部署包并上传到服务器
6. 备份当前运行版本（保留最近10个版本）
7. 清理服务器目录并解压新版本
8. 安装依赖并启动应用
9. 验证应用是否正常运行
10. 发送部署通知

### 手动触发部署

可以在GitHub仓库的Actions页面手动触发部署：

1. 访问仓库的Actions页面
2. 点击"Deploy to Production"工作流
3. 点击"Run workflow"
4. 选择要部署的分支（默认master）
5. 如果需要回滚，在"回滚到指定版本"框中输入版本号

### 版本回滚

如果新版本出现问题，有两种回滚方式：

#### 自动回滚

如果部署过程中应用启动失败，系统会自动回滚到上一个正常运行的版本。

#### 手动回滚

1. 访问GitHub仓库的Actions页面
2. 点击"Deploy to Production"工作流
3. 点击"Run workflow"
4. 在"回滚到指定版本"框中输入要回滚的版本号
   - 版本号格式：`YYYYMMDDHHMMSS-xxxxxxx`（时间戳-Git哈希）
   - 可以在服务器的`/www/wwwroot/tino-tools/../versions/`目录查看可用版本

### 查看版本历史

可以通过以下命令查看服务器上的版本历史：

```bash
ssh root@服务器IP "ls -la /www/wwwroot/tino-tools/../versions/"
```

## 监控系统

小匠工具集包含一个简单的监控系统，用于监控应用运行状态并在出现问题时发送告警。

### 监控功能

- PM2进程状态监控
- 内存使用监控
- CPU使用监控
- 网站可访问性监控
- 响应时间监控

### 启动监控系统

首先，安装所需依赖：

```bash
cd /www/wwwroot/tino-tools
npm install axios node-schedule
```

然后，使用PM2启动监控脚本：

```bash
cd /www/wwwroot/tino-tools
pm2 start scripts/monitor.js --name tino-monitor
```

### 配置监控参数

监控系统可以通过环境变量进行配置：

- `TINO_WEBHOOK_URL`: 钉钉/企业微信/Slack的Webhook URL
- `TINO_APP_URL`: 应用URL，默认为http://localhost:3000
- `TINO_CHECK_INTERVAL`: 检查间隔(分钟)，默认为5
- `TINO_MEMORY_THRESHOLD`: 内存告警阈值(MB)，默认为500
- `TINO_CPU_THRESHOLD`: CPU告警阈值(%)，默认为80

可以创建环境配置文件：

```bash
cat > /www/wwwroot/tino-tools/monitor.env << 'EOF'
TINO_WEBHOOK_URL=https://oapi.dingtalk.com/robot/send?access_token=xxxxx
TINO_APP_URL=https://tools.example.com
TINO_CHECK_INTERVAL=5
TINO_MEMORY_THRESHOLD=500
TINO_CPU_THRESHOLD=80
EOF
```

然后使用这个环境文件启动监控：

```bash
pm2 start scripts/monitor.js --name tino-monitor --env-file monitor.env
```

### 查看监控日志

监控日志保存在`/www/wwwroot/tino-tools/logs/`目录：

- `monitor.log`: 常规日志
- `monitor-error.log`: 错误日志

查看最新日志：

```bash
tail -f /www/wwwroot/tino-tools/logs/monitor.log
```

### 配置告警通知

可以配置以下告警通道之一：

#### 钉钉机器人

1. 在钉钉群中添加自定义机器人
2. 获取Webhook URL
3. 设置`TINO_WEBHOOK_URL`为钉钉的Webhook URL

#### 企业微信机器人

1. 在企业微信群中添加自定义机器人
2. 获取Webhook URL
3. 设置`TINO_WEBHOOK_URL`为企业微信的Webhook URL

## 常见问题

### 部署失败

如果部署失败，请检查GitHub Actions日志，常见原因：

1. SSH连接问题：检查SSH密钥是否正确配置
2. 磁盘空间不足：检查服务器磁盘空间
3. Node.js版本不兼容：检查Node.js版本要求

### 监控告警误报

如果收到误报，可以调整阈值：

1. 内存使用告警：调整`TINO_MEMORY_THRESHOLD`
2. CPU使用告警：调整`TINO_CPU_THRESHOLD`
3. 响应时间告警：目前固定为2000ms，可修改`scripts/monitor.js` 
# GitHub Actions 部署配置指南

本文档描述如何设置GitHub Actions来自动部署TinoTools项目到服务器。

## 配置GitHub Secrets

在GitHub仓库中，你需要配置以下Secrets，这些将被GitHub Actions工作流使用：

1. **SSH_PRIVATE_KEY**: 用于SSH连接到服务器的私钥
2. **SSH_KNOWN_HOSTS**: 服务器的已知主机信息
3. **SERVER_IP**: 服务器IP地址
4. **SERVER_USER**: SSH登录用户名

### 如何配置Secrets

1. 在GitHub仓库页面，点击 "Settings" 选项卡
2. 在左侧菜单中选择 "Secrets and variables" -> "Actions"
3. 点击 "New repository secret" 按钮，添加上述四个密钥

### 获取SSH_KNOWN_HOSTS

在本地终端执行：

```bash
ssh-keyscan -t rsa 你的服务器IP地址
```

将输出结果复制到SSH_KNOWN_HOSTS密钥中。

### 生成SSH密钥对

如果还没有SSH密钥对，可以执行：

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

将私钥内容（~/.ssh/id_rsa）复制到SSH_PRIVATE_KEY密钥中。
将公钥（~/.ssh/id_rsa.pub）添加到服务器的~/.ssh/authorized_keys文件中。

## 服务器配置

1. 确保服务器上的目标目录（/var/www/tinotools.cn）存在，并且SSH用户有写入权限
2. 确保服务器已安装Node.js、npm和PM2
3. 确保服务器上的Nginx已正确配置

## 测试部署流程

配置完成后，你可以通过以下方式手动触发部署：

1. 在GitHub仓库页面，点击 "Actions" 选项卡
2. 选择 "Deploy TinoTools" 工作流
3. 点击 "Run workflow" 按钮
4. 填写部署原因（可选）并确认

## 故障排除

如果部署失败，请检查：

1. GitHub Actions日志中的错误信息
2. 确认所有Secrets是否正确配置
3. 检查服务器上的目录权限
4. 检查服务器上的Nginx配置是否正确
5. 服务器上的PM2日志： `pm2 logs tino-tools` 
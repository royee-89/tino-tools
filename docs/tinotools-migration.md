# TinoTools 迁移总结

本文档总结了将TinoTools服务从 royeenote.online 迁移到 tinotools.cn 的所有变更和配置步骤。

## 完成的工作

### 1. 代码仓库更新

- [x] 更新GitHub Actions工作流配置 (`.github/workflows/deploy.yml`)
- [x] 更新Nginx配置文件 (`deploy/nginx.conf`) 
- [x] 更新服务器初始化脚本 (`deploy/scripts/setup.sh`)
- [x] 创建服务器健康检查脚本 (`deploy/scripts/healthcheck.sh`)
- [x] 创建应用监控脚本 (`deploy/scripts/monitor.sh`)
- [x] 更新README.md文件

### 2. 服务器配置

需要在服务器上执行以下操作：

```bash
# 创建新的网站目录
mkdir -p /var/www/tinotools.cn/public_html

# 设置目录权限
chown -R www-data:www-data /var/www/tinotools.cn
chmod -R 755 /var/www/tinotools.cn

# 配置Nginx
cp /path/to/nginx.conf /etc/nginx/sites-available/tinotools.cn
ln -sf /etc/nginx/sites-available/tinotools.cn /etc/nginx/sites-enabled/
nginx -t && systemctl restart nginx

# 申请SSL证书
certbot --nginx -d tinotools.cn -d www.tinotools.cn
```

### 3. DNS配置

需要在DNS服务提供商处添加以下记录：

| 记录类型 | 主机记录 | 记录值 | TTL |
|---------|---------|-------|-----|
| A       | @       | 服务器IP地址 | 600 |
| A       | www     | 服务器IP地址 | 600 |

## GitHub Actions Secrets配置

要使GitHub Actions工作流正常工作，需要在GitHub仓库中配置以下Secrets：

1. **SSH_PRIVATE_KEY**：用于SSH连接到服务器的私钥
2. **SSH_KNOWN_HOSTS**：服务器的已知主机信息
3. **SERVER_IP**：服务器IP地址
4. **SERVER_USER**：SSH登录用户名

### 获取Secrets值的方法：

#### SSH_PRIVATE_KEY

通常是`~/.ssh/id_rsa`文件的内容：

```bash
cat ~/.ssh/id_rsa
```

#### SSH_KNOWN_HOSTS

```bash
ssh-keyscan -t rsa 服务器IP地址
```

#### SERVER_IP

填写服务器的公网IP地址。

#### SERVER_USER

填写用于SSH登录的用户名。

### 在GitHub上配置Secrets

1. 前往GitHub仓库页面
2. 点击 "Settings" 选项卡
3. 在左侧菜单中选择 "Secrets and variables" -> "Actions"
4. 点击 "New repository secret" 按钮
5. 分别添加上述四个密钥

## 测试部署

配置完成后，可以通过以下步骤测试部署：

1. 在GitHub仓库页面，点击 "Actions" 选项卡
2. 选择 "Deploy TinoTools" 工作流
3. 点击 "Run workflow" 按钮
4. 填写部署原因（例如："迁移到新域名"）并点击确认

## 监控与维护

部署完成后，可以通过以下方式监控应用状态：

```bash
# 检查服务器健康状态
bash /var/www/tinotools.cn/deploy/scripts/healthcheck.sh

# 监控应用状态
bash /var/www/tinotools.cn/deploy/scripts/monitor.sh

# 查看PM2日志
pm2 logs tino-tools

# 查看Nginx访问日志
tail -f /var/log/nginx/tinotools.cn-access.log

# 查看Nginx错误日志
tail -f /var/log/nginx/tinotools.cn-error.log
```

## 定期维护任务

建议设置以下定期维护任务：

```bash
# 编辑crontab
crontab -e

# 添加以下内容
# 每5分钟监控一次应用状态
*/5 * * * * /var/www/tinotools.cn/deploy/scripts/monitor.sh >> /var/log/tinotools_monitor.log 2>&1

# 每天凌晨3点进行健康检查
0 3 * * * /var/www/tinotools.cn/deploy/scripts/healthcheck.sh >> /var/log/tinotools_health.log 2>&1
```

## 故障排除

如果部署失败或网站无法访问，请参考以下步骤：

1. 检查GitHub Actions日志中的错误信息
2. 确认所有Secrets是否正确配置
3. 检查服务器上的目录权限
4. 检查SSL证书是否正确配置
5. 检查Nginx配置和日志
6. 检查PM2进程状态和日志 
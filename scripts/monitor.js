#!/usr/bin/env node

/**
 * 小匠工具集服务器监控脚本
 * 
 * 使用方法:
 * 1. 确保安装了依赖: npm install axios commander node-schedule
 * 2. 设置环境变量或修改下面的配置
 * 3. 使用PM2运行: pm2 start scripts/monitor.js --name tino-monitor
 * 
 * 环境变量:
 * - TINO_WEBHOOK_URL: 钉钉/企业微信/Slack 的Webhook URL
 * - TINO_APP_URL: 应用URL，默认为 http://localhost:3000
 * - TINO_CHECK_INTERVAL: 检查间隔(分钟)，默认为 5
 * - TINO_MEMORY_THRESHOLD: 内存告警阈值(MB)，默认为 500
 * - TINO_CPU_THRESHOLD: CPU告警阈值(%)，默认为 80
 */

const axios = require('axios');
const { exec } = require('child_process');
const schedule = require('node-schedule');
const { promisify } = require('util');
const execAsync = promisify(exec);
const os = require('os');
const fs = require('fs');
const path = require('path');

// 配置
const config = {
  webhookUrl: process.env.TINO_WEBHOOK_URL || '',
  appUrl: process.env.TINO_APP_URL || 'http://localhost:3000',
  checkInterval: parseInt(process.env.TINO_CHECK_INTERVAL || '5', 10),
  memoryThreshold: parseInt(process.env.TINO_MEMORY_THRESHOLD || '500', 10),
  cpuThreshold: parseInt(process.env.TINO_CPU_THRESHOLD || '80', 10),
  appName: 'tino-tools',
  logDir: process.env.TINO_LOG_DIR || '/www/wwwroot/tino-tools/logs',
};

// 创建日志目录
if (!fs.existsSync(config.logDir)) {
  fs.mkdirSync(config.logDir, { recursive: true });
}

// 日志文件
const logFile = path.join(config.logDir, 'monitor.log');
const errorLogFile = path.join(config.logDir, 'monitor-error.log');

// 简单日志函数
function log(message, isError = false) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  
  // 控制台输出
  console.log(logMessage);
  
  // 写入日志文件
  fs.appendFileSync(isError ? errorLogFile : logFile, logMessage);
  
  // 如果是错误且设置了Webhook，发送告警
  if (isError && config.webhookUrl) {
    sendAlert(`🚨 监控告警: ${message}`);
  }
}

// 发送告警
async function sendAlert(message) {
  if (!config.webhookUrl) {
    log('未配置Webhook URL，无法发送告警', true);
    return;
  }

  try {
    // 获取服务器信息
    const hostname = os.hostname();
    const uptime = os.uptime();
    const uptimeStr = formatUptime(uptime);
    
    // 告警信息
    const alertMsg = {
      msgtype: 'markdown',
      markdown: {
        title: '小匠工具集监控告警',
        text: `## 🚨 小匠工具集监控告警
### ${message}

**服务器信息:**
- 主机名: ${hostname}
- 运行时间: ${uptimeStr}
- 内存使用: ${formatMemory(os.totalmem() - os.freemem())}/${formatMemory(os.totalmem())}
- CPU负载: ${os.loadavg()[0].toFixed(2)}

**时间:** ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}

> 来自小匠工具集监控系统
`
      }
    };

    // 适配不同的Webhook格式
    let payload;
    if (config.webhookUrl.includes('dingtalk')) {
      // 钉钉
      payload = alertMsg;
    } else if (config.webhookUrl.includes('wechat')) {
      // 企业微信
      payload = {
        msgtype: 'markdown',
        markdown: {
          content: alertMsg.markdown.text
        }
      };
    } else {
      // Slack或其他
      payload = {
        text: message,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: alertMsg.markdown.text
            }
          }
        ]
      };
    }

    await axios.post(config.webhookUrl, payload);
    log(`已发送告警: ${message}`);
  } catch (error) {
    log(`发送告警失败: ${error.message}`, true);
  }
}

// 检查PM2进程状态
async function checkPM2Status() {
  try {
    const { stdout } = await execAsync(`pm2 jlist`);
    const processes = JSON.parse(stdout);
    const appProcess = processes.find(p => p.name === config.appName);
    
    if (!appProcess) {
      throw new Error(`找不到应用 ${config.appName}`);
    }
    
    const status = appProcess.pm2_env.status;
    const memory = Math.round(appProcess.monit.memory / (1024 * 1024));
    const cpu = appProcess.monit.cpu;
    
    log(`PM2状态: ${status}, 内存: ${memory}MB, CPU: ${cpu}%`);
    
    // 检查状态
    if (status !== 'online') {
      log(`应用状态异常: ${status}`, true);
      return false;
    }
    
    // 检查内存
    if (memory > config.memoryThreshold) {
      log(`内存使用超过阈值: ${memory}MB > ${config.memoryThreshold}MB`, true);
    }
    
    // 检查CPU
    if (cpu > config.cpuThreshold) {
      log(`CPU使用超过阈值: ${cpu}% > ${config.cpuThreshold}%`, true);
    }
    
    return true;
  } catch (error) {
    log(`检查PM2状态失败: ${error.message}`, true);
    return false;
  }
}

// 检查网站可访问性
async function checkWebsiteStatus() {
  try {
    const startTime = Date.now();
    const response = await axios.get(config.appUrl, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Tino-Monitor/1.0'
      }
    });
    const responseTime = Date.now() - startTime;
    
    log(`网站状态: ${response.status}, 响应时间: ${responseTime}ms`);
    
    if (response.status !== 200) {
      log(`网站返回异常状态码: ${response.status}`, true);
      return false;
    }
    
    if (responseTime > 2000) {
      log(`网站响应时间过长: ${responseTime}ms`, true);
    }
    
    return true;
  } catch (error) {
    log(`网站访问失败: ${error.message}`, true);
    return false;
  }
}

// 辅助函数：格式化正常运行时间
function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  seconds %= 86400;
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  seconds = Math.floor(seconds % 60);
  
  return `${days}天${hours}小时${minutes}分${seconds}秒`;
}

// 辅助函数：格式化内存
function formatMemory(bytes) {
  const mb = Math.round(bytes / (1024 * 1024));
  if (mb < 1024) {
    return `${mb}MB`;
  } else {
    return `${(mb / 1024).toFixed(2)}GB`;
  }
}

// 主检查函数
async function runChecks() {
  log('开始执行监控检查...');
  
  const pm2Status = await checkPM2Status();
  const websiteStatus = await checkWebsiteStatus();
  
  if (!pm2Status || !websiteStatus) {
    log('监控检查发现问题', true);
  } else {
    log('监控检查完成，一切正常');
  }
}

// 启动定时任务
function startScheduler() {
  // 立即执行一次检查
  runChecks();
  
  // 设置定时任务 - 每X分钟执行一次
  const job = schedule.scheduleJob(`*/${config.checkInterval} * * * *`, runChecks);
  
  log(`监控已启动，检查间隔: ${config.checkInterval}分钟`);
  
  // 处理进程信号
  process.on('SIGTERM', () => {
    job.cancel();
    log('监控已停止');
    process.exit(0);
  });
  
  process.on('SIGINT', () => {
    job.cancel();
    log('监控已停止');
    process.exit(0);
  });
}

// 启动监控
startScheduler(); 
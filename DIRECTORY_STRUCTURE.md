# TinoTools 项目目录结构

## 核心目录

```
tino-tools/                 # 项目根目录
├── src/                    # 源代码目录
│   ├── components/         # 公共组件
│   ├── pages/              # 页面组件
│   │   ├── api/            # API路由
│   │   ├── tools/          # 工具页面
│   │   └── index.js        # 首页
│   ├── lib/                # 库和配置
│   ├── styles/             # 样式文件
│   ├── tools/              # 工具源码
│   └── utils/              # 实用工具函数
├── public/                 # 公共资源
│   ├── images/             # 图片资源
│   └── locales/            # 国际化资源
├── scripts/                # 脚本文件
└── docs/                   # 文档
```

## 开发配置文件

```
├── .github/                # GitHub工作流配置
├── .next/                  # Next.js构建目录
├── .vscode/                # VS Code配置
├── node_modules/           # 依赖模块
├── .deployignore           # 部署忽略配置
├── .gitignore              # Git忽略文件
├── jsconfig.json           # JavaScript配置
├── next.config.js          # Next.js配置
├── package.json            # 项目依赖配置
└── package-lock.json       # 依赖锁定文件
```

## 文档和资源文件

```
├── README.md               # 项目说明文档
├── CHANGELOG.md            # 变更日志
├── TODO.md                 # 待办事项
└── TODOS.md                # 详细任务列表
```

## 辅助目录

```
├── backups/                # 备份文件
├── deploy/                 # 部署相关
├── logs/                   # 日志文件
└── tmp/                    # 临时文件
```

## 暂存区(_cleanup)

包含暂时不确定如何归类的文件和目录，后续会重新整理：

```
├── _cleanup/
    ├── config/             # 配置文件
    ├── deploy/             # 部署相关文件
    ├── nginx/              # Nginx配置
    ├── docs/               # 文档
    └── tools-related/      # 工具相关资源
```

## 开发规范

1. **新组件位置**：
   - 公共组件放在 `src/components/`
   - 页面组件放在 `src/pages/`
   - 工具相关组件放在 `src/tools/工具名称/components/`

2. **API端点**：所有API端点放在 `src/pages/api/` 下

3. **样式文件**：
   - 全局样式：`src/styles/`
   - 组件样式：与组件放在同一目录

4. **资源文件**：图片等静态资源放在 `public/` 目录下 
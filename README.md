# 墨课 - 中国艺术学自主知识体系AI平台

## 项目简介

基于Vite + React + TypeScript + Tailwind CSS构建的中国风AI教育平台。

## 本地运行方式

### 方式一：开发模式（推荐）

```bash
# 1. 安装依赖（首次运行需要）
npm install

# 2. 启动开发服务器
npm run dev

# 3. 浏览器访问 http://localhost:3000
```

> 开发服务器已配置端口为 **3000**（不再是Vite默认的5173）

### 方式二：预览构建产物

```bash
# 1. 安装依赖
npm install

# 2. 构建项目
npm run build

# 3. 预览生产版本
npm run preview

# 4. 浏览器访问 http://localhost:4173
```

### 方式三：直接用HTTP服务器打开（无需安装依赖）

项目已预构建，dist目录可直接部署到任何静态服务器：

```bash
# 使用 Python（方式1）
cd dist && python3 -m http.server 3000

# 或使用 Python（方式2）
cd dist && python -m SimpleHTTPServer 3000

# 或使用 Node.js 的 serve
npx serve dist

# 或使用 VS Code 的 Live Server 插件
# 右键 dist/index.html → "Open with Live Server"
```

然后浏览器访问对应的本地地址即可。

### 方式四：双击打开（有限制）

由于浏览器安全策略（CORS），直接双击打开 dist/index.html 可能无法加载JS/CSS资源。建议使用上述任意HTTP服务器方式。

如果必须在无服务器环境下打开，可以将 dist 目录部署到以下免费平台：
- [Vercel](https://vercel.com) - 拖拽上传即可
- [Netlify](https://netlify.com) - 拖拽上传即可
- [GitHub Pages](https://pages.github.com) - 免费静态托管

## 目录结构

```
ink-deploy/
├── dist/                  # 预构建产物（可直接部署）
│   ├── index.html         # 入口文件
│   ├── assets/            # JS/CSS 资源
│   └── images/            # 图片素材
├── public/images/         # 静态图片资源（开发时）
├── src/
│   ├── App.tsx            # 主应用（登录→大厅→课堂路由）
│   ├── main.tsx           # React入口
│   ├── index.css          # 全局样式
│   ├── components/        # 通用组件
│   ├── lib/data.ts        # 演示数据
│   └── sections/          # 页面组件
│       ├── LoginPage.tsx      # 登录页
│       ├── LobbyPage.tsx      # 教室大厅
│       ├── ClassroomPage.tsx  # 课堂框架
│       ├── PreClassSection.tsx    # 课前准备（完整workflow）
│       ├── InClassSection.tsx     # 课中互动
│       ├── PostClassSection.tsx   # 课后归档
│       ├── Navigation.tsx         # 导航栏
│       ├── HeroSection.tsx        # 首页头图
│       ├── GallerySection.tsx     # 画廊轮播
│       └── FooterSection.tsx      # 页脚
├── index.html             # HTML入口
├── vite.config.ts         # Vite配置（端口3000）
├── package.json           # 依赖配置
├── tailwind.config.js     # Tailwind配置
└── tsconfig.json          # TypeScript配置
```

## 三页流程

1. **登录页** (`/`) - 画框式登录卡片
2. **教室大厅** (`/lobby`) - 在线教室列表、新建教室
3. **课堂页** (`/classroom`) - 课前准备→课中互动→课后归档

## 技术栈

- Vite 8
- React 19
- TypeScript 6
- Tailwind CSS 4
- GSAP 动画库

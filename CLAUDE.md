# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Visiora 是一个基于 React 的 AI 图像生成应用，使用 Pollinations AI API 生成图像。项目采用现代前端技术栈，包含完整的用户认证和积分系统。

## Development Commands

### 必要的开发命令
- `npm run dev` - 启动开发服务器 (Vite, 默认端口 5173)
- `npm run build` - 生产环境构建
- `npm run preview` - 预览生产构建
- `npm run lint` - 运行 ESLint 代码检查

### 测试命令
此项目当前没有配置测试框架。如需添加测试，建议使用 Vitest。

## Architecture Overview

### 核心架构模式
- **React 18** 使用函数组件和 Hooks
- **Context API** 用于全局状态管理（认证、积分系统）
- **组件驱动开发** - 高度模块化的组件结构
- **懒加载** - 非关键组件使用 React.lazy() 懒加载
- **Suspense** - 配合懒加载提供加载状态

### 状态管理
- `AuthContextV2.jsx` - 用户认证和积分管理的核心上下文
- 自定义 hooks 用于复用状态逻辑 (`useAuth`, `useTheme`, `useLocalStorage`)
- 本地存储用于历史记录和匿名用户积分

### 关键服务集成
- **Firebase Authentication** - 用户注册/登录/邮箱验证
- **Firestore** - 用户数据、生成历史、积分存储
- **Pollinations AI** - 图像生成和提示词增强
- **Netlify** - 托管部署

## Code Structure

### 组件层次结构
```
App.jsx (主容器)
├── AuthProvider (认证上下文)
├── Header (导航栏)
├── Hero (英雄区块)
├── ModernTabNavigation (选项卡导航)
├── Tab Components (选项卡内容)
│   ├── ModernGenerateTab (图像生成)
│   ├── ModernEnhanceTab (提示词增强)
│   ├── ModernMasonryHistoryTab (生成历史)
│   └── GalleryPage (用户图库)
└── Footer
```

### API 服务层
- `pollinationService.js` - Pollinations AI 接口封装
- `imageServiceV2.js` - 图像存储和管理
- `userServiceV2.js` - 用户资料管理
- `creditsServiceV2.js` - 积分系统核心逻辑

### 关键设计模式
- **组合模式** - 复杂组件通过小组件组合
- **自定义 Hooks** - 状态逻辑复用
- **懒加载** - 性能优化
- **错误边界** - 优雅错误处理

## Firebase Configuration

### 必需环境变量
需要在 `.env` 文件中配置：
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

### Firestore 集合结构
- `users` - 用户资料和积分信息
- `user_images` - 用户生成的图像记录

## Key Dependencies

### 核心框架
- **React 18.3.1** - 主框架
- **Vite 7.0.4** - 构建工具
- **Firebase 12.0.0** - 后端服务

### UI 和动画
- **Tailwind CSS 3.4** - 样式框架
- **Framer Motion 12.23.12** - 动画库
- **Radix UI** - 无头 UI 组件
- **Lucide React** - 图标库

### 状态和数据
- **React Context** - 全局状态
- **自定义 hooks** - 状态逻辑复用

## Development Guidelines

### 代码风格
- 使用 ESLint 进行代码检查
- 组件使用 PascalCase 命名
- 文件名与组件名保持一致
- 优先使用函数组件和 Hooks

### 性能优化
- 使用 React.memo() 防止不必要的重渲染
- 懒加载非关键组件
- 使用 useMemo() 和 useCallback() 优化计算
- Vite 配置了代码分割优化

### 错误处理
- 所有 API 调用都包含 try-catch
- 开发环境显示详细错误，生产环境用户友好提示
- 使用 Suspense 处理异步组件加载

## Deployment

### Netlify 部署
- 构建命令: `npm run build`
- 发布目录: `dist`
- 需要在 Netlify 面板配置环境变量
- `netlify.toml` 配置了重定向规则

### 环境配置
- 开发环境使用 `import.meta.env.DEV` 判断
- 所有 Firebase 配置通过环境变量管理
- 支持开发和生产环境的不同配置
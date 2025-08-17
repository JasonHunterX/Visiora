# 后端认证系统迁移完成

## 概述

已成功将前端的Firebase认证系统替换为后端Java服务的用户模块认证系统。

## 主要更改

### 1. 环境配置 (.env)
```env
# Backend Service Configuration
VITE_USE_BACKEND=true
VITE_API_BASE_URL=http://localhost:8001
VITE_API_TIMEOUT=30000
```

### 2. 新增的文件
- `src/services/authApi.js` - 后端认证API服务
- `src/hooks/useBackendAuth.js` - 后端认证Hook
- `src/contexts/BackendAuthContext.jsx` - 后端认证上下文
- `src/components/auth/PhoneAuthModal.jsx` - 手机号登录/注册组件
- `src/components/layout/BackendHeader.jsx` - 支持后端认证的Header
- `src/hooks/useBackendCredits.js` - 后端积分管理Hook

### 3. 替换的文件
- `src/App.jsx` - 现在使用后端认证系统
- `src/App.jsx.firebase-backup` - Firebase版本的备份

## 功能特点

### 手机号认证
- 支持手机号注册和登录
- 验证码验证机制
- 密码设置（可选）
- 统一的登录/注册接口

### 积分系统集成
- 与后端积分API完全集成
- 支持匿名用户积分
- 登录时自动转移匿名积分
- 实时积分显示和检查

### 用户界面
- 现代化的登录/注册模态框
- 用户下拉菜单
- 积分显示
- 响应式设计

## API端点

### 认证相关
- `POST /api/base/user/login` - 手机号登录/注册
- `POST /api/base/user/captcha` - 发送验证码
- `GET /api/base/user/verify` - 验证Token
- `GET /api/base/user/info` - 获取用户信息
- `POST /api/base/user/logout` - 退出登录

### AI绘图相关
- `POST /api/ai-drawing/generate` - 生成图像
- `POST /api/ai-drawing/enhance-prompt` - 增强提示词
- `GET /api/ai-drawing/task/{taskId}` - 查询任务状态

### 积分相关
- `GET /api/ai-drawing/credits/info` - 获取积分信息
- `POST /api/ai-drawing/credits/check` - 检查积分
- `POST /api/ai-drawing/credits/add` - 增加积分

## 使用方式

### 启动项目
```bash
# 启动后端服务 (端口8001)
cd ai-drawing-backend-service
mvn spring-boot:run

# 启动前端服务 (自动选择可用端口)
cd Visiora
npm run dev
```

### 测试认证流程
1. 打开前端应用：http://localhost:5174
2. 点击"注册"按钮
3. 输入手机号码
4. 点击"发送验证码"
5. 输入验证码和密码（可选）
6. 完成注册/登录

### 测试图像生成
1. 登录成功后，在生成页面输入提示词
2. 点击"生成图像"
3. 系统会调用后端API生成图像
4. 积分会自动扣除

## 故障排除

### 后端连接失败
- 确保后端服务在8001端口运行
- 检查环境变量 `VITE_API_BASE_URL` 是否正确
- 检查网络防火墙设置

### 验证码发送失败
- 确保后端短信服务配置正确
- 检查手机号格式是否正确
- 查看后端日志获取详细错误信息

### Token验证失败
- 检查Token是否已过期
- 确保后端JWT配置正确
- 清除浏览器本地存储重新登录

## 回滚方案

如需回滚到Firebase认证系统：
```bash
cd Visiora
cp src/App.jsx.firebase-backup src/App.jsx
# 更新 .env 文件
VITE_USE_BACKEND=false
```

## 下一步计划

1. 完善错误处理和用户反馈
2. 添加忘记密码功能
3. 集成更多用户管理功能
4. 优化性能和用户体验
5. 添加自动测试覆盖

## 技术栈

- **前端**: React 18, Vite, Tailwind CSS, Framer Motion
- **认证**: JWT Token, 手机验证码
- **状态管理**: React Context + Hooks
- **API通信**: Fetch API, 统一错误处理
- **后端集成**: RESTful API, 标准HTTP状态码
# 🍜 临汾吃啥 · 本地人觅食指南

临汾本地人的私藏美食地图，帮外地游客和本地人找到真正好吃的。

## 技术栈

- **框架**: Vue 3 (Composition API) + TypeScript
- **构建**: Vite
- **样式**: Tailwind CSS v4
- **地图**: Leaflet + 高德瓦片
- **状态**: Pinia（预留）
- **PWA**: vite-plugin-pwa
- **部署**: Cloudflare Pages

## 快速开始

```bash
pnpm install
pnpm dev        # 开发服务器
pnpm build      # 生产构建
pnpm preview    # 预览构建结果
```

## 项目结构

```
src/
├── components/          # UI 组件
│   ├── layout/          # 布局（Header、Sidebar、Drawer）
│   ├── map/             # 地图相关
│   ├── food/            # 美食内容（卡片、筛选、详情）
│   ├── route/           # 路线推荐
│   └── common/          # 通用组件（搜索、标签、导航按钮）
├── composables/         # 组合式函数（数据、地图交互、定位）
├── data/                # 📦 内容数据（JSON，与UI完全分离）
├── types/               # TypeScript 类型定义
├── utils/               # 工具函数（坐标转换、导航链接）
├── views/               # 页面视图
└── assets/styles/       # 全局样式 + 设计系统 Token
```

## 设计原则

1. **移动端优先** — 先保证手机体验，再适配桌面
2. **内容与展示分离** — 所有数据在 `src/data/*.json`，改内容不碰组件
3. **人情味 > 工具感** — 文案保持"本地朋友推荐"的语气
4. **轻量快速** — 首屏加载 < 2s，地图瓦片按需加载

## 数据来源

整理自抖音「盈盈吃不饱」《极限48小时逛吃临汾》及多篇本地美食测评交叉验证。

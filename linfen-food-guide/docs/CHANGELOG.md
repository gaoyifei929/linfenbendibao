# 版本变更记录

## [0.2.0] - 2026-09-30

### 新增
- **路由系统**：创建 `router.ts`，支持 `/` 和 `/about` 路由
- **AboutView**：完整的关于页，包含项目介绍、数据来源、免责声明、反馈入口
- **sources.json**：数据来源与致谢数据文件
- **MobileDrawer.vue**：从 HomeView 抽离的移动端底部抽屉组件
- **DesktopSidebar.vue**：从 HomeView 抽离的桌面端侧边栏组件
- **MapMarker.ts**：标记点图标生成器（纯逻辑模块）
- **MapPopup.vue**：地图弹窗内容组件
- **DishCard.vue**：特色美食卡片组件
- **RouteCard.vue**：路线卡片组件
- **FoodDetail.vue**：店铺详情组件
- **useDrawer.ts**：抽屉状态管理 composable
- **useMapInteraction.ts**：地图交互逻辑 composable
- **useGeolocation.ts**：用户定位 composable
- **utils/search.ts**：搜索/过滤工具函数
- **CONTENT-GUIDE.md**：内容编写指南文档
- **public/manifest.json**：独立的 PWA manifest 文件

### 重构
- HomeView 瘦身：仅保留布局编排和数据传递，展示逻辑下沉到子组件
- FoodMap 使用 MapMarker 模块生成图标
- main.ts 引入 vue-router 和 pinia
- App.vue 使用 router-view
- vite.config.ts 使用外部 manifest.json

### 文档
- 更新 DESIGN-SYSTEM.md：新增完整组件清单
- 更新 CHANGELOG.md：记录本次重构变更

## [0.1.0] - 2025-01-XX

### 新增
- 项目初始化：Vite + Vue 3 + TypeScript + Tailwind CSS
- 设计系统 Token 定义
- 数据迁移：spots/dishes/routes/tips JSON 文件
- 核心组件：AppHeader、CategoryFilter、FoodCard、FoodMap、SearchBar、TagChip、NavButton
- HomeView 移动端/桌面端双布局
- PWA 基础配置
- 文档体系：README、DESIGN-SYSTEM、DATA-SCHEMA、PROJECT-PLAN

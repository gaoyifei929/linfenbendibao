# 设计系统规范

## 色彩

| Token | 值 | 用途 |
|-------|-----|------|
| `--color-primary` | `#D94F3D` | 主色（红油色） |
| `--color-primary-dark` | `#B83A2A` | 主色深 |
| `--color-primary-light` | `#F2C4BE` | 主色浅 |
| `--color-secondary` | `#E8A84C` | 辅色（麦黄色） |
| `--color-bg` | `#FAF7F2` | 页面背景（米白） |
| `--color-card` | `#FFFFFF` | 卡片背景 |
| `--color-text` | `#2B2B2B` | 主文字 |
| `--color-text-muted` | `#6B6560` | 次要文字 |
| `--color-text-light` | `#A8A098` | 辅助文字 |
| `--color-border` | `#EDE8E1` | 边框 |

### 分类色

| 分类 | Token | 色值 |
|------|-------|------|
| 牛肉丸子面 | `--color-cat-wz` | `#D94F3D` |
| 特色小吃 | `--color-cat-xc` | `#E8A84C` |
| 羊汤 | `--color-cat-yt` | `#8B5CF6` |
| 地标交通 | `--color-cat-jd` | `#3B82F6` |
| 周边景点 | `--color-cat-cj` | `#10B981` |

## 字体

- 字体族：PingFang SC → Microsoft YaHei → Hiragino Sans GB → system-ui
- 标题：font-bold, tracking-tight
- 正文：15px, line-height 1.7
- 辅助：12px, letter-spacing 0.02em

## 圆角

- 卡片：16px (`rounded-2xl`)
- 按钮：12px (`rounded-xl`)
- 标签：8px (`rounded-lg`)

## 阴影

- 卡片：`0 2px 12px rgba(0,0,0,0.04)`
- 悬浮：`0 4px 20px rgba(0,0,0,0.08)`
- 浮动：`0 8px 30px rgba(0,0,0,0.12)`

## 间距

基于 4px 网格：4 / 8 / 12 / 16 / 24 / 32

## 动画

- 卡片悬浮：translateY(-2px) + shadow 增强，0.2s ease
- 列表入场：stagger translateY(12px) → 0，0.3s ease-out
- 抽屉滑动：translateY(100%) → 0，0.3s cubic-bezier(0.32, 0.72, 0, 1)

## 组件清单

### 布局组件
| 组件 | 路径 | 说明 |
|------|------|------|
| AppHeader | `components/layout/AppHeader.vue` | 顶部导航栏 |
| MobileDrawer | `components/layout/MobileDrawer.vue` | 移动端底部可拖拽抽屉 |
| DesktopSidebar | `components/layout/DesktopSidebar.vue` | 桌面端侧边栏列表 |

### 地图组件
| 组件 | 路径 | 说明 |
|------|------|------|
| FoodMap | `components/map/FoodMap.vue` | Leaflet 地图主组件 |
| MapMarker | `components/map/MapMarker.ts` | 标记点图标生成器（纯逻辑模块） |
| MapPopup | `components/map/MapPopup.vue` | 弹窗内容组件 |

### 美食内容组件
| 组件 | 路径 | 说明 |
|------|------|------|
| FoodCard | `components/food/FoodCard.vue` | 店铺卡片 |
| FoodDetail | `components/food/FoodDetail.vue` | 店铺详情（弹窗/页面模式） |
| DishCard | `components/food/DishCard.vue` | 特色美食卡片 |
| CategoryFilter | `components/food/CategoryFilter.vue` | 分类筛选栏 |

### 路线组件
| 组件 | 路径 | 说明 |
|------|------|------|
| RouteCard | `components/route/RouteCard.vue` | 单日路线卡片 |

### 通用组件
| 组件 | 路径 | 说明 |
|------|------|------|
| SearchBar | `components/common/SearchBar.vue` | 搜索框 |
| TagChip | `components/common/TagChip.vue` | 标签 |
| NavButton | `components/common/NavButton.vue` | 一键导航按钮 |

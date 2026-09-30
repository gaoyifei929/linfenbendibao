# 临汾美食地图 — Vue 3 项目重构计划

## 一、项目结构

```
linfen-food-guide/
├── docs/                          # 📚 项目文档
│   ├── README.md                  # 项目说明、技术栈、快速开始
│   ├── DESIGN-SYSTEM.md           # 设计系统规范（色彩/字体/间距/组件）
│   ├── DATA-SCHEMA.md             # 数据结构定义与字段说明
│   ├── CONTENT-GUIDE.md           # 内容编写指南（调性、格式、来源标注规范）
│   ├── PROJECT-PLAN.md            # 本文件：项目重构计划
│   └── CHANGELOG.md               # 版本变更记录
│
├── public/                        # 静态资源
│   ├── favicon.svg
│   ├── manifest.json              # PWA manifest
│   └── images/                    # 店铺图片、logo等
│       └── placeholders/          # 无图时的占位图
│
├── src/
│   ├── assets/                    # 构建时处理的资源
│   │   └── styles/
│   │       ├── tailwind.css       # Tailwind 入口 + @layer 自定义
│   │       └── animations.css     # 全局过渡/动画
│   │
│   ├── components/                # UI 组件
│   │   ├── layout/                # 布局组件
│   │   │   ├── AppHeader.vue      # 顶部导航栏
│   │   │   ├── MobileDrawer.vue   # 移动端底部可拖拽抽屉
│   │   │   └── DesktopSidebar.vue # 桌面端侧边栏
│   │   ├── map/                   # 地图相关
│   │   │   ├── FoodMap.vue        # Leaflet 地图主组件
│   │   │   ├── MapMarker.vue      # 自定义标记点
│   │   │   └── MapPopup.vue       # 弹窗内容
│   │   ├── food/                  # 美食内容
│   │   │   ├── FoodCard.vue       # 店铺卡片
│   │   │   ├── FoodDetail.vue     # 店铺详情（弹窗/页面）
│   │   │   ├── DishCard.vue       # 特色美食卡片
│   │   │   └── CategoryFilter.vue # 分类筛选栏
│   │   ├── route/                 # 路线推荐
│   │   │   ├── RouteCard.vue      # 路线卡片
│   │   │   └── RouteTimeline.vue  # 时间线展示
│   │   └── common/                # 通用组件
│   │       ├── SearchBar.vue      # 搜索框
│   │       ├── TagChip.vue        # 标签
│   │       └── NavButton.vue      # 一键导航按钮
│   │
│   ├── composables/               # 组合式函数
│   │   ├── useFoodData.ts         # 数据加载与筛选
│   │   ├── useMapInteraction.ts   # 地图联动逻辑
│   │   ├── useGeolocation.ts      # 用户定位
│   │   └── useDrawer.ts           # 底部抽屉状态
│   │
│   ├── data/                      # 📦 内容数据（与UI完全分离）
│   │   ├── spots.json             # 店铺点位数据
│   │   ├── dishes.json            # 特色美食数据
│   │   ├── routes.json            # 推荐路线数据
│   │   ├── tips.json              # 出行贴士数据
│   │   └── sources.json           # 数据来源与致谢
│   │
│   ├── types/                     # TypeScript 类型定义
│   │   ├── spot.ts                # 店铺类型
│   │   ├── dish.ts                # 美食类型
│   │   ├── route.ts               # 路线类型
│   │   └── category.ts            # 分类类型
│   │
│   ├── utils/                     # 工具函数
│   │   ├── coordTransform.ts      # WGS-84 ↔ GCJ-02 坐标转换
│   │   ├── navigation.ts          # 多平台导航链接生成
│   │   └── search.ts              # 搜索/过滤逻辑
│   │
│   ├── views/                     # 页面视图
│   │   ├── HomeView.vue           # 首页（地图+列表）
│   │   └── AboutView.vue          # 关于/数据来源页
│   │
│   ├── App.vue                    # 根组件
│   ├── main.ts                    # 入口
│   └── router.ts                  # 路由配置
│
├── archive/                       # 🗄️ 原始HTML备份（只读参考）
│   ├── index.html
│   ├── linfen_food_map.html
│   └── 临汾美食地图.html
│
├── index.html                     # Vite 入口 HTML
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── .gitignore
```

## 二、设计系统规范

### 色彩
| Token | 值 | 用途 |
|-------|-----|------|
| `--color-primary` | `#D94F3D` | 主色（红油色） |
| `--color-secondary` | `#E8A84C` | 辅色（麦黄色） |
| `--color-bg` | `#FAF7F2` | 页面背景（米白） |
| `--color-card` | `#FFFFFF` | 卡片背景 |
| `--color-text` | `#2B2B2B` | 主文字 |
| `--color-text-muted` | `#6B6560` | 次要文字 |
| `--color-text-light` | `#A8A098` | 辅助文字 |
| `--color-border` | `#EDE8E1` | 边框/分割线 |

### 字体
- 标题：`font-bold tracking-tight`
- 正文：`text-[15px] leading-[1.7]`
- 辅助：`text-xs tracking-wide`

### 间距基准
- 4px 网格：`p-1`(4) `p-2`(8) `p-3`(12) `p-4`(16) `p-6`(24) `p-8`(32)

### 圆角
- 卡片：`rounded-2xl`(16px)
- 按钮：`rounded-xl`(12px)
- 标签：`rounded-lg`(8px)

### 阴影
- 卡片：`shadow-[0_2px_12px_rgba(0,0,0,0.04)]`
- 悬浮：`shadow-[0_4px_20px_rgba(0,0,0,0.08)]`

## 三、数据 Schema

### Spot（店铺）
```typescript
interface Spot {
  id: string;              // "wz-001"
  category: CategoryId;    // "wz" | "xc" | "yt" | "jd" | "cj"
  name: string;
  coords: [number, number]; // [lat, lng]
  coordSystem: 'gcj' | 'wgs';
  address: string;
  dishes: string[];
  priceRange: string;
  note: string;
  tags: string[];
  images: string[];        // 预留
  status: 'open' | 'closed' | 'unverified';
  source: string;          // 数据来源标识
  verifiedAt: string;      // "2025-10"
}
```

## 四、执行顺序

1. **初始化项目** — Vite + Vue 3 + TypeScript + Tailwind CSS + PWA ✅
2. **建立设计系统** — tailwind.css 中定义所有 token ✅
3. **迁移数据** — 从现有 HTML 提取 → JSON + TypeScript 类型 ✅
4. **核心组件开发** — Header → CategoryFilter → FoodCard → Map → Drawer ✅
5. **页面组装** — HomeView（移动端优先）→ 桌面端适配 ✅
6. **内容区迁移** — 特色美食、路线、贴士 ✅
7. **PWA + 部署** — manifest、service worker、Cloudflare Pages ✅

## 五、文档维护原则

- 每次新增组件，同步更新 DESIGN-SYSTEM.md
- 每次修改数据结构，同步更新 DATA-SCHEMA.md
- 每次内容变更，记录 CHANGELOG.md
- 代码注释用中文，与内容调性一致

## 六、后续待做

- [ ] 添加店铺实拍图片
- [ ] UGC 提交表单接入（腾讯文档/飞书）
- [ ] 用户定位 + 附近排序
- [ ] 店铺详情页独立路由
- [ ] Cloudflare Pages 部署上线
- [ ] 小程序版本评估

# 数据结构定义

## spots.json — 店铺/点位

```typescript
interface Spot {
  id: string              // "wz-001" 格式：分类前缀-序号
  category: CategoryId    // "wz" | "xc" | "yt" | "jd" | "cj"
  name: string            // 店名
  coords: [number, number] // [纬度, 经度]
  coordSystem: 'gcj' | 'wgs' // 坐标系
  address: string         // 地址
  dishes: string[]        // 推荐菜品列表
  priceRange: string      // 价格区间描述
  note: string            // 推荐理由/点评
  tags: string[]          // 标签（必吃、辣、早餐等）
  images: string[]        // 图片路径（预留）
  status: 'open' | 'closed' | 'unverified'
  source: string          // 数据来源标识
  verifiedAt: string      // 验证时间 "YYYY-MM"
}
```

## dishes.json — 特色美食（无固定门店）

```typescript
interface Dish {
  id: string              // "dish-001"
  name: string
  emoji: string           // 展示用emoji
  description: string     // 描述
  region: string          // 产地/哪里能吃到
}
```

## routes.json — 推荐路线

```typescript
interface RouteDay {
  day: number
  title: string           // "Day 1"
  theme: string           // 当日主题
  gradientFrom: string    // 标题渐变起始色
  gradientTo: string      // 标题渐变结束色
  steps: RouteStep[]
}

interface RouteStep {
  time: string            // "早餐" / "午餐" / "下午"
  title: string           // 步骤标题
  description: string     // 详细说明
}
```

## tips.json — 出行贴士

```typescript
interface Tip {
  id: string
  title: string
  content: string
}
```

## 新增数据流程

1. 在对应 JSON 文件中添加条目
2. 确保 id 唯一且符合命名规范
3. 坐标确认坐标系（高德=gcj, GPS/OSM=wgs）
4. 提交后在 CHANGELOG.md 记录变更

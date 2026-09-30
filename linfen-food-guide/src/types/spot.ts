import type { CategoryId } from './category'

/** 店铺/点位 */
export interface Spot {
  /** 唯一标识，如 "wz-001" */
  id: string
  /** 所属分类 */
  category: CategoryId
  /** 店名/地名 */
  name: string
  /** 坐标 [纬度, 经度] */
  coords: [number, number]
  /** 坐标系：gcj=高德, wgs=GPS原始 */
  coordSystem: 'gcj' | 'wgs'
  /** 地址 */
  address: string
  /** 推荐菜品 */
  dishes: string[]
  /** 价格区间 */
  priceRange: string
  /** 推荐理由/点评 */
  note: string
  /** 标签 */
  tags: string[]
  /** 图片路径（预留） */
  images: string[]
  /** 营业状态 */
  status: 'open' | 'closed' | 'unverified'
  /** 数据来源 */
  source: string
  /** 验证时间 */
  verifiedAt: string
}

import type { Spot } from '@/types/spot'
import type { CategoryId } from '@/types/category'

/**
 * 搜索与过滤工具函数
 * - filterByCategory: 按分类筛选
 * - filterByQuery: 按关键词搜索
 * - groupByCategory: 按分类分组
 */

/** 按激活的分类筛选店铺 */
export function filterByCategory(
  spots: Spot[],
  activeCategories: Set<CategoryId>
): Spot[] {
  return spots.filter(s => activeCategories.has(s.category))
}

/** 按关键词搜索店铺（名称、地址、菜品、标签） */
export function filterByQuery(spots: Spot[], query: string): Spot[] {
  const q = query.trim().toLowerCase()
  if (!q) return spots

  return spots.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.address.toLowerCase().includes(q) ||
    s.dishes.some(d => d.toLowerCase().includes(q)) ||
    s.tags.some(t => t.toLowerCase().includes(q))
  )
}

/** 组合筛选：先按分类，再按关键词 */
export function filterSpots(
  spots: Spot[],
  activeCategories: Set<CategoryId>,
  query: string
): Spot[] {
  let result = filterByCategory(spots, activeCategories)
  if (query.trim()) {
    result = filterByQuery(result, query)
  }
  return result
}

/** 按分类分组 */
export function groupByCategory(
  spots: Spot[]
): Partial<Record<CategoryId, Spot[]>> {
  const groups: Partial<Record<CategoryId, Spot[]>> = {}
  for (const spot of spots) {
    if (!groups[spot.category]) groups[spot.category] = []
    groups[spot.category]!.push(spot)
  }
  return groups
}

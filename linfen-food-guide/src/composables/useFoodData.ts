import { ref, computed } from 'vue'
import type { Spot } from '@/types/spot'
import type { CategoryId, Category } from '@/types/category'
import spotsData from '@/data/spots.json'
import dishesData from '@/data/dishes.json'
import routesData from '@/data/routes.json'
import tipsData from '@/data/tips.json'
import type { Dish } from '@/types/dish'
import type { RouteDay } from '@/types/route'

/** 分类定义 */
export const CATEGORIES: Record<CategoryId, Category> = {
  wz: { id: 'wz', name: '牛肉丸子面', color: '#D94F3D', emoji: '🍜' },
  xc: { id: 'xc', name: '特色小吃·面食', color: '#E8A84C', emoji: '🥟' },
  yt: { id: 'yt', name: '羊汤', color: '#8B5CF6', emoji: '🐑' },
  jd: { id: 'jd', name: '地标·交通', color: '#3B82F6', emoji: '📍' },
  cj: { id: 'cj', name: '周边景点', color: '#10B981', emoji: '🏞️' },
}

export function useFoodData() {
  const spots = ref<Spot[]>(spotsData as unknown as Spot[])
  const dishes = ref<Dish[]>(dishesData as Dish[])
  const routes = ref<RouteDay[]>(routesData as RouteDay[])
  const tips = ref(tipsData)

  /** 当前激活的分类筛选 */
  const activeCategories = ref<Set<CategoryId>>(
    new Set(Object.keys(CATEGORIES) as CategoryId[])
  )

  /** 搜索关键词 */
  const searchQuery = ref('')

  /** 切换分类 */
  function toggleCategory(catId: CategoryId) {
    const s = new Set(activeCategories.value)
    if (s.has(catId)) {
      s.delete(catId)
    } else {
      s.add(catId)
    }
    activeCategories.value = s
  }

  /** 筛选后的店铺列表 */
  const filteredSpots = computed(() => {
    let result = spots.value.filter(s => activeCategories.value.has(s.category))

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.trim().toLowerCase()
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q) ||
        s.dishes.some(d => d.toLowerCase().includes(q)) ||
        s.tags.some(t => t.toLowerCase().includes(q))
      )
    }

    return result
  })

  /** 按分类分组 */
  const groupedSpots = computed(() => {
    const groups: Partial<Record<CategoryId, Spot[]>> = {}
    for (const spot of filteredSpots.value) {
      if (!groups[spot.category]) groups[spot.category] = []
      groups[spot.category]!.push(spot)
    }
    return groups
  })

  return {
    spots,
    dishes,
    routes,
    tips,
    categories: CATEGORIES,
    activeCategories,
    searchQuery,
    filteredSpots,
    groupedSpots,
    toggleCategory,
  }
}

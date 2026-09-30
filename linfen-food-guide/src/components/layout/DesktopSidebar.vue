<script setup lang="ts">
/**
 * 桌面端侧边栏
 * - 显示筛选后的店铺列表，按分类分组
 * - 支持滚动浏览
 */
import FoodCard from '@/components/food/FoodCard.vue'
import type { Spot } from '@/types/spot'
import type { CategoryId, Category } from '@/types/category'

const props = defineProps<{
  spots: Spot[]
  groupedSpots: Partial<Record<CategoryId, Spot[]>>
  categories: Record<CategoryId, Category>
}>()

const emit = defineEmits<{
  spotSelect: [spotId: string]
}>()

/** 获取店铺在列表中的序号 */
function getSpotIndex(spotId: string): number {
  return props.spots.findIndex(s => s.id === spotId)
}

/** 安全获取分类信息 */
function getCat(catId: string) {
  return props.categories[catId as CategoryId]
}
</script>

<template>
  <aside class="w-[380px] flex-shrink-0 overflow-y-auto scrollbar-hide space-y-4 pr-1">
    <p class="text-xs text-text-muted px-1">
      共 {{ spots.length }} 个点位
    </p>

    <template v-for="(groupSpots, catId) in groupedSpots" :key="catId">
      <div>
        <h3 class="flex items-center gap-2 text-sm font-bold text-text mb-2 px-1">
          <span
            class="w-2.5 h-2.5 rounded-full"
            :style="{ backgroundColor: getCat(catId).color }"
          ></span>
          {{ getCat(catId).name }}
          <span class="text-xs font-normal text-text-muted">{{ groupSpots!.length }}处</span>
        </h3>
        <div class="space-y-2">
          <FoodCard
            v-for="spot in groupSpots"
            :key="spot.id"
            :spot="spot"
            :category="getCat(catId)"
            :index="getSpotIndex(spot.id)"
            @select="emit('spotSelect', spot.id)"
          />
        </div>
      </div>
    </template>
  </aside>
</template>

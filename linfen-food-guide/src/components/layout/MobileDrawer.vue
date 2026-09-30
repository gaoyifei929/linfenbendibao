<script setup lang="ts">
/**
 * 移动端底部可拖拽抽屉
 * - 收起状态：显示选中店铺预览或提示文案
 * - 展开状态：显示完整店铺列表
 */
import { ref, computed } from 'vue'
import FoodCard from '@/components/food/FoodCard.vue'
import NavButton from '@/components/common/NavButton.vue'
import { toGcj } from '@/utils/coordTransform'
import type { Spot } from '@/types/spot'
import type { CategoryId, Category } from '@/types/category'

const props = defineProps<{
  spots: Spot[]
  groupedSpots: Partial<Record<CategoryId, Spot[]>>
  categories: Record<CategoryId, Category>
  selectedSpotId: string | null
}>()

const emit = defineEmits<{
  spotSelect: [spotId: string]
}>()

const expanded = ref(false)

/** 当前选中的店铺 */
const selectedSpot = computed(() =>
  props.spots.find(s => s.id === props.selectedSpotId)
)

/** 获取店铺在列表中的序号 */
function getSpotIndex(spotId: string): number {
  return props.spots.findIndex(s => s.id === spotId)
}

/** 安全获取分类信息 */
function getCat(catId: string) {
  return props.categories[catId as CategoryId]
}

function toggle() {
  expanded.value = !expanded.value
}
</script>

<template>
  <div
    class="absolute bottom-0 left-0 right-0 bg-card border-t border-border rounded-t-2xl shadow-float transition-all duration-300 ease-out z-30"
    :class="expanded ? 'h-[60vh]' : 'h-[140px]'"
  >
    <!-- 拖拽把手 -->
    <div
      @click="toggle"
      class="flex justify-center pt-2 pb-1 cursor-pointer"
    >
      <div class="w-10 h-1 bg-border rounded-full"></div>
    </div>

    <!-- 抽屉内容 -->
    <div class="overflow-y-auto px-4 pb-4 h-[calc(100%-24px)]">
      <!-- 收起状态：显示选中店铺或提示 -->
      <template v-if="!expanded">
        <div v-if="selectedSpot" class="pt-1">
          <h3 class="text-[15px] font-bold text-text mb-1">{{ selectedSpot.name }}</h3>
          <p class="text-xs text-text-muted mb-2">📍 {{ selectedSpot.address }}</p>
          <div class="flex gap-2">
            <NavButton
              :lat="toGcj(selectedSpot.coords[0], selectedSpot.coords[1], selectedSpot.coordSystem)[0]"
              :lng="toGcj(selectedSpot.coords[0], selectedSpot.coords[1], selectedSpot.coordSystem)[1]"
              :name="selectedSpot.name"
              compact
            />
            <button
              @click="expanded = true"
              class="px-3 py-1.5 text-xs text-primary border border-primary/30 rounded-xl hover:bg-primary/5 transition-colors"
            >
              查看详情
            </button>
          </div>
        </div>
        <div v-else class="pt-2 text-center text-sm text-text-muted">
          👆 点击地图标记查看店铺详情<br>
          <span class="text-xs">上拉展开完整列表</span>
        </div>
      </template>

      <!-- 展开状态：完整列表 -->
      <template v-else>
        <p class="text-xs text-text-muted mb-3">
          共 {{ spots.length }} 个点位 · 点击收起
        </p>

        <template v-for="(groupSpots, catId) in groupedSpots" :key="catId">
          <div class="mb-4">
            <h3 class="flex items-center gap-2 text-sm font-bold text-text mb-2">
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
      </template>
    </div>
  </div>
</template>

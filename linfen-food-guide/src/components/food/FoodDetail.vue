<script setup lang="ts">
/**
 * 店铺详情组件
 * - 弹窗/页面模式展示完整店铺信息
 * - 整合地图 popup 信息并扩展
 */
import type { Spot } from '@/types/spot'
import type { Category } from '@/types/category'
import NavButton from '@/components/common/NavButton.vue'
import TagChip from '@/components/common/TagChip.vue'
import { toGcj } from '@/utils/coordTransform'

const props = defineProps<{
  spot: Spot
  category: Category
}>()

defineEmits<{
  close: []
}>()

/** GCJ-02 坐标（用于导航） */
const gcjCoords = toGcj(props.spot.coords[0], props.spot.coords[1], props.spot.coordSystem)
</script>

<template>
  <div class="bg-card rounded-2xl overflow-hidden shadow-float max-w-md mx-auto">
    <!-- 头部：分类色带 + 关闭按钮 -->
    <div
      class="px-5 py-4 text-white relative"
      :style="{ backgroundColor: category.color }"
    >
      <span class="text-xs opacity-80">{{ category.emoji }} {{ category.name }}</span>
      <h2 class="text-xl font-bold mt-1">{{ spot.name }}</h2>

      <button
        @click="$emit('close')"
        class="absolute top-3 right-3 w-7 h-7 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
      >
        ✕
      </button>
    </div>

    <!-- 内容区 -->
    <div class="p-5 space-y-4">
      <!-- 地址 -->
      <div class="flex items-start gap-2 text-sm">
        <span class="text-text-muted flex-shrink-0">📍</span>
        <span class="text-text">{{ spot.address }}</span>
      </div>

      <!-- 推荐菜品 -->
      <div v-if="spot.dishes.length" class="flex items-start gap-2 text-sm">
        <span class="text-text-muted flex-shrink-0">🍴</span>
        <div class="flex flex-wrap gap-1">
          <span
            v-for="dish in spot.dishes"
            :key="dish"
            class="bg-[#FFF5E6] text-[#8A6D3B] text-xs px-2 py-0.5 rounded"
          >
            {{ dish }}
          </span>
        </div>
      </div>

      <!-- 价格范围 -->
      <div v-if="spot.priceRange" class="flex items-center gap-2 text-sm">
        <span class="text-text-muted flex-shrink-0">💰</span>
        <span class="text-primary font-medium">{{ spot.priceRange }}</span>
      </div>

      <!-- 备注 -->
      <div
        v-if="spot.note"
        class="bg-[#fdf9ef] border-l-4 border-secondary rounded-r-lg p-3 text-sm text-[#665500] leading-relaxed"
      >
        💡 {{ spot.note }}
      </div>

      <!-- 标签 -->
      <div v-if="spot.tags.length" class="flex flex-wrap gap-1.5">
        <TagChip v-for="tag in spot.tags" :key="tag" :label="tag" />
      </div>

      <!-- 状态标识 -->
      <div class="flex items-center gap-2 text-xs text-text-muted">
        <span
          class="w-2 h-2 rounded-full"
          :class="{
            'bg-green-500': spot.status === 'open',
            'bg-red-500': spot.status === 'closed',
            'bg-yellow-500': spot.status === 'unverified',
          }"
        ></span>
        <span>
          {{ spot.status === 'open' ? '营业中' : spot.status === 'closed' ? '已关闭' : '待验证' }}
          · 数据更新于 {{ spot.verifiedAt }}
        </span>
      </div>

      <!-- 导航按钮 -->
      <div class="pt-2">
        <NavButton
          :lat="gcjCoords[0]"
          :lng="gcjCoords[1]"
          :name="spot.name"
        />
      </div>
    </div>
  </div>
</template>

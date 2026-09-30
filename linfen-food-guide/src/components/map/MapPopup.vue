<script setup lang="ts">
/**
 * 地图弹窗内容组件
 * - 展示店铺基本信息、推荐菜品、备注、价格
 * - 提供高德导航按钮
 */
import type { Spot } from '@/types/spot'
import type { Category } from '@/types/category'

defineProps<{
  spot: Spot
  category: Category
  navUrl: string
}>()
</script>

<template>
  <div class="font-sans p-3">
    <!-- 店铺名称 -->
    <div class="text-[15px] font-bold mb-1">{{ spot.name }}</div>

    <!-- 分类标签 -->
    <span
      class="inline-block text-[11px] text-white rounded px-1.5 py-0.5 mb-1.5"
      :style="{ backgroundColor: category.color }"
    >
      {{ category.name }}
    </span>

    <!-- 地址 -->
    <div class="text-xs text-gray-500 mb-1">📍 {{ spot.address }}</div>

    <!-- 推荐菜品 -->
    <div v-if="spot.dishes.length" class="text-xs mb-1">
      🍴 {{ spot.dishes.join(' · ') }}
    </div>

    <!-- 备注 -->
    <div
      v-if="spot.note"
      class="text-xs text-[#996600] bg-[#fdf9ef] rounded-md p-1.5 my-1.5 leading-relaxed"
    >
      {{ spot.note }}
    </div>

    <!-- 价格范围 -->
    <div v-if="spot.priceRange" class="text-xs text-primary font-medium mb-1.5">
      💰 {{ spot.priceRange }}
    </div>

    <!-- 导航按钮 -->
    <a
      :href="navUrl"
      target="_blank"
      rel="noopener"
      class="inline-block bg-[#0A7FF2] text-white no-underline rounded-md px-3.5 py-1 text-xs"
    >
      🧭 高德导航去这里
    </a>
  </div>
</template>

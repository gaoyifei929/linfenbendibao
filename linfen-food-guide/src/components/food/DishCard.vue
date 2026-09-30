<script setup lang="ts">
/**
 * 特色美食卡片
 * - 展示临汾街头常见美食
 * - 包含名称、描述、地域标签
 */
import type { Dish } from '@/types/dish'

defineProps<{
  dish: Dish
}>()
</script>

<template>
  <div class="border border-border rounded-xl p-3.5 bg-[#FFFDF9] card-hover">
    <h4 class="text-sm font-bold text-text flex items-center gap-1.5">
      <span class="text-lg">{{ dish.emoji }}</span>
      {{ dish.name }}
    </h4>
    <p class="text-xs text-text-muted leading-relaxed mt-1.5">{{ dish.description }}</p>
    <span class="inline-block mt-2 text-[11px] bg-[#F4EBDD] text-[#8A6D3B] rounded-md px-2 py-0.5">
      {{ dish.region }}
    </span>
  </div>
</template>

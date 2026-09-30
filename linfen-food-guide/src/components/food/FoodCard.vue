<script setup lang="ts">
import type { Spot } from '@/types/spot'
import type { Category } from '@/types/category'
import TagChip from '@/components/common/TagChip.vue'

defineProps<{
  spot: Spot
  category: Category
  index?: number
}>()

const emit = defineEmits<{
  select: []
}>()
</script>

<template>
  <div
    @click="emit('select')"
    class="group relative p-3.5 bg-card border border-border rounded-2xl cursor-pointer card-hover"
  >
    <!-- 序号标记 -->
    <div
      v-if="index !== undefined"
      class="absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm z-10"
      :style="{ backgroundColor: category.color }"
    >
      {{ index + 1 }}
    </div>

    <!-- 店名 -->
    <div class="flex items-start justify-between gap-2 mb-1.5">
      <h3 class="text-[15px] font-bold text-text leading-snug group-hover:text-primary transition-colors">
        {{ spot.name }}
      </h3>
    </div>

    <!-- 标签 -->
    <div class="flex flex-wrap gap-1 mb-2">
      <TagChip
        v-for="tag in spot.tags.slice(0, 3)"
        :key="tag"
        :label="tag"
        variant="highlight"
      />
    </div>

    <!-- 地址 & 价格 -->
    <div class="text-xs text-text-muted leading-relaxed">
      <p>📍 {{ spot.address }}</p>
      <p v-if="spot.priceRange" class="mt-0.5 text-primary font-medium">{{ spot.priceRange }}</p>
    </div>

    <!-- 推荐语（桌面端hover显示） -->
    <p class="hidden md:block mt-2 text-xs text-text-muted leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity">
      {{ spot.note }}
    </p>
  </div>
</template>

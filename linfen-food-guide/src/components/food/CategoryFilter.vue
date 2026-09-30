<script setup lang="ts">
import type { CategoryId, Category } from '@/types/category'

defineProps<{
  categories: Record<CategoryId, Category>
  activeCategories: Set<CategoryId>
}>()

const emit = defineEmits<{
  toggle: [catId: CategoryId]
}>()
</script>

<template>
  <div class="flex gap-2 overflow-x-auto scrollbar-hide py-1">
    <button
      v-for="(cat, id) in categories"
      :key="id"
      @click="emit('toggle', id)"
      class="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-sm font-medium transition-all select-none"
      :class="activeCategories.has(id)
        ? 'border-transparent text-white shadow-sm'
        : 'border-border bg-card text-text-muted hover:border-text-light'"
      :style="activeCategories.has(id) ? { backgroundColor: cat.color } : {}"
    >
      <span>{{ cat.emoji }}</span>
      <span>{{ cat.name }}</span>
    </button>
  </div>
</template>

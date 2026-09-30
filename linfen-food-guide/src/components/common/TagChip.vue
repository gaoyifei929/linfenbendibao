<script setup lang="ts">
defineProps<{
  label: string
  variant?: 'default' | 'highlight' | 'category'
  color?: string
}>()
</script>

<template>
  <span
    class="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-lg whitespace-nowrap"
    :class="{
      'bg-[#F5F0EA] text-text-muted': variant === 'default' || !variant,
      'bg-primary/10 text-primary': variant === 'highlight',
    }"
    :style="variant === 'category' && color ? { backgroundColor: color + '18', color } : {}"
  >
    {{ label }}
  </span>
</template>

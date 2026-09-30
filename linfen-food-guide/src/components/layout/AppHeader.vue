<script setup lang="ts">
defineProps<{
  subtitle?: string
}>()
</script>

<template>
  <header class="sticky top-0 z-50 bg-gradient-to-r from-primary to-primary-dark text-white shadow-md">
    <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
      <div>
        <h1 class="text-lg font-bold tracking-wide flex items-center gap-2">
          🍜 临汾吃啥
        </h1>
        <p v-if="subtitle" class="text-xs opacity-90 mt-0.5">{{ subtitle }}</p>
      </div>
      <div class="text-right hidden sm:block">
        <p class="text-xs opacity-80">本地人的私藏觅食指南</p>
        <p class="text-[10px] opacity-60">到了临汾咱是回家</p>
      </div>
    </div>
  </header>
</template>

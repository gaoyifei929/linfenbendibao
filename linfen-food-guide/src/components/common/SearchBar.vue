<script setup lang="ts">
const model = defineModel<string>({ default: '' })
</script>

<template>
  <div class="relative">
    <input
      v-model="model"
      type="text"
      placeholder="搜店名、菜品、地址..."
      class="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-text placeholder:text-text-light focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
    />
    <svg
      class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <!-- 清除按钮 -->
    <button
      v-if="model"
      @click="model = ''"
      class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-border text-text-muted hover:bg-text-light hover:text-white transition-colors"
    >
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>

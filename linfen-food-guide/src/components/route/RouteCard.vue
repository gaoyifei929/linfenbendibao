<script setup lang="ts">
/**
 * 路线卡片
 * - 展示单日推荐路线
 * - 包含时间线步骤列表
 */
import type { RouteDay } from '@/types/route'

defineProps<{
  route: RouteDay
}>()
</script>

<template>
  <div class="border border-border rounded-xl overflow-hidden">
    <!-- 标题栏 -->
    <div
      class="px-4 py-2.5 text-white text-sm font-bold"
      :style="{ background: `linear-gradient(90deg, ${route.gradientFrom}, ${route.gradientTo})` }"
    >
      {{ route.title }} · {{ route.theme }}
    </div>

    <!-- 时间线步骤 -->
    <ol class="p-4 space-y-2">
      <li
        v-for="(step, i) in route.steps"
        :key="i"
        class="flex gap-3 text-sm leading-relaxed"
      >
        <span class="flex-shrink-0 w-10 text-xs font-bold text-primary pt-0.5">{{ step.time }}</span>
        <div>
          <span class="font-bold text-text">{{ step.title }}</span>
          <span class="text-text-muted"> — {{ step.description }}</span>
        </div>
      </li>
    </ol>
  </div>
</template>

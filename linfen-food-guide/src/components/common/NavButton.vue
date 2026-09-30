<script setup lang="ts">
import { getAmapNavUrl } from '@/utils/navigation'

const props = defineProps<{
  lat: number
  lng: number
  name: string
  compact?: boolean
}>()

const navUrl = getAmapNavUrl(props.lat, props.lng, props.name)
</script>

<template>
  <a
    :href="navUrl"
    target="_blank"
    rel="noopener noreferrer"
    class="inline-flex items-center gap-1.5 bg-[#0A7FF2] hover:bg-[#0868C6] text-white rounded-xl transition-colors"
    :class="compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'"
  >
    <span>🧭</span>
    <span>{{ compact ? '导航' : '高德导航去这里' }}</span>
  </a>
</template>

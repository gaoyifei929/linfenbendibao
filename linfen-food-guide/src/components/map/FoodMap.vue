<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Spot } from '@/types/spot'
import type { CategoryId, Category } from '@/types/category'
import { toGcj } from '@/utils/coordTransform'
import { getAmapNavUrl } from '@/utils/navigation'

const props = defineProps<{
  spots: Spot[]
  categories: Record<CategoryId, Category>
  activeCategories: Set<CategoryId>
  selectedSpotId?: string | null
}>()

const emit = defineEmits<{
  spotSelect: [spotId: string]
}>()

const mapContainer = ref<HTMLDivElement>()
let map: L.Map | null = null
let markers: Map<string, L.Marker> = new Map()
let layerGroups: Map<CategoryId, L.LayerGroup> = new Map()

// 城市中心
const CITY_CENTER: [number, number] = [36.0835, 111.5230]

onMounted(() => {
  if (!mapContainer.value) return

  map = L.map(mapContainer.value, { zoomControl: false }).setView(CITY_CENTER, 14)

  // 高德瓦片
  L.tileLayer(
    'https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
    { subdomains: ['1', '2', '3', '4'], maxZoom: 18, attribution: '&copy; 高德地图' }
  ).addTo(map)

  // 缩放控件放右下
  L.control.zoom({ position: 'bottomright' }).addTo(map)

  renderMarkers()
})

watch(() => props.activeCategories, () => {
  if (!map) return
  layerGroups.forEach((group, catId) => {
    if (props.activeCategories.has(catId)) {
      map!.addLayer(group)
    } else {
      map!.removeLayer(group)
    }
  })
}, { deep: true })

watch(() => props.selectedSpotId, (id) => {
  if (id && markers.has(id)) {
    const marker = markers.get(id)!
    map?.flyTo(marker.getLatLng(), 16, { duration: 0.8 })
    setTimeout(() => marker.openPopup(), 850)
  }
})

function renderMarkers() {
  if (!map) return

  // 清除旧标记
  layerGroups.forEach(g => g.clearLayers())
  layerGroups.clear()
  markers.clear()

  // 创建分类图层
  for (const catId of Object.keys(props.categories) as CategoryId[]) {
    layerGroups.set(catId, L.layerGroup().addTo(map))
  }

  props.spots.forEach((spot) => {
    const [lat, lng] = toGcj(spot.coords[0], spot.coords[1], spot.coordSystem)
    const cat = props.categories[spot.category]

    // 自定义图标
    const isLandmark = spot.category === 'jd' || spot.category === 'cj'
    const iconHtml = isLandmark
      ? `<div style="width:22px;height:22px;border-radius:50%;background:${cat.color};border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;font-size:11px;color:#fff;">${spot.category === 'jd' ? '◆' : '★'}</div>`
      : `<div style="width:26px;height:26px;border-radius:50% 50% 50% 0;background:${cat.color};transform:rotate(-45deg);border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;"><span style="transform:rotate(45deg);color:#fff;font-size:12px;font-weight:700;">${spot.id.split('-')[1]?.replace(/^0/, '') || ''}</span></div>`

    const icon = L.divIcon({
      className: '',
      html: iconHtml,
      iconSize: isLandmark ? [22, 22] : [26, 26],
      iconAnchor: isLandmark ? [11, 11] : [13, 26],
      popupAnchor: [0, -26],
    })

    // 弹窗内容
    const navUrl = getAmapNavUrl(lat, lng, spot.name)
    const popupHtml = `
      <div style="font-family:'PingFang SC','Microsoft YaHei',sans-serif;padding:12px;">
        <div style="font-size:15px;font-weight:700;margin-bottom:4px;">${spot.name}</div>
        <span style="display:inline-block;font-size:11px;color:#fff;background:${cat.color};border-radius:4px;padding:1px 7px;margin-bottom:6px;">${cat.name}</span>
        <div style="font-size:12px;color:#666;margin-bottom:4px;">📍 ${spot.address}</div>
        ${spot.dishes.length ? `<div style="font-size:12px;margin-bottom:4px;">🍴 ${spot.dishes.join(' · ')}</div>` : ''}
        ${spot.note ? `<div style="font-size:12px;color:#996;background:#fdf9ef;border-radius:6px;padding:6px 8px;margin:6px 0;line-height:1.5;">${spot.note}</div>` : ''}
        ${spot.priceRange ? `<div style="font-size:12px;color:#D94F3D;font-weight:500;margin-bottom:6px;">💰 ${spot.priceRange}</div>` : ''}
        <a href="${navUrl}" target="_blank" rel="noopener" style="display:inline-block;background:#0A7FF2;color:#fff;text-decoration:none;border-radius:6px;padding:5px 14px;font-size:12px;">🧭 高德导航去这里</a>
      </div>
    `

    const marker = L.marker([lat, lng], { icon, riseOnHover: true })
      .bindPopup(popupHtml, { maxWidth: 300 })
      .on('click', () => emit('spotSelect', spot.id))

    const group = layerGroups.get(spot.category)
    if (group) marker.addTo(group)
    markers.set(spot.id, marker)
  })
}

/** 回到市中心 */
function zoomCity() {
  map?.flyTo(CITY_CENTER, 14, { duration: 0.8 })
}

/** 显示全部点位 */
function zoomAll() {
  if (!map) return
  const bounds = L.latLngBounds(
    props.spots.map(s => {
      const [lat, lng] = toGcj(s.coords[0], s.coords[1], s.coordSystem)
      return [lat, lng] as [number, number]
    })
  )
  map.flyToBounds(bounds.pad(0.08), { duration: 1 })
}

defineExpose({ zoomCity, zoomAll })
</script>

<template>
  <div ref="mapContainer" class="w-full h-full rounded-2xl overflow-hidden border border-border"></div>
</template>

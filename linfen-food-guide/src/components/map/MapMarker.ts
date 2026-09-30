/**
 * 地图标记点图标生成器
 * - 根据分类生成不同样式的 divIcon
 * - 地标/景点使用圆形，美食使用水滴形
 */
import L from 'leaflet'
import type { Category } from '@/types/category'

export interface MarkerIconOptions {
  categoryId: string
  category: Category
  spotId: string
}

/** 生成自定义标记图标 */
export function createMarkerIcon(options: MarkerIconOptions): L.DivIcon {
  const { categoryId, category, spotId } = options
  const isLandmark = categoryId === 'jd' || categoryId === 'cj'

  const iconHtml = isLandmark
    ? `<div style="width:22px;height:22px;border-radius:50%;background:${category.color};border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;font-size:11px;color:#fff;">${categoryId === 'jd' ? '◆' : '★'}</div>`
    : `<div style="width:26px;height:26px;border-radius:50% 50% 50% 0;background:${category.color};transform:rotate(-45deg);border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;"><span style="transform:rotate(45deg);color:#fff;font-size:12px;font-weight:700;">${spotId.split('-')[1]?.replace(/^0/, '') || ''}</span></div>`

  return L.divIcon({
    className: '',
    html: iconHtml,
    iconSize: isLandmark ? [22, 22] : [26, 26],
    iconAnchor: isLandmark ? [11, 11] : [13, 26],
    popupAnchor: [0, -26],
  })
}

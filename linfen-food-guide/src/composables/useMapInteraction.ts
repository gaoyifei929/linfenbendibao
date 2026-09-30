import L from 'leaflet'
import type { Spot } from '@/types/spot'
import { toGcj } from '@/utils/coordTransform'

/**
 * 地图交互逻辑
 * - flyToSpot: 飞向指定店铺并打开弹窗
 * - zoomCity: 回到城市中心
 * - zoomAll: 显示全部点位范围
 * - calculateBounds: 计算点位边界
 */

const CITY_CENTER: [number, number] = [36.0835, 111.5230]

export interface MapInteractionOptions {
  map: L.Map | null
  markers: Map<string, L.Marker>
}

export function useMapInteraction(options: MapInteractionOptions) {
  /** 飞向指定店铺并打开弹窗 */
  function flyToSpot(spotId: string) {
    const { map, markers } = options
    if (!map || !markers.has(spotId)) return

    const marker = markers.get(spotId)!
    map.flyTo(marker.getLatLng(), 16, { duration: 0.8 })
    setTimeout(() => marker.openPopup(), 850)
  }

  /** 回到城市中心 */
  function zoomCity() {
    options.map?.flyTo(CITY_CENTER, 14, { duration: 0.8 })
  }

  /** 显示全部点位 */
  function zoomAll(spots: Spot[]) {
    const { map } = options
    if (!map) return

    const bounds = calculateBounds(spots)
    map.flyToBounds(bounds.pad(0.08), { duration: 1 })
  }

  return {
    flyToSpot,
    zoomCity,
    zoomAll,
    CITY_CENTER,
  }
}

/** 计算点位的 LatLngBounds */
export function calculateBounds(spots: Spot[]): L.LatLngBounds {
  return L.latLngBounds(
    spots.map(s => {
      const [lat, lng] = toGcj(s.coords[0], s.coords[1], s.coordSystem)
      return [lat, lng] as [number, number]
    })
  )
}

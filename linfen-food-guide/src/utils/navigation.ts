/**
 * 生成多平台导航链接
 */

export function getAmapNavUrl(lat: number, lng: number, name: string): string {
  return `https://uri.amap.com/marker?position=${lng.toFixed(6)},${lat.toFixed(6)}&name=${encodeURIComponent(name)}&src=linfen-foodguide&coordinate=gaode&callnative=1`
}

export function getBaiduNavUrl(lat: number, lng: number, name: string): string {
  // 百度地图使用 BD-09 坐标，这里简化处理直接用 GCJ-02（会有几百米偏移）
  // 生产环境应加 gcj2bd 转换
  return `https://api.map.baidu.com/marker?location=${lat},${lng}&title=${encodeURIComponent(name)}&output=html&src=linfen-foodguide`
}

export function getAppleMapsUrl(lat: number, lng: number, name: string): string {
  return `https://maps.apple.com/?q=${encodeURIComponent(name)}&ll=${lat},${lng}`
}

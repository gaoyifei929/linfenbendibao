/**
 * WGS-84 → GCJ-02 坐标转换
 * 用于将 GPS/OSM 坐标转为高德地图坐标系
 */

const A = 6378245.0
const EE = 0.00669342162296594323

function transformLat(x: number, y: number): number {
  let r = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x))
  r += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0
  r += (20.0 * Math.sin(y * Math.PI) + 40.0 * Math.sin(y / 3.0 * Math.PI)) * 2.0 / 3.0
  r += (160.0 * Math.sin(y / 12.0 * Math.PI) + 320 * Math.sin(y * Math.PI / 30.0)) * 2.0 / 3.0
  return r
}

function transformLng(x: number, y: number): number {
  let r = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x))
  r += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0
  r += (20.0 * Math.sin(x * Math.PI) + 40.0 * Math.sin(x / 3.0 * Math.PI)) * 2.0 / 3.0
  r += (150.0 * Math.sin(x / 12.0 * Math.PI) + 300.0 * Math.sin(x / 30.0 * Math.PI)) * 2.0 / 3.0
  return r
}

export function wgs2gcj(lat: number, lng: number): [number, number] {
  const dLat = transformLat(lng - 105.0, lat - 35.0)
  const dLng = transformLng(lng - 105.0, lat - 35.0)
  const radLat = lat / 180.0 * Math.PI
  let magic = Math.sin(radLat)
  magic = 1 - EE * magic * magic
  const sm = Math.sqrt(magic)
  const finalDLat = (dLat * 180.0) / ((A * (1 - EE)) / (magic * sm) * Math.PI)
  const finalDLng = (dLng * 180.0) / (A / sm * Math.cos(radLat) * Math.PI)
  return [lat + finalDLat, lng + finalDLng]
}

/** 确保坐标为 GCJ-02 系统 */
export function toGcj(lat: number, lng: number, system: 'gcj' | 'wgs'): [number, number] {
  if (system === 'wgs') {
    return wgs2gcj(lat, lng)
  }
  return [lat, lng]
}

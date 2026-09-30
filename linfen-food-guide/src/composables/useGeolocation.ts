import { ref, onUnmounted } from 'vue'

/**
 * 用户定位 composable
 * - position: 当前位置 [lat, lng] 或 null
 * - error: 错误信息
 * - loading: 是否正在获取
 * - requestLocation: 手动请求定位
 */
export function useGeolocation() {
  const position = ref<[number, number] | null>(null)
  const error = ref<string | null>(null)
  const loading = ref(false)

  let watchId: number | null = null

  /** 请求用户位置 */
  function requestLocation() {
    if (!navigator.geolocation) {
      error.value = '浏览器不支持定位'
      return
    }

    loading.value = true
    error.value = null

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        position.value = [pos.coords.latitude, pos.coords.longitude]
        loading.value = false
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            error.value = '定位权限被拒绝'
            break
          case err.POSITION_UNAVAILABLE:
            error.value = '无法获取位置信息'
            break
          case err.TIMEOUT:
            error.value = '定位超时'
            break
          default:
            error.value = '定位失败'
        }
        loading.value = false
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    )
  }

  /** 开始持续监听位置变化 */
  function startWatching() {
    if (!navigator.geolocation) return

    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        position.value = [pos.coords.latitude, pos.coords.longitude]
      },
      () => {
        // 静默处理监听错误
      },
      {
        enableHighAccuracy: true,
        maximumAge: 30000,
      }
    )
  }

  /** 停止监听 */
  function stopWatching() {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      watchId = null
    }
  }

  onUnmounted(() => {
    stopWatching()
  })

  return {
    position,
    error,
    loading,
    requestLocation,
    startWatching,
    stopWatching,
  }
}

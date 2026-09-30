import { ref } from 'vue'

/**
 * 移动端底部抽屉状态管理
 * - expanded: 是否展开
 * - toggle/expand/collapse: 控制方法
 */
export function useDrawer(initialExpanded = false) {
  const expanded = ref(initialExpanded)

  function toggle() {
    expanded.value = !expanded.value
  }

  function expand() {
    expanded.value = true
  }

  function collapse() {
    expanded.value = false
  }

  return {
    expanded,
    toggle,
    expand,
    collapse,
  }
}

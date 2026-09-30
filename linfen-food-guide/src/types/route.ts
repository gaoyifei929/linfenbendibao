/** 路线中的单步 */
export interface RouteStep {
  time: string
  title: string
  description: string
}

/** 推荐路线的一天 */
export interface RouteDay {
  day: number
  title: string
  theme: string
  gradientFrom: string
  gradientTo: string
  steps: RouteStep[]
}

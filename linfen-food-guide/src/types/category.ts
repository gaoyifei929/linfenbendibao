/** 分类 ID */
export type CategoryId = 'wz' | 'xc' | 'yt' | 'jd' | 'cj'

/** 分类定义 */
export interface Category {
  id: CategoryId
  name: string
  color: string
  emoji: string
}

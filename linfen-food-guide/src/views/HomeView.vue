<script setup lang="ts">
import { ref } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import SearchBar from '@/components/common/SearchBar.vue'
import CategoryFilter from '@/components/food/CategoryFilter.vue'
import FoodCard from '@/components/food/FoodCard.vue'
import FoodMap from '@/components/map/FoodMap.vue'
import NavButton from '@/components/common/NavButton.vue'
import { useFoodData } from '@/composables/useFoodData'
import { toGcj } from '@/utils/coordTransform'
import type { Spot } from '@/types/spot'
import type { CategoryId } from '@/types/category'

const {
  dishes,
  routes,
  tips,
  categories,
  activeCategories,
  searchQuery,
  filteredSpots,
  groupedSpots,
  toggleCategory,
} = useFoodData()

const selectedSpotId = ref<string | null>(null)

// 移动端底部抽屉状态
const drawerExpanded = ref(false)

function onSpotSelect(spotId: string) {
  selectedSpotId.value = spotId
  if (window.innerWidth < 768) {
    drawerExpanded.value = true
  }
}

function getSelectedSpot(): Spot | undefined {
  return filteredSpots.value.find(s => s.id === selectedSpotId.value)
}

/** 获取店铺在列表中的序号（用于地图标记） */
function getSpotIndex(spotId: string): number {
  return filteredSpots.value.findIndex(s => s.id === spotId)
}

/** 安全获取分类信息 */
function getCat(catId: string) {
  return categories[catId as CategoryId]
}
</script>

<template>
  <div class="min-h-screen bg-bg flex flex-col">
    <!-- Header -->
    <AppHeader subtitle="本地人的私藏觅食指南" />

    <!-- 搜索 + 筛选栏 -->
    <div class="sticky top-[52px] z-40 bg-bg/95 backdrop-blur-sm border-b border-border px-4 py-2.5 space-y-2">
      <SearchBar v-model="searchQuery" />
      <CategoryFilter
        :categories="categories"
        :active-categories="activeCategories"
        @toggle="toggleCategory"
      />
    </div>

    <!-- 主体区域 -->
    <div class="flex-1 relative max-w-7xl mx-auto w-full">
      <!-- 桌面端布局 -->
      <div class="hidden md:flex gap-4 p-4 h-[calc(100vh-130px)]">
        <!-- 左侧列表 -->
        <aside class="w-[380px] flex-shrink-0 overflow-y-auto scrollbar-hide space-y-4 pr-1">
          <p class="text-xs text-text-muted px-1">
            共 {{ filteredSpots.length }} 个点位
          </p>

          <template v-for="(spots, catId) in groupedSpots" :key="catId">
            <div>
              <h3 class="flex items-center gap-2 text-sm font-bold text-text mb-2 px-1">
                <span
                  class="w-2.5 h-2.5 rounded-full"
                  :style="{ backgroundColor: getCat(catId).color }"
                ></span>
                {{ getCat(catId).name }}
                <span class="text-xs font-normal text-text-muted">{{ spots!.length }}处</span>
              </h3>
              <div class="space-y-2">
                <FoodCard
                  v-for="spot in spots"
                  :key="spot.id"
                  :spot="spot"
                  :category="getCat(catId)"
                  :index="getSpotIndex(spot.id)"
                  @select="onSpotSelect(spot.id)"
                />
              </div>
            </div>
          </template>
        </aside>

        <!-- 右侧地图 -->
        <div class="flex-1 min-h-0">
          <FoodMap
            :spots="filteredSpots"
            :categories="categories"
            :active-categories="activeCategories"
            :selected-spot-id="selectedSpotId"
            @spot-select="onSpotSelect"
            class="h-full"
          />
        </div>
      </div>

      <!-- 移动端布局 -->
      <div class="md:hidden relative h-[calc(100vh-130px)]">
        <!-- 全屏地图 -->
        <FoodMap
          :spots="filteredSpots"
          :categories="categories"
          :active-categories="activeCategories"
          :selected-spot-id="selectedSpotId"
          @spot-select="onSpotSelect"
          class="absolute inset-0"
        />

        <!-- 底部可拖拽抽屉 -->
        <div
          class="absolute bottom-0 left-0 right-0 bg-card border-t border-border rounded-t-2xl shadow-float transition-all duration-300 ease-out z-30"
          :class="drawerExpanded ? 'h-[60vh]' : 'h-[140px]'"
        >
          <!-- 拖拽把手 -->
          <div
            @click="drawerExpanded = !drawerExpanded"
            class="flex justify-center pt-2 pb-1 cursor-pointer"
          >
            <div class="w-10 h-1 bg-border rounded-full"></div>
          </div>

          <!-- 抽屉内容 -->
          <div class="overflow-y-auto px-4 pb-4" :class="drawerExpanded ? 'h-[calc(100%-24px)]' : 'h-[calc(100%-24px)]'">
            <!-- 收起状态：显示选中店铺或提示 -->
            <template v-if="!drawerExpanded">
              <div v-if="getSelectedSpot()" class="pt-1">
                <h3 class="text-[15px] font-bold text-text mb-1">{{ getSelectedSpot()!.name }}</h3>
                <p class="text-xs text-text-muted mb-2">📍 {{ getSelectedSpot()!.address }}</p>
                <div class="flex gap-2">
                  <NavButton
                    :lat="toGcj(getSelectedSpot()!.coords[0], getSelectedSpot()!.coords[1], getSelectedSpot()!.coordSystem)[0]"
                    :lng="toGcj(getSelectedSpot()!.coords[0], getSelectedSpot()!.coords[1], getSelectedSpot()!.coordSystem)[1]"
                    :name="getSelectedSpot()!.name"
                    compact
                  />
                  <button
                    @click="drawerExpanded = true"
                    class="px-3 py-1.5 text-xs text-primary border border-primary/30 rounded-xl hover:bg-primary/5 transition-colors"
                  >
                    查看详情
                  </button>
                </div>
              </div>
              <div v-else class="pt-2 text-center text-sm text-text-muted">
                👆 点击地图标记查看店铺详情<br>
                <span class="text-xs">上拉展开完整列表</span>
              </div>
            </template>

            <!-- 展开状态：完整列表 -->
            <template v-else>
              <p class="text-xs text-text-muted mb-3">
                共 {{ filteredSpots.length }} 个点位 · 点击收起
              </p>

              <template v-for="(spots, catId) in groupedSpots" :key="catId">
                <div class="mb-4">
                  <h3 class="flex items-center gap-2 text-sm font-bold text-text mb-2">
                    <span
                      class="w-2.5 h-2.5 rounded-full"
                      :style="{ backgroundColor: getCat(catId).color }"
                    ></span>
                    {{ getCat(catId).name }}
                    <span class="text-xs font-normal text-text-muted">{{ spots!.length }}处</span>
                  </h3>
                  <div class="space-y-2">
                    <FoodCard
                      v-for="spot in spots"
                      :key="spot.id"
                      :spot="spot"
                      :category="getCat(catId)"
                      :index="getSpotIndex(spot.id)"
                      @select="onSpotSelect(spot.id)"
                    />
                  </div>
                </div>
              </template>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- 下方内容区：特色美食 / 路线 / 贴士 -->
    <div class="max-w-7xl mx-auto w-full px-4 py-8 space-y-8">

      <!-- 特色美食 -->
      <section class="bg-card border border-border rounded-2xl p-5 shadow-card">
        <h2 class="text-lg font-bold text-text mb-1 flex items-center gap-2">
          🥡 街头随处可见的临汾特色
        </h2>
        <p class="text-xs text-text-muted mb-4">没有唯一"名店"，逛街时看到就可以来一份</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          <div
            v-for="dish in dishes"
            :key="dish.id"
            class="border border-border rounded-xl p-3.5 bg-[#FFFDF9] card-hover"
          >
            <h4 class="text-sm font-bold text-text flex items-center gap-1.5">
              <span class="text-lg">{{ dish.emoji }}</span>
              {{ dish.name }}
            </h4>
            <p class="text-xs text-text-muted leading-relaxed mt-1.5">{{ dish.description }}</p>
            <span class="inline-block mt-2 text-[11px] bg-[#F4EBDD] text-[#8A6D3B] rounded-md px-2 py-0.5">
              {{ dish.region }}
            </span>
          </div>
        </div>
      </section>

      <!-- 推荐路线 -->
      <section class="bg-card border border-border rounded-2xl p-5 shadow-card">
        <h2 class="text-lg font-bold text-text mb-1 flex items-center gap-2">
          🗺️ 两天一夜 · 48小时参考路线
        </h2>
        <p class="text-xs text-text-muted mb-4">按点位就近串联，步行+共享单车为主；节假日热门店建议错峰</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="route in routes"
            :key="route.day"
            class="border border-border rounded-xl overflow-hidden"
          >
            <div
              class="px-4 py-2.5 text-white text-sm font-bold"
              :style="{ background: `linear-gradient(90deg, ${route.gradientFrom}, ${route.gradientTo})` }"
            >
              {{ route.title }} · {{ route.theme }}
            </div>
            <ol class="p-4 space-y-2">
              <li
                v-for="(step, i) in route.steps"
                :key="i"
                class="flex gap-3 text-sm leading-relaxed"
              >
                <span class="flex-shrink-0 w-10 text-xs font-bold text-primary pt-0.5">{{ step.time }}</span>
                <div>
                  <span class="font-bold text-text">{{ step.title }}</span>
                  <span class="text-text-muted"> — {{ step.description }}</span>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <!-- 出行贴士 -->
      <section class="bg-card border border-border rounded-2xl p-5 shadow-card">
        <h2 class="text-lg font-bold text-text mb-4 flex items-center gap-2">
          📌 出行小贴士
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="tip in tips"
            :key="tip.id"
            class="border-l-4 border-secondary bg-[#FFFDF9] rounded-r-xl p-3.5"
          >
            <h4 class="text-sm font-bold text-primary-dark mb-1">{{ tip.title }}</h4>
            <p class="text-xs text-text-muted leading-relaxed">{{ tip.content }}</p>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="text-center text-xs text-text-light py-6 leading-relaxed">
        🍜 临汾逛吃愉快 · 到了临汾咱是回家<br>
        数据整理自抖音「盈盈吃不饱」及多篇本地美食测评交叉验证<br>
        店铺营业状态、价格可能变化，出行前请以地图App实时信息为准
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 首页视图
 * - 整合地图、列表、内容区
 * - 移动端/桌面端双布局适配
 */
import { ref } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import DesktopSidebar from '@/components/layout/DesktopSidebar.vue'
import MobileDrawer from '@/components/layout/MobileDrawer.vue'
import SearchBar from '@/components/common/SearchBar.vue'
import CategoryFilter from '@/components/food/CategoryFilter.vue'
import FoodMap from '@/components/map/FoodMap.vue'
import DishCard from '@/components/food/DishCard.vue'
import RouteCard from '@/components/route/RouteCard.vue'
import { useFoodData } from '@/composables/useFoodData'

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

function onSpotSelect(spotId: string) {
  selectedSpotId.value = spotId
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
        <DesktopSidebar
          :spots="filteredSpots"
          :grouped-spots="groupedSpots"
          :categories="categories"
          @spot-select="onSpotSelect"
        />

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
        <MobileDrawer
          :spots="filteredSpots"
          :grouped-spots="groupedSpots"
          :categories="categories"
          :selected-spot-id="selectedSpotId"
          @spot-select="onSpotSelect"
        />
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
          <DishCard v-for="dish in dishes" :key="dish.id" :dish="dish" />
        </div>
      </section>

      <!-- 推荐路线 -->
      <section class="bg-card border border-border rounded-2xl p-5 shadow-card">
        <h2 class="text-lg font-bold text-text mb-1 flex items-center gap-2">
          🗺️ 两天一夜 · 48小时参考路线
        </h2>
        <p class="text-xs text-text-muted mb-4">按点位就近串联，步行+共享单车为主；节假日热门店建议错峰</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RouteCard v-for="route in routes" :key="route.day" :route="route" />
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

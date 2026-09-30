<script setup lang="ts">
/**
 * 关于页 / 数据来源说明
 * - 项目介绍
 * - 数据来源与致谢
 * - 免责声明
 * - 反馈入口
 */
import AppHeader from '@/components/layout/AppHeader.vue'
import sourcesData from '@/data/sources.json'

interface Source {
  id: string
  type: string
  name: string
  description: string
  url: string
}

const sources = sourcesData as Source[]
</script>

<template>
  <div class="min-h-screen bg-bg flex flex-col">
    <AppHeader subtitle="关于本项目" />

    <main class="flex-1 max-w-2xl mx-auto w-full px-4 py-8 space-y-8">

      <!-- 项目介绍 -->
      <section class="bg-card border border-border rounded-2xl p-6 shadow-card">
        <h2 class="text-lg font-bold text-text mb-3 flex items-center gap-2">
          🍜 关于「临汾吃啥」
        </h2>
        <p class="text-sm text-text-muted leading-relaxed mb-3">
          这是一个为临汾本地人和游客打造的美食地图工具。我们整理了临汾市区及周边值得一试的店铺，
          包括牛肉丸子面、羊汤、特色小吃等本地人日常光顾的地方。
        </p>
        <p class="text-sm text-text-muted leading-relaxed">
          所有数据均经过多个来源交叉验证，力求真实可靠。希望这份指南能帮你找到真正好吃的临汾味道。
        </p>
      </section>

      <!-- 数据来源 -->
      <section class="bg-card border border-border rounded-2xl p-6 shadow-card">
        <h2 class="text-lg font-bold text-text mb-4 flex items-center gap-2">
          📚 数据来源与致谢
        </h2>
        <div class="space-y-4">
          <div
            v-for="source in sources"
            :key="source.id"
            class="border-l-4 border-primary bg-[#FFFDF9] rounded-r-xl p-4"
          >
            <h4 class="text-sm font-bold text-text mb-1">{{ source.name }}</h4>
            <p class="text-xs text-text-muted leading-relaxed">{{ source.description }}</p>
            <a
              v-if="source.url"
              :href="source.url"
              target="_blank"
              rel="noopener"
              class="inline-block mt-2 text-xs text-primary hover:underline"
            >
              访问来源 →
            </a>
          </div>
        </div>
      </section>

      <!-- 免责声明 -->
      <section class="bg-card border border-border rounded-2xl p-6 shadow-card">
        <h2 class="text-lg font-bold text-text mb-3 flex items-center gap-2">
          ⚠️ 免责声明
        </h2>
        <ul class="text-sm text-text-muted leading-relaxed space-y-2 list-disc list-inside">
          <li>店铺营业状态、价格、营业时间可能随时变化，出行前请以地图 App 实时信息为准</li>
          <li>本工具仅提供信息整理，不对店铺服务质量做任何保证</li>
          <li>坐标数据已转换为 GCJ-02 坐标系，可能与实际位置存在微小偏差</li>
          <li>如发现信息有误或店铺已关闭，欢迎通过下方渠道反馈</li>
        </ul>
      </section>

      <!-- 反馈入口 -->
      <section class="bg-card border border-border rounded-2xl p-6 shadow-card text-center">
        <h2 class="text-lg font-bold text-text mb-3">💬 意见反馈</h2>
        <p class="text-sm text-text-muted mb-4">
          发现错误？想推荐新店？有任何建议都欢迎告诉我们
        </p>
        <div class="flex justify-center gap-3">
          <a
            href="mailto:feedback@example.com"
            class="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-dark transition-colors"
          >
            📧 发送邮件
          </a>
          <button
            class="px-5 py-2.5 border border-primary text-primary text-sm font-medium rounded-xl hover:bg-primary/5 transition-colors"
            disabled
            title="即将上线"
          >
            📝 提交表单（即将上线）
          </button>
        </div>
      </section>

      <!-- Footer -->
      <footer class="text-center text-xs text-text-light py-6 leading-relaxed">
        🍜 临汾逛吃愉快 · 到了临汾咱是回家<br>
        © {{ new Date().getFullYear() }} 临汾吃啥 · 用 ❤️ 制作
      </footer>
    </main>
  </div>
</template>

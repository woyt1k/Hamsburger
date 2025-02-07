<template>
  <main class="game" v-if="loaded">
    <div class="page">
      <RouterView />
    </div>
    <TheMenu />
    <!-- Подключаем Toast -->
    <Toast />
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue' 
import { RouterView } from 'vue-router'
import TheMenu from './components/TheMenu.vue'
import Toast from './components/Toast.vue'
import { useAppStore } from '@/stores/app'
import { useTelegram } from '@/services/telegram'

const loaded = ref(false)
const app = useAppStore()

const { tg } = useTelegram()

const startFullScreen = () => {
  if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.ready()
    window.Telegram.WebApp.expand()
    console.log("Telegram WebApp API доступен. Приложение расширено на весь экран.")
  } else {
    console.error("Telegram WebApp API недоступен.")
  }
}

app.init().then(() => {
  loaded.value = true
})

onMounted(() => {
  startFullScreen()
  tg.ready()
  tg.expand()
})
</script>

<style scoped>
</style>

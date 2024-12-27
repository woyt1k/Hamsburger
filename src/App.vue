<template>
  <main class="game">
    <div class="page">
      <RouterView />
    </div>
    <TheMenu />
  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import TheMenu from './components/TheMenu.vue'

// Функция для расширения WebApp на весь экран
const startFullScreen = () => {
  if (window.Telegram && window.Telegram.WebApp) {
    // Оповещаем Telegram, что приложение готово
    window.Telegram.WebApp.ready();

    // Раскрываем приложение на весь экран
    window.Telegram.WebApp.expand();

    // Логирование для проверки
    console.log("Telegram WebApp API доступен. Приложение расширено на весь экран.");
  } else {
    console.error("Telegram WebApp API недоступен.");
  }
}

// Запускаем функцию сразу при монтировании компонента
onMounted(() => {
  startFullScreen();  // Этот код будет выполнен, когда компонент загрузится
})
</script>

<style scoped>
/* Добавь стили, если нужно */
</style>

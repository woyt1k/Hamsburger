import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

// Telegram API expand
if (window.Telegram && window.Telegram.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
}

// Добавляем обработчик на изменение размеров экрана
window.addEventListener('resize', () => {
    if (window.Telegram && window.Telegram.WebApp) {
        Telegram.WebApp.expand();
    }
});

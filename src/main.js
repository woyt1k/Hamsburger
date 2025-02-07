import './assets/main.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useTelegram } from './services/telegram.js'; 

const app = createApp(App);
app.use(createPinia());
app.use(router);

app.mount('#app');

if (window.Telegram && window.Telegram.WebApp) {
  const { tg, triggerHapticFeedback } = useTelegram();

  tg.ready();
  tg.expand();

  const updateBackButton = () => {
    const currentRoute = router.currentRoute.value.name;

    if (currentRoute !== 'home') {
      tg.BackButton.show();
      tg.BackButton.onClick(() => {
        triggerHapticFeedback("impact", { impact_style: "medium" });
        router.push('/');
      });
    } else {
      tg.BackButton.hide();
    }
  };

  app.directive('haptic', {
    mounted(el, binding) {
      el.addEventListener('click', () => {
        const { triggerHapticFeedback } = useTelegram();
        const { type = 'impact', options = { impact_style: 'light' } } = binding.value || {};
        triggerHapticFeedback(type, options);
      });
    },
  });
  
  router.afterEach(() => {
    updateBackButton();
  });

  updateBackButton();
}

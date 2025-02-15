<template>
  <div :class="['toast', { 'toast-visible': visible }]">
    <div class="toast-content">
      <img v-if="exchangeLogo" :src="exchangeLogo" alt="Exchange Logo" class="toast-logo" />
      <p class="toast-message">{{ message }}</p>
      <button class="toast-close-button" @click="closeToast">Закрыть</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const visible = ref(false);
    const message = ref('');
    const exchangeLogo = ref('');
    let timeoutId = null;

    const showToast = (msg, logo) => {
      message.value = msg;
      exchangeLogo.value = logo;
      visible.value = true;
    
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(() => {
        closeToast();
      }, 10000); // 10 секунд
    };

    const closeToast = () => {
      visible.value = false;
      setTimeout(() => {
        message.value = '';
        exchangeLogo.value = '';
      }, 500); // Ожидание завершения анимации перед очисткой
    };

    window.addEventListener('show-toast', (event) => {
      showToast(event.detail.message, event.detail.logo);
    });

    return { visible, message, exchangeLogo, closeToast };
  },
};
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) translateY(100%);
  width: 100%;
  max-width: 600px;
  height: 60vh;
  background: #313131;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out;
  opacity: 0;
  z-index: 1000;
}

.toast.toast-visible {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
}

.toast-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
}

.toast-logo {
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
}

.toast-message {
  font-size: 18px;
  text-align: center;
  line-height: 1.5;
}

.toast-close-button {
  margin-top: 20px;
  padding: 12px 24px;
  background-color: #00f7ff;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.toast-close-button:hover {
  background-color: #00e1ff;
}
</style>
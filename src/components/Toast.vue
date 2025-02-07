<template>
  <div v-if="visible" :class="['toast', { 'toast-visible': visible }]">
    <div class="toast-content">
      <p class="toast-message">{{ message }}</p>
      
      <!-- Показ логотипа выбранной биржи (между текстом и кнопкой) -->
      <img v-if="exchangeLogo" :src="exchangeLogo" alt="Exchange Logo" class="toast-logo" />
      
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
    const exchangeLogo = ref('');  // Логотип биржи

    const showToast = (msg, logo) => {
      message.value = msg;
      exchangeLogo.value = logo;  // Устанавливаем логотип
      visible.value = true;

      setTimeout(() => {
        closeToast();
      }, 30000); // 30 секунд
    };

    const closeToast = () => {
      visible.value = false;
      message.value = '';
      exchangeLogo.value = ''; // Очищаем логотип
    };

    // Слушаем глобальное событие через `window`
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
  left: 0;
  width: 100%;
  height: 60%;
  background: #313131;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-top-left-radius: 60px;
  border-top-right-radius: 60px;
  box-shadow: 0 -4px 8px rgb(0, 0, 0);
  transform: translateY(100%);
  transition: transform 0.3s ease-in-out;
  z-index: 1000;
}

.toast.toast-visible {
  transform: translateY(0);
}

.toast-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  width: 100%;
}

.toast-logo {
  width: 50px;
  height: 50px;
  margin-top: 20px; /* Отступ от текста до логотипа */
  margin-bottom: 20px; /* Отступ от логотипа до кнопки */
}

.toast-message {
  font-size: 18px;
  text-align: center;
  line-height: 1.5;
}

.toast-close-button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #00f7ff;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.toast-close-button:hover {
  background-color: #00e1ff;
}
</style>

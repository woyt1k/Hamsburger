<template>
  <div class="game-container">
    <ScoreProgress />
    <div class="header">
      <img src="../assets/coin.png" alt="coin" />
      <h2 class="score" id="score">{{ store.currentScore }}</h2>
    </div>
    <div class="circle">
      <img @click="increment" ref="img" id="circle" :src="imgSrc" />
    </div>
    <!-- Плашка вытянутого круга -->
    <div class="floating-panel">
      <!-- Здесь меняем картинку в зависимости от выбранной биржи или кота -->
      <button class="cat-btn" @click="goToExchanges">
        <img :src="selectedExchangeLogo" alt="Selected Exchange" />
      </button>
      <button class="settings-btn" @click="handleSettingsClick">
        <img src="../assets/setting.png" alt="Settings" />
      </button>
    </div>
    <SettingsMenu v-if="$route.path === '/settings'" @close="goBack" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ScoreProgress from '@/components/ScoreProgress.vue';
import SettingsMenu from '@/components/SettingsMenu.vue';
import { useScoreStore } from '@/stores/score';
import { useTelegram } from '@/services/telegram';

const img = ref(null);
const router = useRouter();
const { triggerHapticFeedback } = useTelegram();

// Импортируем картинки
import hamburger from '@/assets/burger1.png';
import bighamburger from '@/assets/burger2.png';
import bigghamburger from '@/assets/burger3.png';
import biggghamburger from '@/assets/burger4.png';
import bigggghamburger from '@/assets/burger5.png';

import binanceLogo from '@/assets/binance.png';
import bybitLogo from '@/assets/bybit.png';
import okxLogo from '@/assets/okx.png';
import bingxLogo from '@/assets/bingx.png';
import catLogo from '@/assets/cat.png'; // Логотип кота

const store = useScoreStore();

const selectedExchange = ref(localStorage.getItem("selectedExchange") || "cat");

// Вычисляем картинку для текущего логотипа выбранной биржи или кота
const selectedExchangeLogo = computed(() => {
  // Проверяем, если в localStorage сохранена биржа или выбрана биржа
  if (!selectedExchange.value || selectedExchange.value === 'cat') {
    return catLogo; // Если не выбрана биржа или выбран кот, показываем картинку кота
  }
  
  // Используем switch для отображения логотипа в зависимости от выбранной биржи
  switch (selectedExchange.value) {
    case 'Binance':
      return binanceLogo;
    case 'Bybit':
      return bybitLogo;
    case 'Okx':
      return okxLogo;
    case 'BingX':
      return bingxLogo;
    default:
      return catLogo; // Если биржа не определена, показываем кота
  }
});


const imgSrc = computed(() => {
  if (store.currentScore >= 100) return bigggghamburger;
  if (store.currentScore >= 50) return biggghamburger;
  if (store.currentScore >= 25) return bigghamburger;
  if (store.currentScore >= 10) return bighamburger;
  return hamburger;
});

// Это нужно для того, чтобы обновить картинку сразу при загрузке
onMounted(() => {
  const savedExchange = localStorage.getItem("selectedExchange");
  if (savedExchange) {
    selectedExchange.value = savedExchange;
  }
});

function isVibrationEnabled() {
  return JSON.parse(localStorage.getItem('vibrationEnabled')) ?? true;
}

function goToSettings() {
  router.push('/settings');
}

function goToExchanges() {
  if (isVibrationEnabled()) {
    triggerHapticFeedback('impact', { style: 'light' });
  }
  router.push('/exchanges');
}

function goBack() {
  router.push('/');
}

function handleSettingsClick() {
  if (isVibrationEnabled()) {
    triggerHapticFeedback('impact', { style: 'light' });
  }
  goToSettings();
}

function increment(event) {
  store.add(1);

  if (isVibrationEnabled()) {
    triggerHapticFeedback('impact', { style: 'light' });
  }

  const rect = event.target.getBoundingClientRect();
  const offsetX = event.clientX - rect.left - rect.width / 2;
  const offsetY = event.clientY - rect.top - rect.height / 2;

  const DEG = 40;
  const tiltX = (offsetY / rect.height) * DEG;
  const tiltY = (offsetX / rect.width) * -DEG;

  img.value.style.setProperty('--tiltX', `${tiltX}deg`);
  img.value.style.setProperty('--tiltY', `${tiltY}deg`);

  setTimeout(() => {
    img.value.style.setProperty('--tiltX', '0deg');
    img.value.style.setProperty('--tiltY', '0deg');
  }, 300);

  const plusOne = document.createElement('div');
  plusOne.classList.add('plus-one');
  plusOne.textContent = '+1';
  plusOne.style.left = `${event.clientX - rect.left}px`;
  plusOne.style.top = `${event.clientY - rect.top}px`;

  img.value.parentElement.appendChild(plusOne);

  setTimeout(() => plusOne.remove(), 2000);
}

// Функция для выбора биржи и обновления состояния
function selectExchange(exchangeName) {
  selectedExchange.value = exchangeName;
  localStorage.setItem('selectedExchange', exchangeName); // Сохраняем выбранную биржу в localStorage
}
</script>




<style scoped>
/* Оставляем стили без изменений */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.settings-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.settings-btn img {
  width: 32px;
  height: 32px;
}

.settings-btn:hover {
  color: #007bff;
}

.cat-btn {
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 10px;
}

.cat-btn img {
  width: 32px;
  height: 32px;
}

.circle img {
  display: block;
  border: none;
  outline: none;
  width: 200px;
  height: 200px;
  object-fit: contain;
}

.circle {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.floating-panel {
  position: absolute;
  top: 4rem;
  right: 3rem;
  width: 160px;
  height: 35px;
  border-radius: 30px;
  background: linear-gradient(
    to bottom left,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.8) 50%, 
    rgba(0, 200, 255, 0.8) 100% 
  );
  border: 1px solid rgba(0, 0, 0, 0.8);
  box-shadow: 
    0px 4px 12px rgba(0, 0, 0, 0.2),
    0px 0px 10px rgb(0, 200, 255);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  z-index: 10;
}
</style>

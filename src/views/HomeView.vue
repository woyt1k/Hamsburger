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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ScoreProgress from '@/components/ScoreProgress.vue';
import { useScoreStore } from '@/stores/score';

const img = ref(null);
import hamburger from '@/assets/hamburger.png';
import bighamburger from '@/assets/bighamburger.png';

const store = useScoreStore();

// Реактивное изменение источника изображения
const imgSrc = computed(() => (store.currentScore >= 25 ? bighamburger : hamburger));

function increment(event) {
  store.add(1);
  console.log('Score updated:', store.score); // Отладка

  const rect = event.target.getBoundingClientRect();
  const offsetX = event.clientX - rect.left - rect.width / 2;
  const offsetY = event.clientY - rect.top - rect.height / 2;

  const DEG = 40;
  const tiltX = (offsetY / rect.height) * DEG;
  const tiltY = (offsetX / rect.width) * -DEG;

  img.value.style.setProperty('--tiltX', `${tiltX}deg`);
  img.value.style.setProperty('--tiltY', `${tiltY}deg`);

  setTimeout(() => {
    img.value.style.setProperty('--tiltX', `0deg`);
    img.value.style.setProperty('--tiltY', `0deg`);
  }, 300);

  const plusOne = document.createElement('div');
  plusOne.classList.add('plus-one');
  plusOne.textContent = '+1';
  plusOne.style.left = `${event.clientX - rect.left}px`;
  plusOne.style.top = `${event.clientY - rect.top}px`;

  img.value.parentElement.appendChild(plusOne);

  
  setTimeout(() => plusOne.remove(), 2000);
}
</script>

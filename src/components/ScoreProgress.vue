<template>
  <div class="progress">
    <!-- Отображение текущего прогресса -->
    <h4 class="progress-level">
      <span>{{ store.levelScore || 0 }} / {{ maxScore || 0 }}</span>
      <span>{{ store.level.level + 1 }}</span>
    </h4>
    <!-- Полоса прогресса -->
    <div class="progress-container">
      <div class="progress-value" :style="{ width: progress + '%' }"></div>
    </div>
  </div>
</template>

<script setup>
import { useScoreStore } from '@/stores/score';
import { computed } from 'vue';

const store = useScoreStore();

// Максимальное количество очков для текущего уровня
const maxScore = computed(() => {
  const { currentThreshold, previousThreshold } = store.level;
  const levelRange = currentThreshold - previousThreshold;

  return levelRange > 0 ? levelRange : 0; // Защита от отрицательных значений
});

// Прогресс текущего уровня в процентах
const progress = computed(() => {
  if (maxScore.value > 0) {
    return (store.levelScore / maxScore.value) * 100;
  }
  return 0; // Если максимальное значение равно 0
});
</script>

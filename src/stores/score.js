import { defineStore } from 'pinia';

// Базовый уровень и вычисление уровней
const baseLevelScore = 25;
const levels = Array.from({ length: 15 }, (_, i) => baseLevelScore * (2 ** i));

// Функция для вычисления текущего уровня и порогов
const computeLevelByScore = (score) => {
  let previousThreshold = 0;

  for (let i = 0; i < levels.length; i++) {
    if (score < levels[i]) {
      return {
        level: i,
        currentThreshold: levels[i],
        previousThreshold,
      };
    }
    previousThreshold = levels[i];
  }

  // Если счет превышает все уровни, возвращаем последний
  return {
    level: levels.length - 1,
    currentThreshold: levels[levels.length - 1],
    previousThreshold: levels[levels.length - 2] || 0,
  };
};

// Хранилище Pinia
export const useScoreStore = defineStore('score', {
  state: () => ({
    currentScore: 0, // Общий счет
    levelScore: 0,   // Очки на текущем уровне
  }),
  getters: {
    level(state) {
      return computeLevelByScore(state.currentScore);
    },
    progress(state) {
      const { previousThreshold, currentThreshold } = this.level;
      const levelRange = currentThreshold - previousThreshold;

      if (levelRange <= 0) return 0; // Защита от деления на ноль
      return ((state.levelScore) / levelRange) * 100;
    },
  },
  actions: {
    add(score = 1) {
      console.log('Before add:', this.currentScore, this.levelScore);
      this.currentScore += score;
  
      const { currentThreshold, previousThreshold } = this.level;
  
      // Пересчет очков для текущего уровня
      if (this.currentScore >= currentThreshold) {
        this.levelScore = 0; // Новый уровень
      } else {
        this.levelScore = this.currentScore - previousThreshold;
      }
  
      console.log('After add:', this.currentScore, this.levelScore);
    },
  }  
});

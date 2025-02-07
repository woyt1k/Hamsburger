import { defineStore } from 'pinia';
import { addOrUpdateUserScore, getUserScore } from '@/services/supabase';
import { useTelegram } from '@/services/telegram';

export const useScoreStore = defineStore('score', {
  state: () => ({
    currentScore: 0,
    levelScore: 0,
    telegramId: null,
  }),
  getters: {
    level(state) {
      return computeLevelByScore(state.currentScore);
    },
    progress(state) {
      const { previousThreshold, currentThreshold } = this.level;
      const levelRange = currentThreshold - previousThreshold;

      if (levelRange <= 0) return 0;
      return (state.levelScore / levelRange) * 100;
    },
  },
  actions: {
    async initializeUser(telegramId) {
      this.telegramId = telegramId; // Сохраняем telegramId
      const userScore = await getUserScore(telegramId);
      this.currentScore = userScore?.score || 0; // Устанавливаем очки
      const { previousThreshold } = this.level;
      this.levelScore = this.currentScore - previousThreshold; // Инициализируем уровень

      const { tg } = useTelegram();
      if (tg?.HapticFeedback) {
        tg.HapticFeedback.impactOccurred("medium"); 
        console.log("Тактильная обратная связь: Инициализация пользователя.");
      }
    },
    async add(score = 1) {
      this.currentScore += score;
      const { currentThreshold, previousThreshold } = this.level;

      if (this.currentScore >= currentThreshold) {
        const newLevel = computeLevelByScore(this.currentScore);
        this.levelScore = this.currentScore - newLevel.previousThreshold;
        const { tg } = useTelegram();
        if (tg?.HapticFeedback) {
          tg.HapticFeedback.impactOccurred("success");
          console.log("Тактильная обратная связь: Уровень обновлен.");
        }
      } else {
        this.levelScore = this.currentScore - previousThreshold;
        const { tg } = useTelegram();
        if (tg?.HapticFeedback) {
          tg.HapticFeedback.impactOccurred("warning");
          console.log("Тактильная обратная связь: Прогресс обновлен.");
        }
      }
      if (this.telegramId) {
        await addOrUpdateUserScore(this.telegramId, this.currentScore);
      }
    },
  },
});

function computeLevelByScore(score) {
  const levels = [
    { level: 0, previousThreshold: 0, currentThreshold: 10 },  
    { level: 1, previousThreshold: 10, currentThreshold: 25 }, 
    { level: 2, previousThreshold: 25, currentThreshold: 50 }, 
    { level: 3, previousThreshold: 50, currentThreshold: 100 }, 
    { level: 4, previousThreshold: 100, currentThreshold: 200 }
  ];

  let previousThreshold = 200;
  let currentThreshold = 400;
  for (let i = 5; i <= 100; i++) { 
    levels.push({
      level: i,
      previousThreshold: previousThreshold,
      currentThreshold: currentThreshold,
    });
    previousThreshold = currentThreshold;
    currentThreshold *= 2; 
  }

  for (const level of levels) {
    if (score >= level.previousThreshold && score < level.currentThreshold) {
      return level;
    }
  }
  return levels[0];
}

import { defineStore } from 'pinia';
import { addOrUpdateUserScore, getUserScore } from '@/services/supabase';
import { useTelegram } from '@/services/telegram';
import debounce from 'lodash.debounce';
import { updateScore } from '@/api/app';

const debouncedUpdateScore = debounce(updateScore, 500);

export const useScoreStore = defineStore('score', {
  state: () => ({
    currentScore: 0,
    levelScore: 0,
    telegramId: null,
    progress: 0, 
  }),
  getters: {
    level(state) {
      return computeLevelByScore(state.currentScore);
    },
  },
  actions: {
    add(score = 1) {
      this.currentScore += score;
      this.updateProgress();
      debouncedUpdateScore(this.currentScore);
    },
    setScore(value) {
      this.currentScore = value;
      this.updateProgress();
    },
    updateProgress() {
      const { previousThreshold, currentThreshold } = computeLevelByScore(this.currentScore);
      const levelRange = currentThreshold - previousThreshold;
      this.levelScore = this.currentScore - previousThreshold;
      this.progress = levelRange > 0 ? (this.levelScore / levelRange) * 100 : 0;
    },
    async initializeUser(telegramId) {
      this.telegramId = telegramId;
      const userScore = await getUserScore(telegramId);
      this.setScore(userScore?.score || 0);

      const telegram = useTelegram();
      if (telegram?.tg?.HapticFeedback) {
        telegram.tg.HapticFeedback.impactOccurred("medium");
        console.log("Тактильная обратная связь: Инициализация пользователя.");
      }
    },
    async addAndUpdate(score = 1) {
      this.add(score);
      this.updateProgress();
      const levelInfo = computeLevelByScore(this.currentScore);

      const telegram = useTelegram();
      if (telegram?.tg?.HapticFeedback) {
        const feedbackType = this.currentScore >= levelInfo.currentThreshold ? "success" : "warning";
        telegram.tg.HapticFeedback.impactOccurred(feedbackType);
        console.log(`Тактильная обратная связь: ${feedbackType === "success" ? "Уровень обновлен" : "Прогресс обновлен"}.`);
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
    levels.push({ level: i, previousThreshold, currentThreshold });
    previousThreshold = currentThreshold;
    currentThreshold *= 2;
  }

  return levels.find(l => score >= l.previousThreshold && score < l.currentThreshold) || levels[0];
}

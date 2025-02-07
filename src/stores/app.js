import { defineStore } from 'pinia'
import { addOrUpdateUserScore, getUserScore } from '@/services/supabase'

export const useAppStore = defineStore('app', {
  state: () => ({
    user: null,
    score: 0,
    selectedExchangeLogo: null, // Логотип выбранной биржи
  }),
  actions: {
    async init(telegramId) {
      try {
        const userScore = await getUserScore(telegramId)
        if (userScore) {
          this.score = userScore.score
        } else {
          this.score = 0
        }
      } catch (err) {
        console.error('Ошибка инициализации пользователя:', err.message)
      }
    },
    async updateScore(telegramId, newScore) {
      this.score += newScore
      await addOrUpdateUserScore(telegramId, this.score)
    },
    setSelectedExchangeLogo(logo) {
      this.selectedExchangeLogo = logo // Устанавливаем логотип выбранной биржи
    },
  },
}) 
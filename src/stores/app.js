import { defineStore } from 'pinia'
import { getOrCreateUser, registerRef, fetchTasks, completeTask } from '@/api/app'
import { useScoreStore } from './score'
import { useTelegram } from '@/services/telegram'

const { user } = useTelegram()

export const useAppStore = defineStore('app', {
  state: () => ({
    user: {},
    tasks: [],
    selectedExchangeLogo: null, 
  }),
  actions: {
    async init(ref) {
      this.user = await getOrCreateUser()
      
      const score = useScoreStore()
      score.setScore(this.user.score)

      if (ref && +ref !== this.user.telegram) {
        await registerRef(this.user.first_name, ref)
      }
    },
    async completeTask(task) {
      await completeTask(this.user, task)
    },
    async fetchTasks() {
      try {
        console.log("Fetching tasks...");
        this.tasks = await fetchTasks();
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }    
    }
  },
})

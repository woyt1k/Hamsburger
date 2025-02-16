<template>
  <div class="text-content">
    <h1>Твои друзья</h1>

    <div class="center">
      <button class="referal" @click="copy">{{ referalText }}</button>
    </div>

    <h3 v-if="friends.length == 0">Сейчас друзей нет</h3>

    <ul class="list">
      <li class="list-item" v-for="friend in friends" :key="friends.id">
        {{ friend.name }}
        <span class="list-btn done">50</span>
      </li>
    </ul>
  </div>
</template>


<script setup>
import { useTelegram } from '@/services/telegram'
import { useAppStore } from '@/stores/app';
import { ref, computed, onMounted } from 'vue'

const app = useAppStore()
const { user } = useTelegram()
const referalText = ref('Your referal')
const userId = ref(null)

onMounted(() => {
  userId.value = user?.id || null
})

const referalLink = computed(() => userId.value ? `https://t.me/Hamsburger_bot?start=${userId.value}` : '')

const friends = computed(() => Object.keys(app.user.friends).map((id) => ({
  id,
  name: app.user.friends[id],
})))

function copy() {
  if (userId.value) {
    navigator.clipboard.writeText(referalLink.value)
    referalText.value = 'Copied!'
  } else {
    referalText.value = 'Error: No ID'
  }
}
</script>

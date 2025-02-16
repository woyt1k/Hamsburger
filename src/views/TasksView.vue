<template>
  <div class="text-content">
    <h1>Твои задания</h1>
    <h3 v-if="app.tasks.length === 0">Загрузка заданий...</h3>
    <ul class="list">
      <li class="list-item" v-for="task in app.tasks" :key="task.id">
        {{ task.title }}
        <span>
          <a @click.prevent="openTask(task)" target="_blank" class="list-btn" :class="{ done: app.user?.tasks?.[task.id] }">
            {{ task.amount }}
          </a>
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useTelegram } from '@/services/telegram';
import { useAppStore } from '@/stores/app';
import { onMounted } from 'vue';

const { tg } = useTelegram();
const app = useAppStore();

onMounted(async () => {
  await app.fetchTasks(); 
});

function openTask(task) {
  app.completeTask(task);

  if (task.url.includes('t.me') && tg?.openTelegramLink) {
    tg.openTelegramLink(task.url);
  } else {
    window.open(task.url, '_blank'); 
  }
}
</script>

<template>
  <div>
    <!-- Отображение ника и аватара только на главной странице -->
    <div v-if="isHomePage" class="user-info">
      <img :src="avatarUrl" alt="Аватар" class="avatar" />
      <span>{{ username || 'Гость' }}</span>
    </div>

    <!-- Основное меню -->
    <div class="menu">
      <RouterLink to="/" custom v-slot="{ isActive }">
        <i
          class="menu-button fa fa-bullseye"
          :class="{ active: isActive }"
          @click="handleNavigate('/')"
          aria-hidden="true"
        ></i>
      </RouterLink>
      <RouterLink to="/friends" custom v-slot="{ isActive }">
        <i
          class="menu-button fa fa-users"
          :class="{ active: isActive }"
          @click="handleNavigate('/friends')"
          aria-hidden="true"
        ></i>
      </RouterLink>
      <RouterLink to="/tasks" custom v-slot="{ isActive }">
        <i
          class="menu-button fa fa-tasks"
          :class="{ active: isActive }"
          @click="handleNavigate('/tasks')"
          aria-hidden="true"
        ></i>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink, useRouter, useRoute } from 'vue-router';
import { useTelegram } from '@/services/telegram';
import { useAppStore } from '@/stores/app';
import defaultCatLogo from '@/assets/cat.png';


const appStore = useAppStore();
const selectedExchangeLogo = computed(() => appStore.selectedExchangeLogo || defaultCatLogo);
const router = useRouter();
const route = useRoute();
const { tg, user } = useTelegram();

const username = (user?.username || user?.first_name || 'Гость').slice(0, 6) + (user?.username?.length > 6 || user?.first_name?.length > 7 ? '...' : '');
const avatarUrl = user?.photo_url || getDefaultAvatar(username);

const isHomePage = computed(() => route.path === '/');

function getDefaultAvatar(name) {
  if (!name) return 'https://via.placeholder.com/40?text=?';
  const initial = name.charAt(0).toUpperCase();
  const color = getRandomColor();
  return `https://via.placeholder.com/40/${color}/fff?text=${initial}`;
}

function getRandomColor() {
  const colors = ['FF5733', '33FF57', '3357FF', 'FF33A1', '33FFF5', 'F5FF33'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Проверяем, включена ли вибрация
function isVibrationEnabled() {
  return JSON.parse(localStorage.getItem('vibrationEnabled')) ?? true;
}

// Навигация с учетом вибрации
const handleNavigate = (path) => {
  if (isVibrationEnabled()) {
    tg?.HapticFeedback?.impactOccurred('medium');
  }
  router.push(path);
};
</script>

<style scoped>
.user-info {
  position: absolute;
  top: 4rem;  /* Выравниваем по той же высоте, что и у плашки */
  right: 17rem;  /* Выравниваем по правому краю, как у плашки */
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  color: white;
  z-index: 10;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.menu {
  position: fixed;
  bottom: 12px;
  width: calc(100% - 30px);
  display: flex;
  justify-content: space-around;
  background-color: #424242;
  border-radius: 20px;
  padding: 10px 10px;
  box-shadow: 0px 4px 6px rgb(0, 0, 0);
}

.menu-button {
  font-size: 24px;
  color: rgb(131, 131, 131);
  transition: color 0.2s, transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  box-shadow: 0px 0px 0px 2px transparent;
}

.menu-button.active {
  color: rgb(255, 255, 255);
  background-color: #00b7ff;
  box-shadow: 
    0 0 5px rgba(0, 183, 255, 0.8),
    0 0 10px rgba(0, 183, 255, 0.6),
    0 0 15px rgba(0, 183, 255, 0.4);
  transition: box-shadow 0.2s, background-color 0.2s;
}
</style>

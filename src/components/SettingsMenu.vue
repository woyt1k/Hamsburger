<template>
  <div class="settings-overlay">
    <div class="settings-menu">
      <div class="menu-content">
        <h1>Настройки</h1>
        <div class="setting-item">
          <button class="exchange-button" @click="changeLanguage">
            <span class="exchange-name">Сменить язык</span>
            <img src="@/assets/arrow.png" alt="Arrow" class="arrow-icon" />
          </button>
        </div>
        <div class="setting-item">
          <button class="exchange-button" @click="changeExchange">
            <span class="exchange-name">Сменить биржу</span>
            <img src="@/assets/arrow.png" alt="Arrow" class="arrow-icon" />
          </button>
        </div>
        <div class="setting-item">
          <button class="exchange-button" @click="toggleVibration">
            <span class="exchange-name">Вибрация</span>
            <div class="toggle-switch" :class="{ active: settings.vibrationEnabled }">
              <div class="switch"></div>
            </div>
          </button>
        </div>
        <div class="setting-item">
          <button class="exchange-button" @click="toggleAnimation">
            <span class="exchange-name">Анимация</span>
            <div class="toggle-switch" :class="{ active: settings.animationEnabled }">
              <div class="switch"></div>
            </div>
          </button>
        </div>
      </div>
      <footer>
        <p @click="showPrivacyPolicy">Политика конфиденциальности</p>
      </footer>
    </div>
  </div>
</template>


<script>
import { useTelegram } from "../services/telegram";

export default {
  data() {
    return {
      settings: {
        language: "Русский",
        exchange: "Bybit",
        animationEnabled: JSON.parse(localStorage.getItem("animationEnabled")) ?? true,
        vibrationEnabled: JSON.parse(localStorage.getItem("vibrationEnabled")) ?? true,
      },
    };
  },
  methods: {
    toggleAnimation() {
      this.settings.animationEnabled = !this.settings.animationEnabled;
      localStorage.setItem("animationEnabled", JSON.stringify(this.settings.animationEnabled));
      document.body.classList.toggle("disable-animations", !this.settings.animationEnabled);
    },
    toggleVibration() {
      this.settings.vibrationEnabled = !this.settings.vibrationEnabled;
      localStorage.setItem("vibrationEnabled", JSON.stringify(this.settings.vibrationEnabled));
      if (this.settings.vibrationEnabled && navigator.vibrate) {
        navigator.vibrate(200);
      }
    },
    changeLanguage() {
      this.settings.language = this.settings.language === "Русский" ? "English" : "Русский";
    },
    changeExchange() {
    this.$router.push("/exchanges"); // Перенаправляем на страницу выбора биржи
    },

    showPrivacyPolicy() {
      console.log("Открытие политики конфиденциальности...");
    },
  },
  mounted() {
    const { tg } = useTelegram();
    document.body.classList.toggle("disable-animations", !this.settings.animationEnabled);
    tg.BackButton.show();
    tg.BackButton.onClick(() => {
      this.$router.push("/");
    });
  },
  unmounted() {
    const { tg } = useTelegram();
    tg.BackButton.hide();
    tg.BackButton.offClick();
  },
};
</script>

<style scoped>
.settings-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.settings-menu {
  background-color: #000;
  color: #fff;
  width: 100%;
  max-width: 600px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
}

.menu-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0px;
  align-items: center;
}

h1 {
  margin-bottom: 20px;
  font-size: 24px;
  text-align: center;
}

.setting-item {
  width: 100%;
  padding: 10px 0;
}

.exchange-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #3f3f3f;
  color: #fff;
  border: 2px solid transparent;
  padding: 12px 20px;
  font-size: 18px;
  border-radius: 25px;
  width: 100%;
  cursor: pointer;
  transition: border-color 0.3s ease-in-out;
}

.exchange-button:hover {
  border-color: #8d8d8d;
}

.arrow-icon {
  width: 20px;
  height: 20px;
}

.toggle-switch {
  width: 40px;
  height: 20px;
  background: #444;
  border-radius: 15px;
  position: relative;
  transition: background 0.3s;
}

.toggle-switch.active {
  background: #007aff;
}

.toggle-switch .switch {
  width: 18px;
  height: 18px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 3px;
  transform: translateY(-50%);
  transition: transform 0.3s;
}

.toggle-switch.active .switch {
  transform: translate(18px, -50%);
}

footer {
  padding: 20px;
  text-align: center;
  font-size: 14px;
  color: #888;
  cursor: pointer;
}

footer:hover {
  color: #fff;
}
</style>

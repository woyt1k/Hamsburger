<template>
  <div class="settings-overlay">
    <div class="settings-menu">
      <div class="menu-content">
        <h1>Настройки</h1>
        <div class="setting-item">
          <p>Сменить язык</p>
          <button class="arrow-button" @click="changeLanguage">
            {{ settings.language }}
          </button>
        </div>
        <div class="setting-item">
          <p>Сменить биржу</p>
          <button class="arrow-button" @click="changeExchange">
            {{ settings.exchange }}
          </button>
        </div>
        <div class="setting-item toggle">
          <p>Вибрация</p>
          <div
            class="toggle-switch"
            :class="{ active: settings.vibrationEnabled }"
            @click="toggleVibration"
          >
            <div class="switch"></div>
          </div>
        </div>
        <div class="setting-item toggle">
          <p>Анимация</p>
          <div
            class="toggle-switch"
            :class="{ active: settings.animationEnabled }"
            @click="toggleAnimation"
          >
            <div class="switch"></div>
          </div>
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
        animationEnabled: JSON.parse(localStorage.getItem("animationEnabled")) ?? true, // Загружаем из localStorage
        vibrationEnabled: JSON.parse(localStorage.getItem("vibrationEnabled")) ?? true, // Загружаем из localStorage
      },
    };
  },
  methods: {
    toggleAnimation() {
      this.settings.animationEnabled = !this.settings.animationEnabled;
      localStorage.setItem(
        "animationEnabled",
        JSON.stringify(this.settings.animationEnabled)
      );

      // Применяем или убираем класс disable-animations
      const body = document.body;
      if (this.settings.animationEnabled) {
        body.classList.remove("disable-animations");
      } else {
        body.classList.add("disable-animations");
      }

      console.log(
        `Анимация: ${this.settings.animationEnabled ? "включена" : "выключена"}`
      );
    },
    toggleVibration() {
      this.settings.vibrationEnabled = !this.settings.vibrationEnabled;
      localStorage.setItem(
        "vibrationEnabled",
        JSON.stringify(this.settings.vibrationEnabled)
      );

      if (this.settings.vibrationEnabled) {
        if (navigator.vibrate) {
          navigator.vibrate(200); // Вибрация длительностью 200 мс
        }
        console.log("Вибрация включена");
      } else {
        console.log("Вибрация выключена");
      }
    },
    changeLanguage() {
      this.settings.language =
        this.settings.language === "Русский" ? "English" : "Русский";
      console.log(`Язык изменён на: ${this.settings.language}`);
    },
    changeExchange() {
      this.settings.exchange =
        this.settings.exchange === "Bybit" ? "Binance" : "Bybit";
      console.log(`Биржа изменена на: ${this.settings.exchange}`);
    },
    showPrivacyPolicy() {
      console.log("Открытие политики конфиденциальности...");
    },
  },

  mounted() {
    const { tg } = useTelegram();

    // Применяем настройку анимации при загрузке
    const body = document.body;
    if (!this.settings.animationEnabled) {
      body.classList.add("disable-animations");
    }

    try {
      tg.BackButton.show();
      tg.BackButton.onClick(() => {
        console.log('Кнопка "Назад" нажата в SettingsMenu');
        if (this.$router) {
          this.$router.push("/");
        } else {
          console.error("Маршрутизатор ($router) недоступен");
        }
      });
    } catch (error) {
      console.error("Ошибка при активации кнопки 'Назад':", error);
    }
  },
  unmounted() {
    const { tg } = useTelegram();

    try {
      if (tg.BackButton) {
        tg.BackButton.hide();
        tg.BackButton.offClick();
      }
    } catch (error) {
      console.error("Ошибка при отключении кнопки 'Назад':", error);
    }
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
  gap: 20px;
  align-items: center;
}

h1 {
  margin-bottom: 20px;
  font-size: 24px;
  text-align: center;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 15px;
  border-bottom: 1px solid #333;
}

.setting-item p {
  margin: 0;
  font-size: 18px;
}

.arrow-button {
  background: none;
  border: none;
  color: #007aff;
  font-size: 16px;
  cursor: pointer;
}

.toggle-switch {
  width: 50px;
  height: 25px;
  background: #444;
  border-radius: 15px;
  position: relative;
  cursor: pointer;
  transition: background 0.3s;
}

.toggle-switch.active {
  background: #007aff;
}

.toggle-switch .switch {
  width: 23px;
  height: 23px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 1px;
  left: 1px;
  transition: transform 0.3s;
}

.toggle-switch.active .switch {
  transform: translateX(25px);
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

<style>
.disable-animations * {
  animation: none !important;
  transition: none !important;
}
</style>
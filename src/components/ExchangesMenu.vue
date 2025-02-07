<template>
  <div class="exchange-overlay">
    <div class="exchange-menu">
      <div class="menu-content">
        <h1>Сменить биржу</h1>
        <div v-for="exchange in exchanges" :key="exchange.name" class="exchange-item">
          <button
            class="exchange-button"
            @click="selectExchange(exchange.name, exchange.logo)"
          >
            <img :src="exchange.logo" :alt="exchange.name + ' Logo'" class="exchange-logo" />
            <span class="exchange-name">{{ exchange.name }}</span>
            <img src="@/assets/arrow.png" alt="Arrow" class="arrow-icon" />
          </button>
        </div>
        <div v-if="selectedExchangeLogo" class="selected-exchange-logo">
          <h2>Вы выбрали биржу:</h2>
          <img :src="selectedExchangeLogo" alt="Selected Exchange Logo" class="selected-logo" />
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import binanceLogo from "@/assets/binance.png";
import bybitLogo from "@/assets/bybit.png";
import okxLogo from "@/assets/okx.png";
import bingxLogo from "@/assets/bingx.png";

export default {
  data() {
    return {
      exchanges: [
        { name: "Binance", logo: binanceLogo },
        { name: "Bybit", logo: bybitLogo },
        { name: "Okx", logo: okxLogo },
        { name: "BingX", logo: bingxLogo },
      ],
      selectedExchangeLogo: null,
    };
  },
  methods: {
    selectExchange(exchangeName, exchangeLogo) {
  try {
    console.log(`Вы выбрали биржу: ${exchangeName}`);
    localStorage.setItem("selectExchange", exchangeName);
    this.selectedExchangeLogo = exchangeLogo;

    window.dispatchEvent(
      new CustomEvent("show-toast", {
        detail: {
          message: `Вы успешно выбрали биржу: ${exchangeName}`,
          logo: exchangeLogo,
        },
      })
    );

    this.$router.push("/");
  } catch (error) {
    console.error("Ошибка при выборе биржи:", error);
  }
}

  },
};
</script>

<style scoped>
.exchange-overlay {
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

.exchange-menu {
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
  margin-bottom: 15px;
  font-size: 24px;
  text-align: center;
}

.exchange-item {
  width: 100%;
  padding: 15px;
  margin-bottom: -20px;
  font-family: 'Bangers', sans-serif;
}

.exchange-button {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: #3f3f3f;
  color: #fff;
  border: 2px solid transparent;
  padding: 15px 20px;
  font-size: 18px;
  border-radius: 25px;
  width: 100%;
  cursor: pointer;
  transition: border-color 0.3s ease-in-out;
  font-family: 'Bangers', sans-serif;
}

.exchange-button:hover {
  border-color: #8d8d8d;
}

.exchange-logo {
  width: 40px;
  height: 40px;
  margin-right: 15px;
}

.exchange-name {
  margin-right: auto;
}

.arrow-icon {
  width: 20px;
  height: 20px;
  margin-left: 10px;
}

.selected-exchange-logo {
  margin-top: 20px;
  text-align: center;
}

.selected-logo {
  margin-top: 10px;
  width: 100px;
  height: 100px;
  object-fit: contain;
}
</style>

<style>
.disable-animations * {
  animation: none !important;
  transition: none !important;
}
</style>
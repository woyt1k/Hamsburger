export function useTelegram() {
  const tg = window.Telegram.WebApp;

  const isVibrationEnabled = () => {
    return JSON.parse(localStorage.getItem('vibrationEnabled')) ?? true; // Проверяем настройку вибрации
  };

  const triggerHapticFeedback = (type = 'impact', options = { style: 'light' }) => {
    if (!isVibrationEnabled()) {
      console.log("Вибрация отключена пользователем.");
      return; // Вибрация отключена, выходим
    }

    if (tg?.HapticFeedback) {
      try {
        switch (type) {
          case 'impact':
            tg.HapticFeedback.impactOccurred(options.style || 'light');
            break;
          case 'notification':
            tg.HapticFeedback.notificationOccurred(options.style || 'success');
            break;
          case 'selection':
            tg.HapticFeedback.selectionChanged();
            break;
          default:
            // Неверный тип Haptic Feedback
        }
      } catch (err) {
        console.error("Ошибка Telegram Haptic Feedback API:", err);
      }
    } else if (navigator.vibrate) {
      // Web Vibrations API (fallback)
      try {
        navigator.vibrate(options.duration || 50);
      } catch (err) {
        console.error("Ошибка Web Vibrations API:", err);
      }
    } else {
      // Ни Haptic Feedback, ни вибрация недоступны
      console.warn("Haptic Feedback или Vibrations API недоступны.");
    }
  };

  const enableGlobalHapticFeedback = () => {
    document.addEventListener('click', (event) => {
      if (event.target.tagName === 'BUTTON') {
        triggerHapticFeedback('impact', { style: 'light' });
      }
    });
  };

  const showBackButton = (onClickCallback) => {
    if (tg.BackButton) {
      tg.BackButton.show();
      if (onClickCallback) {
        tg.BackButton.onClick(onClickCallback);
      }
    }
  };

  const hideBackButton = () => {
    if (tg.BackButton) {
      tg.BackButton.hide();
      tg.BackButton.offClick();
    }
  };

  return {
    tg,
    user: tg.initDataUnsafe?.user,
    telegramId: tg.initDataUnsafe?.user?.id,
    showBackButton,
    hideBackButton,
    triggerHapticFeedback,
    enableGlobalHapticFeedback,
  };
}

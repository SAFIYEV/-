export function useTelegram() {
    const tg = window.Telegram?.WebApp;
  
    return {
      tg: tg || {},
      user: tg?.initDataUnsafe?.user || null,
    };
  }


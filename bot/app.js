import { Telegraf, Markup } from 'telegraf';

const token = '8157631291:AAHHF6HvP-MeYLJ5p48pgA2MGcySu79zJVg'
const webAppUrl = 'https://gamburger-cliker.web.app/'
const telegramChannelUrl = 'https://t.me/crypto_mother'

const bot = new Telegraf(token)

bot.command('start', (ctx) => {
  ctx.reply(
    'Привет, нажми кнопку чтобы начать',
    Markup.inlineKeyboard([
      Markup.button.url('Перейти в канал', telegramChannelUrl), 
      Markup.button.webApp(
        'Открыть приложение',
        `${webAppUrl}?ref=${ctx.payload}&webview=fullscreen`
      )
    ])
  )
})

bot.launch()

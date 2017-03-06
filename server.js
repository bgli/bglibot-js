const Telegraf = require('telegraf')

const bot = new Telegraf(process.env.TOKEN)

bot.telegram.setWebhook('https://aliando.gomix.me/telegram-webhook')

bot.startWebhook('/telegram-webhook',null,3000)

bot.on('text', (ctx) => {
  console.log(ctx)
  ctx.reply('Hey there!')
})

bot.on('sticker', (ctx) => {
  console.log(ctx)
  ctx.reply('I love sticker too')
})

// Command
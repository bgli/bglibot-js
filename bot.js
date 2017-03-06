const Telegraf = require('telegraf')
const commands = require('./commands')

const bot = new Telegraf(process.env.TOKEN)

bot.telegram.setWebhook('https://aliando.gomix.me/webhook')


// Handle Message
bot.on('message', (ctx) => {
  
  commands.handleMessage(ctx)
  
})


bot.catch((err) => {
  console.log('Ooops', err)
})

module.exports = bot
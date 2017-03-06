const Telegraf = require('telegraf')

const bot = new Telegraf(process.env.TOKEN)

bot.telegram.setWebhook('https://aliando.gomix.me/telegram-webhook')

bot.startWebhook('/telegram-webhook',null,3000)


// Handle on Text Message
bot.on('text', (ctx) => {
  console.log(ctx.update)
  
  if(ctx.update.message.chat.type == 'group' || ctx.update.message.chat.type == 'supergroup'){
    handleGroupText(ctx)
  }
  

})

// Handle Message
bot.on('message', (ctx) => {
  console.log(ctx.update)
  
  // Wellcome Message
  if(ctx.update.message.new_chat_member != null){
    let member = ctx.update.message.new_chat_member
    let group  = ctx.update.message.chat
    
    let greetings = 'Halo <b>'+member.first_name+'</b> (@'+member.username+')\n\nSelamat datang  di Group <b>'+group.title+'</b>\n👋'
    
    ctx.replyWithHTML(greetings);
  }
  
})


// Handle Sticker Message
bot.on('sticker', (ctx) => {
  console.log(ctx)
  ctx.reply('I love sticker too')
})

// Command
var handleGroupText = (ctx) => {
  let message = ctx.update.message.text
  
  switch (message) {
    case "!rules":
      ctx.reply('Aturan masih dibikin 😅')
      break;
      
    case "!ping":
      ctx.reply('Pong !')
      break
      
    default:
      break;
      
  }
}
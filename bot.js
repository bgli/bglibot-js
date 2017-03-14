const Telegraf = require('telegraf')
const TelegrafWit = require('telegraf-wit')
const commands = require('./commands')

const bot = new Telegraf(process.env.TOKEN)
const wit = new TelegrafWit(process.env.WIT)

bot.telegram.setWebhook('https://bglibot.glitch.me/webhook')


bot.use(Telegraf.memorySession())

// Handle Message
bot.on('message', (ctx, next) => {
  
  commands.handleMessage(ctx)
  return next()
  
})

bot.use(wit.middleware())

// wit.on('message',(ctx)=>{
  
//   if(ctx.chat.type == 'private'){
    
//     console.log("Confidence answer: "+ctx.wit.confidence)
    
//     if (ctx.wit.confidence > 0.05) {
//       ctx.reply(ctx.wit.message)
//     }else{
//       console.log(ctx.wit)
//       ctx.reply(ctx.wit.message)
//     }
    
//   }
  
// })

wit.on('get-members',(ctx)=>{
  //console.log(ctx.wit.entities)
  
  ctx.telegram.sendChatAction(ctx.chat.id,'typing')
  
  ctx.getChatMembersCount()
    .then((data) => {
        //ctx.wit.context.members = data
        ctx.replyWithMarkdown(`Jumlah membernya ada *${data}* orang kak.`)
    })
})



bot.catch((err) => {
  console.log('Ooops', err)
})

module.exports = bot
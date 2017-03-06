const Telegraf = require('telegraf')
const TelegrafWit = require('telegraf-wit')

const wit = new TelegrafWit(process.env.WIT_TOKEN)
const bot = new Telegraf(process.env.TOKEN)

bot.telegram.setWebhook('https://aliando.gomix.me/webhook')

// Session for storing story context
bot.use(Telegraf.memorySession())

// Add wit conversation middleware
bot.use(wit.middleware())


//bot.startWebhook('/telegram-webhook',null,3000)


// Handle Message
wit.on('message', (ctx) => {
  
  console.log(ctx.wit.message)

  if(ctx.updateType == 'message'){
    
    let subType = ctx.updateSubType
    
    switch (ctx.updateSubType) {
      case 'text':
        handleTextMessage(ctx)
        break
      case 'new_chat_member':
        handleGreetings(ctx)
        break
      case 'left_chat_member':
        console.log(ctx)
        break  
        
    }
    
  }else if(ctx.updateType == 'inline_query'){
    
    // TODO: Inline query
    
  }
  
})


// Handle Text Message
var handleTextMessage = (ctx) => {
  console.log(`${ctx.message.chat.title} : @ ${ctx.from.first_name} => ${ctx.message.text}`)
  
  if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup'){
    handleGroupText(ctx)
  }else if(ctx.chat.type == "private"){
    ctx.reply(ctx.wit.message)
  }

}

// Handle Greetings 
var handleGreetings = (ctx) => {
  let member = ctx.message.new_chat_member
  let group  = ctx.chat
    
  let greetings = `Halo <b>${member.first_name}</b>!\n\nSelamat datang  di Group <b>${group.title}</b>`
    
  ctx.replyWithHTML(greetings);
}


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
      
    case "!members":
      ctx.getChatMembersCount()
        .then((data)=>{
          ctx.reply(`Jumlah Anggota: ${data}`)
        })
      
      break
      
    default:
      break;
      
  }
}

wit.on('error', (ctx) => {
  console.error('wit error', err)
})

module.exports = bot
const Telegraf = require('telegraf')
const TelegrafWit = require('telegraf-wit')

const wit = new TelegrafWit(process.env.WIT_TOKEN)
const bot = new Telegraf(process.env.TOKEN)

bot.telegram.setWebhook('https://aliando.gomix.me/webhook')

//bot.startWebhook('/telegram-webhook',null,3000)


// Handle Message
bot.on('message', (ctx) => {
  
  
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
          console.log(data)
          ctx.reply(`Jumlah Anggota: ${data}`)
        })
      
      break
      
    default:
      // Lempar ke AI
      handleWit(ctx)
      break;
      
  }
}

var handleWit = (ctx) => {
  return wit.meaning(ctx.message.text)
    .then((result) => {
      var witResult = JSON.stringify(result, null, 2)
      console.log(witResult)
      ctx.telegram.sendMessage(-1001085483555,witResult)
    })
}


wit.on('error', (ctx) => {
  console.error('wit error', err)
})

module.exports = bot
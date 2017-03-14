var commands = {

    handleMessage(ctx) {

        if (ctx.updateType == 'message') {

            let subType = ctx.updateSubType

            switch (ctx.updateSubType) {

                case 'text':
                    this.handleTextMessage(ctx)
                    break

                case 'new_chat_member':
                    this.handleGreetings(ctx)
                    break

                case 'left_chat_member':
                    console.log(ctx)
                    break

            }

        } else if (ctx.updateType == 'inline_query') {

            console.log('Inline query :D')
            console.log(ctx)

        }

    },

    handleTextMessage(ctx) {

        console.log(`${ctx.message.chat.title ? ctx.message.chat.title : 'private'} : @ ${ctx.from.first_name} => ${ctx.message.text}`)

        if (ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {

            this.handleGroupText(ctx)

        } else if (ctx.chat.type == "private") {

            this.handlePrivate(ctx)

        }

    },

    handleGreetings(ctx) {

        let member = ctx.message.new_chat_member
        let group = ctx.chat

        let greetings = `Halo <b>${member.first_name}</b>!\n\nSelamat datang  di Group <b>${group.title}</b>`

        ctx.replyWithHTML(greetings)

    },

    handleGroupText(ctx) {
        //console.log(ctx.update)

        let message = ctx.message.text

        switch (message) {
            case "!rules":

                ctx.replyWithHTML(
                  '<b>Peraturan</b>\n\nBaca: <a href="http://telegra.ph/Peraturan-BGLI-03-07">Peraturan Group BGLI</a>',
                  {'reply_to_message_id':ctx.message.message_id}
                )
            
                break;

            case "!ping":
            
                ctx.replyWithMarkdown('*Pong!!!*',{'reply_to_message_id':ctx.message.message_id})
            
                break
                
            case "!source":
                ctx.replyWithHTML('Bantuin donk biar aku jadi pinter, buka repo github ini <a href="https://github.com/bgli/bglibot-js">bgli/bglibot-js</a>')
                break;

            case "!members":
            
                ctx.telegram.sendChatAction(ctx.chat.id,'typing')

                ctx.getChatMembersCount()
                    .then((data) => {
                        ctx.replyWithMarkdown(`*Jumlah Anggota*: ${data}`,{'reply_to_message_id':ctx.message.message_id})
                    })

                break
                
            case "!ss":
                
                if(ctx.message.reply_to_message != null){
                  
                  let idToReply = ctx.message.reply_to_message.message_id
                  ctx.replyWithMarkdown('Kirimkan _Screenshot_ biar lebih jelas gan!',{'reply_to_message_id':idToReply})
                  
                }
            
                break
          
            case "!report":
                
                if(ctx.message.reply_to_message != null){
                  
                  let idToReply = ctx.message.reply_to_message.message_id
                  ctx.replyWithMarkdown('*Siap!* \nTerimakasih laporanya 👮 ',{'reply_to_message_id':idToReply})
                  ctx.telegram.sendMessage(
                    '-1001102321498', // Admin BGLI Group
                    `👮 <b>Laporan Post !</b>\n\nReport by: <b>${ctx.message.from.first_name}</b>\nMessage : <a href="https://t.me/${ctx.chat.username}/${idToReply}">Reported Message</a>`,
                    {'parse_mode':'HTML'}
                  )
                  
                }
            
                break
            
            
            default:
                break;

        }

    },

    handlePrivate(ctx) {
        //return ctx.replyWithHTML('Tidak menerima Pesan Pribadi untuk saat ini, <b>Maaf yaa!</b>')
    }

}



module.exports = commands
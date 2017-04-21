const config = require('./config');
const fs = require('fs')
const moment = require('moment-timezone')

var commands = {
  
    pawang : [
      17648054, // Sucipto  
    ],
  
    manualSource : [
      -1001085483555, // Control Test
      -1001034868528, // BGLI
      -1001084078003 // GIMPSCAPE Testing
    ],
  
    rumahMiranda : [
      -1001034868528, // BGLI
    ],
  
    controlGroup : [
      -1001085483555
    ],

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
                    console.log(ctx.message)
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
        
        ctx.replyWithHTML(`Selamat datang ${member.first_name} 😊`)

    },

    handleGroupText(ctx) {
        //console.log(ctx.message)

        let message = ctx.message.text
        
        // Filtering Group
        if(this.rumahMiranda.indexOf(ctx.message.chat.id) == -1){
          
          // Command list that only work for known group
          let commandList = ['!rules','!report','!kulgram','!simpan']
          
          if(commandList.indexOf(ctx.message.text) != -1){
            ctx.replyWithHTML('Aku lagi dimana ini? 😰\n<b>#diculik</b>')
            return
          }
          
        }

        switch (message) {
            case "!rules":

                ctx.replyWithHTML(
                  '<b>Peraturan</b>\n\nBaca: <a href="http://telegra.ph/Peraturan-BGLI-03-07">Peraturan Grup BGLI</a>',
                  {'reply_to_message_id':ctx.message.message_id}
                )
            
                break;

            case "!ping":
            
                ctx.replyWithMarkdown('*Pong!!!* 🙄',{'reply_to_message_id':ctx.message.message_id})
            
                break
                
            case "!source":
                ctx.replyWithHTML('Kepoin kita dong sist, buka repo github ini <a href="https://github.com/bgli/bglibot-js">bgli/bglibot-js</a>')
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
                
            case "!kulgram":
                
                // Only allow mimin
                let isAdmin = false
                
                if(this.pawang.indexOf(ctx.message.from.id) == -1){
                  console.log("Non pawang 🙄")
                  isAdmin = false
                }else{
                  isAdmin = true
                }
                
                if(isAdmin){
                  
                  if(ctx.session.kuliah){
                    ctx.session.kuliah = false
                    ctx.reply("#kulgram selesai 😇")
                    
                    let fileName = `./storage/kulgram-${moment().tz("Asia/Jakarta").format('YYYYMMDD')}.txt`
                    
                    fs.open(fileName, "r", function(error, data) {
                      console.log(data);
                      
                      //ctx.telegram.sendDocument(ctx.message.chat.id,data)
                      
                    });
                    
                  }else{
                    ctx.session.kuliah = true
                    ctx.reply("#kulgram dimulai, yay 🤷‍")
                  }
                  
                }else{
                  ctx.reply("Kuliah libur 😋")
                }
                    
            
                break;
          
            case "!report":
            
                console.log(ctx.message)
                
                if(ctx.message.reply_to_message){
                  
                  let idToReply = ctx.message.reply_to_message.message_id
                  ctx.replyWithMarkdown('👮 Terimakasih laporanya 👮 ',{'reply_to_message_id':idToReply})
                  ctx.telegram.sendMessage(
                    '-1001102321498', // Admin BGLI Group
                    `👮 <b>Laporan Post !</b>\n\n ${ctx.message.reply_to_message.from.first_name} : ${ctx.message.reply_to_message.text}\n\nReport by: <b>${ctx.message.from.first_name}</b>\nMessage : <a href="https://t.me/${ctx.chat.username}/${idToReply}">Reported Message</a>`,
                    {'parse_mode':'HTML'}
                  )
                  
                }else{
                  ctx.replyWithMarkdown('Post mana yang mau dilaporkan? 😕')
                }
            
                break
            
            case "!simpan":
                            
                //console.log(ctx.message)
            
                if(ctx.message.reply_to_message){
                  
                  let message = ctx.message.reply_to_message
                  
                  if(message.text){
                    let bookmark = "#bookmark\n"
                    
                    bookmark += `<b>${message.from.first_name} ${message.from.last_name || '' }</b> (${'@'+message.from.username || '<i>no_username</i>'}): `
                    bookmark += message.text
                    bookmark += "\n\n"
                    //bookmark += `<b>Pelaku: ${ctx.message.from.first_name}</b>\n`
                    bookmark += `<b>Link:</b> <a href="https://t.me/GNULinuxIndonesia/${message.message_id}">Lihat</a>`
                    
                    ctx.telegram.sendMessage('@BGLIArsip',bookmark,{parse_mode:'HTML'})
                    
                    ctx.replyWithMarkdown('Sip, #bookmark sudah diarsipkan 💾\nCheck [disini](https://t.me/BGLIArsip)',{'reply_to_message_id':ctx.message.message_id})
                  }
                }
            
                break
            
            default:
                this.handleManual(ctx);
                
                // Logger
                this.handleLogger(ctx);
                break;

        }

    },

    handlePrivate(ctx) {
        //return ctx.replyWithHTML('Tidak menerima Pesan Pribadi untuk saat ini, <b>Maaf yaa!</b>')
    },
  
    handleManual(ctx){
      
        //console.log(ctx.message)
        
        let isAdmin = false
      
        // Only Allow from list Manual Group
        if(this.manualSource.indexOf(ctx.message.chat.id) == -1){
          //console.log("Bukan dari group whitelist manual, Skip!")
          return
        }
      
        // Only allow mimin
        if(this.pawang.indexOf(ctx.message.from.id) == -1){
          //console.log("Non pawang 🙄")
        }else{
          isAdmin = true
        }
        
        
        let message = ctx.message.text
        
        // Control your bot 😼
        if(config.manual){
          
          if(isAdmin && message == '!auto' && this.controlGroup.indexOf(ctx.message.chat.id) > -1){
            
            ctx.reply("Autopilot : ON")
            
            config.manual = false
            config.save()
            return
            
          }
          
          // Forward to control group
          if(this.controlGroup.indexOf(ctx.message.chat.id) == -1){
            ctx.telegram.sendMessage('-1001085483555', `${ctx.message.from.first_name} : ${ctx.message.text}`)
          }
          
          // If pawang send reply to group 
          if(isAdmin && this.controlGroup.indexOf(ctx.message.chat.id) > -1){
            ctx.telegram.sendMessage('-1001034868528', ctx.message.text)
          }
          
        }else{
          
          if(isAdmin && message == '!manual' && this.controlGroup.indexOf(ctx.message.chat.id) > -1){
            ctx.reply('Autopilot : OFF')
            
            config.manual = true
            config.save()
          }
          
        }
      
        //console.log(`Manual mode? ${config.manual}`)
        //console.log(`Kuliah mode? ${ctx.session.kuliah}`)
        
        //ctx.telegram.sendMessage('-1001085483555', `From: ${ctx.chat.title}\nMsg ID:${ctx.message.message_id}\nMessage: ${ctx.message.text}`)
    },
  
    handleLogger(ctx){
      if(ctx.session.kuliah){
        
        //console.log(ctx.message)
        
        let fileName = `./storage/kulgram-${moment().tz("Asia/Jakarta").format('YYYYMMDD')}.txt`
        let logMessage = `${moment.unix(ctx.message.date).tz("Asia/Jakarta").format('YY-MM-DD hh:mm:ss')}: ${ctx.message.from.first_name} > ${ctx.message.text}\n`
        
        console.log(logMessage)
        
        fs.appendFile(fileName, logMessage, function (err) {
          if (err) throw err;
          console.log('Log Saved!');
        });
        
      }else{
        //console.log('LOGER: Sedang tidak kuliah')
      }
    }


}



module.exports = commands
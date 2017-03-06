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

        }

    },

    handleTextMessage(ctx) {

        console.log(`${ctx.message.chat.title} : @ ${ctx.from.first_name} => ${ctx.message.text}`)

        if (ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {

            this.handleGroupText(ctx)

        } else if (ctx.chat.type == "private") {

            commands.handlePrivate(ctx)

        }

    },

    handleGreetings(ctx) {

        let member = ctx.message.new_chat_member
        let group = ctx.chat

        let greetings = `Halo <b>${member.first_name}</b>!\n\nSelamat datang  di Group <b>${group.title}</b>`

        ctx.replyWithHTML(greetings)

    },

    handleGroupText(ctx) {

        let message = ctx.message.text

        switch (message) {
            case "!rules":

                ctx.reply('Aturan masih dibikin 😅')
                break;

            case "!ping":

                ctx.reply('Pong !')
                break

            case "!members":

                ctx.getChatMembersCount()
                    .then((data) => {
                        ctx.reply(`Jumlah Anggota: ${data}`)
                    })

                break

            default:
                break;

        }

    },

    handlePrivate(ctx) {
        ctx.replyWithHTML('Bantuin donk biar aku jadi pinter, buka repo github ini <a href="https://github.com/bgli/aliando">bgli/aliando</a>')
    }

}



module.exports = commands
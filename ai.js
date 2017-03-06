const TelegrafWit = require('telegraf-wit')

const wit = new TelegrafWit(process.env.WIT_TOKEN)

var ai = {};

ai.wit = wit
ai.handle = (ctx) => {
    //console.log('Wit ')
    return this.wit.getMeaning(ctx.message.text)
        .then((result) => {
            console.log(JSON.stringify(result,null,2))
        })
}


wit.on('error',(ctx)=>{
    console.error('wit error', err)
})

module.exports = ai
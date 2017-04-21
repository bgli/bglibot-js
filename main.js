var express = require('express')
var bot = require('./bot')
var parser = require('body-parser')
var app = express()


app.use(express.static('public'))
app.use(parser.json())

//app.use(bot.webhookCallback('/webhook'))

app.get('/', (request, response) => {
    response.sendFile(__dirname + '/views/index.html')
})

app.post('/webhook', (request, response) => {
    
    let body = request.body
    
    //console.log(request.body)
    
    bot.handleUpdate(body, response.sendStatus(200))

})




var listener = app.listen(3000, ()=>{
  console.log('Running...')
})
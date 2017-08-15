const fb = require('firebase')

const API_KEY = process.env.FIREBASE_KEY
const PROJECT_ID = process.env.FIREBASE_PROJECT


var config = {
  apiKey: API_KEY,
  authDomain: `${PROJECT_ID}.firebaseapp.com`,
  databaseURL: `https://${PROJECT_ID}.firebaseio.com`,
};

fb.initializeApp(config);

var firebase = {}

firebase.database = fb.database()

firebase.logMessage = (message) => {
  
    // Group Data
  let groupId = message.chat.id
  let groupName = message.chat.title
  let groupUsername = message.chat.username
  let groupType = message.chat.type
  
  // Store group Info
  let groupRef = firebase.database.ref(`groups/info/${groupId}`)
  
  groupRef.once('value').then(snapshot => {
    
    if(!snapshot.val()){
      groupRef.set({
        id: groupId,
        name: groupName,
        type: groupType,
        username: groupUsername || null
      })
    }
    
  })
  
  // Store group chat log
  let chatRef = firebase.database.ref(`groups/chat/${groupId}/${message.message_id}`)
  
  chatRef.set(message)
}

firebase.middleware = (ctx,next) => {
  

  let message = ctx.message
  let database = firebase.database
  
  // Log Group only
  if(!(message.chat.type == 'group' || message.chat.type == 'supergroup')){
    console.log('LOGGER: Dari private')
    
    if(message.from.id == 17648054){
      console.log('Hi Mimin')
      if(message.text =='destroyalldatabase'){
        ctx.reply('Tunggu ya mz!!')
        firebase.database.ref('groups').remove()
        ctx.reply('Deleted Mz!!!!!')
      }
      
      if(ctx.updateSubType == 'photo'){
        //console.log(ctx.message)
        let photoId = ctx.message.photo[2].file_id
        console.log(photoId)
        console.log(`Photo ID: ${photoId}`)
        
        ctx.telegram.getFileLink(photoId)
          .then((data) => console.log(data))
      }
    }
    
    return next()
  }
  
  // Log Message type only
  if(ctx.updateType != 'message'){
    return next()
  }
  
  
  firebase.logMessage(message)
  
  
  return next()
}

module.exports = firebase
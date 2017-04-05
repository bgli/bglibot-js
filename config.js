const fs = require('fs')
const configFile = './config.json'

var config = require(configFile)

config.save = function(){
  
  fs.writeFile(configFile, JSON.stringify(this, null, 2), function (err) {
      if (err) return console.error(err)
      
      console.log('Config saved!')

  })
  
}

module.exports = config
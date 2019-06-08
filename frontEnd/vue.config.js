// vue.config.js
module.exports = {
    configureWebpack:{
    }, 
    devServer:{
      host: 'localhost',
      hot:true,
      port: 8080,  
      open: 'Chrome',
      proxy: { //https://cli.vuejs.org/guide/html-and-static-assets.html#disable-index-generation
        '/api':{ 
          target: 'http://localhost:3000',
          secure: false,
          ws: false,
        }
      }
    }
  }
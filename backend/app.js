var express = require('express')
var app = express()

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
    res.header("Access-Control-Allow-Credentials", "true");
    if (req.method == "OPTIONS") {
      res.send(200);
    }
    else {
        console.log(req)
      next();
    }
    // next()
  });

app.get('/',function(req,res){
    console.log(req)
    
    // let reqn=JSON.stringify(req)
    let tokens = req.get('Authorization')
    // res.json({
    //     data:'fdsafd',
    //     token:req.headers.authorization,
    //     str:tokens
    // })
    // res.send(reqn)
    res.send('jjjj')
})

app.listen(3000,function(){
    console.log("正在监听....")
})
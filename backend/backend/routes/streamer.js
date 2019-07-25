var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
var streamerDao = require('./../db/streamerDao')
var infoListDao = require('./../db/infoListDao')
const KEY = require('./../lib/secret')

//校验，拿到token里的主播id
router.use(function(req,res,next){
    let token = req.headers.authorization
    //debug
    let arr = token.split(" ")
    token=arr[1]
    //
    if(token){
      //校验token
      const payload = jwt.verify(token, KEY);
      //获取主播unionid，如果一个主播只有一个直播间
      const { profileId } = payload
      //检查主播有没有用过,没有用过就插入表格
      req.profileId = profileId
    }
    next()
})



/* GET streamer listing. */
router.post('/getList', function(req, res) {
  infoListDao.queryById(req.profileId).then((result)=>{
    console.log(result)
     if(!result || typeof result == undefined){
      streamerDao.add(profileId)
    }
    res.json({
      code:0,
      msg:"success",
      data:result
    })
  }).catch(err=>{
      res.json({
        code:1,
        msg:err.message
    })
  })
  
});

router.post('/addList',function(req, res){
    infoListDao.add(req.profileId, req.query.list_key, req.query.list_value).then((result)=>{
        res.json({
            code:0,
            msg:"success"
        })
    }).catch(err=>{
        res.json({
            code:1,
            msg:err.message
        })
    })
})

router.post('/updateList',function(req, res){
    infoListDao.update(req.query.id, req.query.list_key, req.query.list_value).then((result)=>{
        res.json({
            code:0,
            msg:"success"
        })
    }).catch(err=>{
        res.json({
            code:1,
            msg:err.message
        })
    })
})

router.post('/deleteList',function(req, res){
    infoListDao.delete(req.query.id).then((result)=>{
        res.json({
            code:0,
            msg:"success"
        })
    }).catch(err=>{
        res.json({
            code:1,
            msg:err.message
        })
    })
})

module.exports = router;

var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
var streamerDao = require('./../db/streamerDao')
const KEY = require('./../lib/secret')

//校验，拿到token里的主播id
router.use('/getList',function(req,res,next){
    // const token = req.headers.authorization
    // if(token){
    //   //校验token
    //   const payload = jwt.verify(token, KEY);
    //   //获取主播unionid，如果一个主播只有一个直播间
    //   const { profileId } = payload
    //   //检查主播有没有用过,没有用过就插入表格
    //   let result = streamerDao.queryById(profileId)
    //   if(!result || typeof result == undefined){
    //     streamerDao.add(profileId)
    //   }
    // }
    streamerDao.add(23)
    next()
})



/* GET streamer listing. */
router.post('/getList', function(req, res, next) {
  res.json({
    data:'431'
  });
});

module.exports = router;

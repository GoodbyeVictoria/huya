var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
const KEY = require('./../lib/secret')

/* GET streamer listing. */
router.use(function(req,res,next){
    const token = req.headers.authorization
    //校验token
    const payload = jwt.verify(token, KEY);
    //获取主播unionid
    const { profileId } = payload
    next()
})
router.get('/getList', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;

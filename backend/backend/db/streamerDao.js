var $sql = require('./sqlMapping')
var mysql = require('mysql')
var db = require('./mysql')

var pool = mysql.createPool({
    connectionLimit:10,
    ...db.mysql
})

var jsonWrite = function (res, ret) {
	if(typeof ret === 'undefined') {
		res.json({
			code:'1',
			msg: '操作失败'
		});
	} else {
		res.json(ret);
	}
}

module.exports = {
    add:function(streamerId){
        pool.getConnection(function(err, connection) {
			// 获取前台页面传过来的参数
			// var param = req.query || req.params;
 
			// 建立连接，向表中插入值
            // 'INSERT INTO user(id, name, age) VALUES(0,?,?)',
			connection.query($sql.streamer.insert, [streamerId], function(err, result) {
				if(result) {
					
                    console.log(result)   
                }
                console.log(result+"88888")
				// 以json形式，把操作结果返回给前台页面
                // jsonWrite(res, result);
                // res.json({
                //     code:'0',
                //     msg: '操作成功'
                // });
				// 释放连接 
				connection.release();
			})
		})
    },
    queryById:function(streamerId){
        pool.getConnection(function(err, connection) {
			// 获取前台页面传过来的参数
			// var param = req.query || req.params;
 
			// 建立连接，向表中插入值
			// 'INSERT INTO user(id, name, age) VALUES(0,?,?)',
			connection.query($sql.streamer.queryById, [streamerId], function(err, result) {
                console.log(streamerId)
				if(result) {
					console.log(result) 
				}
				// 以json形式，把操作结果返回给前台页面
				// jsonWrite(res, result);
				// 释放连接 
                connection.release();
                return result
			})
		})
    },
}
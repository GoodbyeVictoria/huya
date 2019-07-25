var $sql = require('./sqlMapping')
var mysql = require('mysql')
var db = require('./mysql')

var pool = mysql.createPool({
    connectionLimit:10,
    ...db.mysql
})


module.exports = {
    add:function(streamerId){
        pool.getConnection(function(err, connection) {
			connection.query($sql.streamer.insert, [streamerId], function(err, result) {
				if(result) {
					
                    // console.log(result)   
                }
                return result
				
            })
            connection.release();
		})
    },
    queryById:function(streamerId){
        return new Promise((resolve,reject)=>{
            pool.getConnection(function(err, connection) {
                connection.query($sql.streamer.queryById, [streamerId], function(err, result) {
                    if(!err){
                        resolve(result)
                    }else{
                        reject(err)
                    }
                })
                connection.release();
            })
            
        })
        
    },
}
var $sql = require('./sqlMapping')
var mysql = require('mysql')
var db = require('./mysql')

var pool = mysql.createPool({
    connectionLimit:10,
    ...db.mysql
})

module.exports = {
    queryById:function(streamerId){
        return new Promise((resolve,reject)=>{
            pool.getConnection(function(err, connection) {
                connection.query($sql.info_list.queryById, [streamerId], function(err, result) {
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
    add:function(streamerId,list_key,list_value){
        return new Promise((resolve,reject)=>{
            pool.getConnection(function(err, connection) {
                connection.query($sql.info_list.insert, [streamerId,list_key,list_value], function(err, result) {
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
    update:function(id,list_key,list_value){
        return new Promise((resolve,reject)=>{
            pool.getConnection(function(err, connection) {
                connection.query($sql.info_list.update, [list_key,list_value,id], function(err, result) {
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
    delete:function(id){
        return new Promise((resolve,reject)=>{
            pool.getConnection(function(err, connection) {
                connection.query($sql.info_list.delete, [id], function(err, result) {
                    if(!err){
                        resolve(result)
                    }else{
                        reject(err)
                    }
                })
                connection.release();
            })
        })
    }
}
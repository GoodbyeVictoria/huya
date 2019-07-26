module.exports={
    streamer:{
        insert:'INSERT INTO streamer(streamerId) VALUES (?)',
        delete: 'delete from streamer where streamerId=?',
        queryById: 'select * from streamer where streamerId=?',
        queryAll: 'select * from streamer'
    },
    info_list:{
        queryById: 'select * from info_list where streamerId=?',
        insert:'INSERT INTO info_list(streamerId,list_key,list_value) VALUES (?,?,?)',
        update:`UPDATE info_list SET list_key = ?, list_value = ? WHERE id = ?`,
        updateByKey:`UPDATE info_list SET list_key = ?, list_value = ? WHERE list_key = ?`,
        delete: 'delete from info_list where id = ?',
        deleteByKey: 'delete from info_list where list_key = ?',
    }
}
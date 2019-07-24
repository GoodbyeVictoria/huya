module.exports={
    streamer:{
        insert:'INSERT INTO streamer(streamerId) VALUES ?',
        delete: 'delete from streamer where streamerId=?',
        queryById: 'select * from streamer where streamerId=?',
        queryAll: 'select * from streamer'
    }
}

const isDebug = false;
const [extUuid,baseUrl,port] = ['extUuid_1561970987955','localhost',3000]

var api={
    request(){
        var requestParam = {
            host:baseUrl,
            param:{extUuid},
            port:port,
            httpMethod:'POST',
            path:`/streamer/getList`
          }

        console.log('请求', requestParam)

        return new Promise((resolve,reject)=>{
            hyExt.requestEbs(requestParam)
                    .then(({ res, msg, ebsResponse }) => {
                        if(res == 0) {
                            const { entity, statusCode, header } = ebsResponse;
                            if(statusCode != 200 || !entity) {
                                console.log('接口异常', res, msg, ebsResponse);
                            }
                            console.log("fffffffff====="+JSON.stringify(ebsResponse))
                            console.log('响应', res, entity, statusCode, header);
                            const resp = typeof entity == 'string' ? JSON.parse(entity) : entity;
                            resolve(resp);
                        }else{
                            reject(new Error(msg));
                        }
                    }).catch(err => {
                        reject(err);
                    })
        })
    }
}

export default api
    

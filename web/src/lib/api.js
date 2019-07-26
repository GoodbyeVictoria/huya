
import config from './config'
const {extUuid,baseUrl,port} = config

var api={
    request({service,method = 'POST', params = {}}){
        var requestParam = {
            host:baseUrl,
            param:{extUuid,...params},
            port:port,
            httpMethod: method,
            path:`/streamer/${service}`
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
    


const isDebug = false;
const [extUuid,baseUrl,port] = ['extUuid_1561970987955','localhost',3000]

var api={
    request(){
        var requestParam = {
            host:baseUrl,
            param:{extUuid},
            port:port,
            httpMethod:'GET',
            path:`/`
          }

        console.log('请求', requestParam)
        // return new Promise((resolve,reject)=>{
        //     console.log(2222)
        //     resolve()
        // }).then(()=>{
        //     console.log('执行这个')

        //     throw new Error('nalibudui')
        // }).catch(err=>{
        //     console.log(err)
        // }).then(() => {
        //     console.log('执行“这个”，无论前面发生了什么');
        // });

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
    

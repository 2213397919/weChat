//引入request-promise-native
const rp = require('request-promise-native');
const {writeFile,readFile} = require('fs');
const {appID, appsecret} = require('../config');

//class类
class weChat {
    //用来获取access-token
    async getAccessToken (){
        //定义请求地址
        const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`;
        //发送请求
        const result = await rp({method:'GET',url,json:true});
        //设置access_token的过期时间, 提前5分钟刷新
        result.expires_in = Date.now() + 7200000 - 300000;
        //返回result
        return result;
    }
     saveAccessToken(filePath,accessToken){
        return new Promise((resolve,reject) =>{
            writeFile(filePath,JSON.stringify(accessToken),err =>{
                if (!err){
                    resolve();
                }else {
                    reject('saveAccessToken:'+err);
                }
            })
        })
    }
     readAccessToken(filePath){
        return new Promise((resolve,reject) =>{
            readFile(filePath,(err,data) =>{
                if (!err){
                    resolve(JSON.parse(data.toString()));
                } else {
                    reject('readAccessToken:'+err);
                }
            })
        })
    }

    isValidAccessToken ({expires_in}) {
        return Date.now() < expires_in;
    }

}

(async () =>{
    //实例化对象
    const w = new weChat();
    //声明文件的路径
    w.readAccessToken('./accessToken.txt')
        //判断有没有过期，没有过期直接使用，如果过期，需要重新获取，并且保存。
        .then(async res => {
            if (w.isValidAccessToken(res)) {
                //没有过期，直接使用
                console.log(res);
                console.log('没有过期，直接使用');
            } else {
                //过期了
                const accessToken = await w.getAccessToken();
                await w.saveAccessToken('./accessToken.txt', accessToken);
            }
        })
        //如果出现错误，获取AccessToken，然后保存下来。
        .catch(async err => {
            const accessToken = await w.getAccessToken();
            await w.saveAccessToken('./accessToken.txt', accessToken);
        })
})();
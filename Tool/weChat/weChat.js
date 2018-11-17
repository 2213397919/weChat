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
        result.expires_in = Date.now() + 6900000;
        //返回result
        return result;
    }
    /**
     * 保存access_token
     * @param filePath  要保存的文件路径
     * @param accessToken  要保存的凭据
     * @return {Promise<any>}
     */
    //将得到的AccessToken保存下来。
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
    //读取AccessToken。
     readAccessToken(filePath){
        return new Promise((resolve,reject) =>{
            readFile(filePath,(err,data) =>{
                if (!err){
                    //读取的是buffer，需要转换成js对象。
                    resolve(JSON.parse(data.toString()));
                } else {
                    reject('readAccessToken:'+err);
                }
            })
        })
    }
    //检测AccessToken有没有过期。
    isValidAccessToken ({expires_in}) {
        //过期返回false,没有过期返回true
        return Date.now() < expires_in;
    }
    //返回有效access_token的方法
    fetchAccessToken(){
        if (this.access_token && this.expires_in && this.isValidAccessToken(this)){
            console.log('获取到啦');
            //说明access_token是有效的，返回this.access_token（）和this.expires_in（过期时间）
            return Promise.resolve({access_token: this.access_token, expires_in: this.expires_in});
        }
        ////读取本地AccessToken成功，然后判断一下有没有过期。
        return this.readAccessToken('./accessToken.txt')
            .then(async res =>{
                if (this.isValidAccessToken(res)){
                    //没有过期，直接使用。作为then函数返回值， promise对象包着res
                    return res;
                }else {
                    //过期，重新获取AccessToken，并在本地保存。
                    const accessToken = await this.getAccessToken();
                    await this.saveAccessToken('./accessToken.txt', accessToken);
                    return accessToken;
                }
            })
            //读取本地AccessToken失败，重新获取AccessToken，并在本地保存。
            .catch(async err =>{
                const accessToken = await this.getAccessToken();
                await this.saveAccessToken('./accessToken.txt', accessToken);
                return accessToken
            })
            //第一个.then里面return res,返回的是一个promise对象。
            .then(res => {
                //不管上面成功或者失败都会来到这
                this.access_token = res.access_token;
                this.expires_in = res.expires_in;

                return Promise.resolve(res);
            })
    }
    /**
     * 创建自定义菜单
     * @param menu
     * @return {Promise<*>}
     */
    async createMenu (menu) {
        try {
            //获取access_token
            const {access_token} = await this.fetchAccessToken();
            //定义请求地址
            const url = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${access_token}`;
            //发送请求
            const result = await rp({method: 'POST', url, json: true, body: menu});

            return result;
        } catch (e) {
            return 'createMenu方法出了问题：' + e;
        }
    }

    /**
     * 删除菜单
     * @return {Promise<*>}
     */
    async deleteMenu () {
        try {
            //获取access_token
            const {access_token} = await this.fetchAccessToken();
            //定义请求地址
            const url = `https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=${access_token}`;
            //发送请求
            const result = await rp({method: 'GET', url, json: true});

            return result;
        } catch (e) {
            return 'deleteMenu方法出了问题：' + e;
        }
    }
}
//声明一个自执行函数，来操作AccessToken。
(async () =>{
    //实例化对象
    const w = new weChat();

    let result = await w.deleteMenu();
    console.log(result);
    result = await w.createMenu(require('./menu'));
    console.log(result);
})();
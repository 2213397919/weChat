//引入request-promise-native
const rp = require('request-promise-native');
const {writeFile,readFile,createReadStream} = require('fs');
const {appID, appsecret} = require('../config');
const api = require('../api');
const {writeFileAsync,readFileAsync} = require('../list/tool');
const {reslove}=  require('path')
//class类
class weChat {
    //用来获取access-token
    async getAccessToken() {
        //定义请求地址
        const url = `${api.accessToken}appid=${appID}&secret=${appsecret}`;
        //发送请求
        const result = await rp({method: 'GET', url, json: true});
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
    saveAccessToken(filePath, accessToken) {
        return new Promise((resolve, reject) => {
            writeFile(filePath, JSON.stringify(accessToken), err => {
                if (!err) {
                    resolve();
                } else {
                    reject('saveAccessToken:' + err);
                }
            })
        })
    }

    //读取AccessToken。
    readAccessToken(filePath) {
        return new Promise((resolve, reject) => {
            readFile(filePath, (err, data) => {
                if (!err) {
                    //读取的是buffer，需要转换成js对象。
                    resolve(JSON.parse(data.toString()));
                } else {
                    reject('readAccessToken:' + err);
                }
            })
        })
    }

    //检测AccessToken有没有过期。
    isValidAccessToken({expires_in}) {
        //过期返回false,没有过期返回true
        return Date.now() < expires_in;
    }

    //返回有效access_token的方法
    fetchAccessToken() {
        //如果access_token是有效的，直接返回，不用执行下面的逻辑。
        if (this.access_token && this.expires_in && this.isValidAccessToken(this)) {
            console.log('获取到啦');
            //说明access_token是有效的，返回this.access_token（）和this.expires_in（过期时间）
            return Promise.resolve({access_token: this.access_token, expires_in: this.expires_in});
        }
        ////读取本地AccessToken成功，然后判断一下有没有过期。
        return this.readAccessToken('./accessToken.txt')
            .then(async res => {
                if (this.isValidAccessToken(res)) {
                    //没有过期，直接使用。作为then函数返回值， promise对象包着res
                    return res;
                } else {
                    //过期，重新获取AccessToken，并在本地保存。
                    const accessToken = await this.getAccessToken();
                    await this.saveAccessToken('./accessToken.txt', accessToken);
                    //作为then函数返回值， 返回promise对象。
                    return accessToken;
                }
            })
            //读取本地AccessToken失败，重新获取AccessToken，并在本地保存。
            .catch(async err => {
                const accessToken = await this.getAccessToken();
                await this.saveAccessToken('./accessToken.txt', accessToken);
                //作为then函数返回值， 返回promise对象。
                return accessToken
            })
            //不管上面成功或者失败都会来到这
            .then(res => {
                this.access_token = res.access_token;
                this.expires_in = res.expires_in;

                return Promise.resolve(res);
            })
    }
    //微信的网页开发
    /**
     * 获取ticket
     * @returns {Promise<{ticket: string, ticket_expires_in: number}>}
     */
    //获取ticket
    async getTicket() {
        //获取access_token
        const {access_token} = await this.fetchAccessToken();
        //定义请求地址
        const url = `${api.ticket}access_token=${access_token}`;
        //发送请求
        const result = await rp({method: 'GET', url, json: true});
        //设置access_token的过期时间, 提前5分钟刷新
        result.expires_in = Date.now() + 6900000;
        //返回result
        return {
            ticket: result.ticket,
            ticket_expires_in: Date.now() + 6900000
        }
    }

    //将得到的ticket保存下来。
    saveTicket(filePath, ticket) {
        return writeFileAsync(filePath, ticket);
    }

    //读取ticket。
    readTicket(filePath) {
        return readFileAsync(filePath);
    }

    //检测ticket有没有过期。
    isValidTicket({ticket_expires_in}) {
        //过期返回false,没有过期返回true
        return Date.now() < ticket_expires_in;
    }

    //返回有效ticket的方法
    fetchTicket() {
        //如果ticket是有效的，直接返回，不用执行下面的逻辑。
        if (this.ticket && this.expires_in && this.isValidAccessToken(this)) {
            console.log('获取到啦');
            //说明access_token是有效的，返回this.access_token（）和this.expires_in（过期时间）
            return Promise.resolve({ticket: this.ticket, ticket_expires_in: this.ticket_expires_in});
        }
        ////读取本地AccessToken成功，然后判断一下有没有过期。
        return this.readTicket('./ticket.txt')
            .then(async res => {
                if (this.isValidTicket(res)) {
                    //没有过期，直接使用。作为then函数返回值， promise对象包着res
                    return res;
                } else {
                    //过期，重新获取AccessToken，并在本地保存。
                    const ticket = await this.getTicket();
                    await this.saveTicket('./ticket.txt', ticket);
                    //作为then函数返回值， 返回promise对象。
                    return ticket;
                }
            })
            //读取本地AccessToken失败，重新获取AccessToken，并在本地保存。
            .catch(async err => {
                const ticket = await this.getTicket();
                await this.saveAccessToken('./ticket.txt', ticket);
                //作为then函数返回值， 返回promise对象。
                return ticket
            })
            //不管上面成功或者失败都会来到这
            .then(res => {
                this.ticket = res.ticket;
                this.ticket_expires_in = res.ticket_expires_in;

                return Promise.resolve(res);
            })
    }

    /**
     * 创建自定义菜单
     * @param menu
     * @return {Promise<*>}
     */
    //创建自定义菜单
    async createMenu(menu) {
        try {
            //获取access_token
            const {access_token} = await this.fetchAccessToken();
            //定义请求地址
            const url = `${api.menu.create}access_token=${access_token}`;
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
    //删除菜单
    async deleteMenu() {
        try {
            //获取access_token
            const {access_token} = await this.fetchAccessToken();
            //定义请求地址
            const url = `${api.menu.delete}access_token=${access_token}`;
            //发送请求
            const result = await rp({method: 'GET', url, json: true});

            return result;
        } catch (e) {
            return 'deleteMenu方法出了问题：' + e;
        }
    }

    /**
     * 创建用户标签
     * @name 标签名
     * @returns {Promise<void>}
     */
    //用户管理，创建用户标签
    async createTag(name) {
        try {
            //获取access_token
            const {access_token} = await this.fetchAccessToken();
            //获取请求地址
            const url = `${api.tag.create}access_token=${access_token}`;
            //发送请求
            const result = await rp({method: 'POST', url, json: true, body: {tag: {name}}});
            return result;
        } catch (e) {
            return console.log('createTag' + e);
        }
    }

    /**
     *获取公众号已创建的标签
     * @param tagid  创建标签的ID
     * @param next_openid 由于每次只能拉去10000人，值为第10000人的openid.
     * @returns {Promise<string>}
     */
    //获取公众号已创建的标签
    async getTagUsers(tagid, next_openid = '') {
        try {
            const {access_token} = await this.fetchAccessToken();
            const url = `${api.tag.getUsers}access_token=${access_token}`;
            return await rp({method: 'POST', url, json: true, body: {tagid, next_openid}});
        } catch (e) {
            return 'getTagUsers方法出了问题' + e;
        }
    }

    /**
     *用户管理,批量为用户打上标签。
     * @param openid_list 用户列表
     * @param tagid 创建标签的id
     * @returns {Promise<string>}
     */
    //用户管理,批量为用户打上标签。
    async batchUsersTag(openid_list, tagid) {
        try {
            const {access_token} = await this.fetchAccessToken();
            const url = `${api.tag.batch}access_token=${access_token}`;
            return await rp({method: 'POST', url, json: true, body: {tagid, openid_list}});
        } catch (e) {
            return 'batchUsersTag方法出了问题' + e;
        }
    }

    //群发消息
    async sendAllByTag(options) {
        try {
            const {access_token} = await this.fetchAccessToken();
            const url = `${api.message.sendall}access_token=${access_token}`;
            return await rp({method: 'POST', url, json: true, body: options});
        } catch (e) {
            return 'sendAllByTag方法出了问题' + e;
        }
    }

    //上传素材
    async uploadMaterial(type, material, body) {
        try {
            //获取access_token
            const {access_token} = await this.fetchAccessToken();
            //定义请求地址
            let url = '';
            //定义发送请求参数。
            let options = {method: 'POST', json: true};

            if (type === 'news') {
                url = `${api.upload.uploadNews}access_token=${access_token}`;
                //请求体参数
                options.body = material;
            } else if (type === 'pic') {
                url = `${api.upload.uploading}access_token=${access_token}`;
                //以form表单上传
                options.formData = {
                    media: createReadStream(material)
                }
            } else {
                url = `${api.upload.uploadOther}access_token=${access_token}&type=${type}`;
                console.log(url)
                //以form表单上传。
                options.formData = {
                    media: createReadStream(material)
                }
                if (type === 'video') {
                    options.body = body;
                }
            }
            options.url = url;
            //发送请求
            return await rp(options);
        } catch (e) {
                console.log(e)
        }
    }
}
//声明一个自执行函数，来操作AccessToken。
(async () =>{
    //实例化对象
    const w = new weChat();
    //生成access_token
    // let accessTokens = await w.fetchAccessToken()
    // console.log(accessTokens);
    // accessTokens = await w.fetchAccessToken();
    // console.log(accessTokens);
    //生成ticket
    // let Ticket =await w.fetchTicket();
    // console.log(Ticket);
    // Ticket = await  w.fetchTicket();
    // console.log(Ticket);
    // 用户管理
    // let createTags = await w.createTag('璀璨');
    // console.log(createTags);
    // let createTags1 = await w.batchUsersTag([
    //     'orvpe1YBxSXdkGybDAXKrrZFlSmk',
    //     'orvpe1ThAMshf2rb6uE1aPZg0tNA',
    //     'orvpe1REEIaGOuZsDqZMEpG6eV8w'
    // ],createTags.tag.id);
    // console.log(createTags1);
    // let createTags2 = await w.getTagUsers(createTags.tag.id);
    // console.log(createTags2);
    //群发消息
    // let result = await w.sendAllByTag({
    //     "filter":{
    //         "is_to_all":false,
    //         "tag_id": 101
    //     },
    //     "text":{
    //         "content": "今天天气真晴朗~"
    //     },
    //     "msgtype":"text"
    // });
    // console.log(result);
    // { errcode: 40001,
    //     errmsg: 'invalid credential, access_token is invalid or not latest hint: [vmSqVA0652vr65!]' }
    //上传图片获取media_id
    // let result1 = await w.uploadMaterial('image', './img/3.jpg');
    // console.log(result1);
    // 上传图片获取地址
    // let result2 = await w.uploadMaterial('pic', './img/4.jpg');
    //     console.log(result2);
    // // 上传图文消息
    // let result3 = await w.uploadMaterial('news', {
    //     "articles": [{
    //         "title": '曹宝宝',
    //         "thumb_media_id": result1.media_id,
    //         "author": '顺大屌',
    //         "digest": '甜蜜蜜',
    //         "show_cover_pic": 1,
    //         "content": `<!DOCTYPE html>
    //               <html lang="en">
    //               <head>
    //                 <meta charset="UTF-8">
    //                 <title>Title</title>
    //               </head>
    //               <body>
    //                 <h1>微信公众号开发</h1>
    //                 <img src="${result2.url}">
    //               </body>
    //               </html>`,
    //         "content_source_url": 'https://2213397919.github.io/3D-box/',
    //         "need_open_comment":1,
    //         "only_fans_can_comment":1
    //     },
    //         {
    //             "title": '顺宝宝',
    //             "thumb_media_id": result1.media_id,
    //             "author": '张顺',
    //             "digest": '甜言蜜语',
    //             "show_cover_pic": 0,
    //             "content": '再多的甜言蜜语，也抵不上早晨的一杯热粥。',
    //             "content_source_url": 'https://2213397919.github.io/3D-box/',
    //             "need_open_comment":0,
    //             "only_fans_can_comment":0
    //         }
    //     ]
    // });
    //     console.log(result3);

  //删除菜单，再重新创建
  // let result = await w.deleteMenu();
  // console.log(result);
  // result = await w.createMenu(require('./menu'));
  // console.log(result);
})()
module.exports = weChat;
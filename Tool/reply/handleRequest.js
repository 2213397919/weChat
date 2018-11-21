
//引入sha1
const sha1 = require('sha1');
//移入自己定义的模块
const {getUserDataAsync, parseXMLDataAsync, formatMessage}= require('../list/tool');
const template = require('./template');
const reply = require('./reply');
const {token} = require('../config');

module.exports = () =>{
    return async (req,res,next) =>{
        console.log(req.query);
        //获取请求参数。
        const {signature, echostr, timestamp, nonce} = req.query;
        // const {token} = config;
        //将参数签名加密的三个参数（timestamp、nonce、token）组合在一起，按照字典序排序
        const str = sha1([timestamp, nonce, token].sort().join(''));
        // 1. GET 验证服务器有效性逻辑
        // 2. POST 转发用户消息
        if (req.method === 'GET'){
            //验证服务器有效性
            if (signature === str){
                //说明消息来自于微信服务器。
                res.end(echostr);
            }else {
                res.send('error');
            }
        }else if (req.method === 'POST'){
            // 转发用户消息
            //接受微信服务器转发用户消息
            //验证消息来自于微信服务器
            if (signature !== str){
                res.send('error');
                return;
            }
            //用户发送的消息在请求体
            const xmlData = await getUserDataAsync(req);
            console.log(xmlData);
            //将用户发送过来的xml数据解析为js对象
            const jsData = await parseXMLDataAsync(xmlData);
            console.log(jsData);
            //格式化数据
            const message = formatMessage(jsData);
            console.log(message);
            //由于在reply里面改动过，需要写成promise对象
            const options = await reply(message);
            //封装一个模块，处理用户需要回复的消息。返回xml消息给微信服务器,
            const reqMessage = template(options);
            //返回xml消息给微信服务器,微信服务器自动将消息发送给用户。
            res.send(reqMessage);
        }else {
            res.end('error');
        }
    }
}
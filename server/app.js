//引入express
const express = require('express');
//加密组件
const sha1 = require('sha1');
//创建app应用
const app = express();
//配置变量
const config = {
    appID : 'wx5cc52dd278ee90c9',
    appsecret : '69240a0f00303ace60dd352a1c552c0a',
    token : 'zsatcyf0605'
}
//路由
app.use((req,res,next) =>{
    // console.log(req.query);
    //获取请求参数
    const {signature, echostr, timestamp, nonce} = req.query;
    const {token} = config;
    // - 将参数签名加密的三个参数（timestamp、nonce、token）组合在一起，按照字典序排序
    const arr = [timestamp,nonce,token].sort();
    // - 将排序后的参数拼接在一起，进行sha1加密
    const str = sha1(arr.join(''));
    // console.log(str);
    // - 加密后的到的就是微信签名，将其与微信发送过来的微信签名对比，
    if (signature === str) {
        //说明消息来自于微信服务器
        res.end(echostr);
    } else {
        //说明消息不来自于微信服务器
        res.end('error');
    }
})
//监听端口
app.listen(3000,err =>{
    if (!err) console.log('服务器启动成功');
    else console.log(err);
})
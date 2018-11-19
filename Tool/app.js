//引入express
const express = require('express');

const handleRequest = require('./reply/handleRequest');
const weChat = require('./weChat/weChat')
const {url,appID} = require('./config');

//创建app应用
const app = express();
//配置模板目录
app.set('views','views');
//配置模板引擎
app.set('view engine','ejs');
//发送get
app.get('./search',async (req,res) =>{
    /*
   微信签名算法：
     1. 得到参与签名的字段包括noncestr（随机字符串）, 有效的jsapi_ticket, timestamp（时间戳）, url（当前网页的URL，不包含#及其后面部分）
     2. 对所有待签名参数按照字段名的ASCII 码从小到大排序（字典序）后，使用URL键值对的格式（即key1=value1&key2=value2…）拼接成字符串string1
     3. 这里需要注意的是所有参数名均为小写字符。对string1作sha1加密，字段名和字段值都采用原始值，不进行URL 转义。
  */
    //得到临时票据、
    const {ticket} = await weChat.getTicket();
    //随机字符串
    const noncestr = Math.random().toString().split('.')[1];
    //时间戳
    const timestamp = parseInt(Date.now()/1000);
    //将四个参数按照 key = value 方式组合一个数组
    const arr = [
        `noncestr=${noncestr}`,
        `jsapi_ticket=${ticket}`,
        `timestamp=${timestamp}`,
        `url=${url}/search`
    ]
    //排序，以&拼接成一个字符串, 再进行sha1加密，得到的就是加密签名
    const signature = sha1(arr.sort().join('&'));
    //渲染到页面
    res.render('search', {
        signature,
        timestamp,
        noncestr,
        appID
    });
//路由
app.use(handleRequest());
app.listen(3000,err =>{
    if (!err){
        console.log('服务器开启成功');
    } else {
        console.log(err);
    }
})
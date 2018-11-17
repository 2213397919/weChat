//引入express
const express = require('express');

const handleRequest = require('./reply/handleRequest');

//创建app应用
const app = express();
//路由
app.use(handleRequest());
app.listen(3000,err =>{
    if (!err){
        console.log('服务器开启成功');
    } else {
        console.log(err);
    }
})
//引入解析xml的包
const {parseString} = require('xml2js');
const {writeFileAsync,readFileAsync} = require('fs');
//要暴露出去的模块
module.exports={
    //用来接收用户发过来的数据
    getUserDataAsync (req) {
        return new Promise (resolve =>{
            //声明一个空串，用来拼接
            let result = '';
            req
                .on('data',data =>{
                    //得到的data是buffer,需要转换一下
                    result+=data.toString();
                })
                .on('end',() =>{
                    //将转换后的参数返回出去。
                    console.log("用户数据接收完毕");
                    resolve(result);
                })
        })
    },
    //用来将用户的数据转换成json字符串
    parseXMLDataAsync(xmlData){
        return new Promise((resolve,reject)=>{
            parseString(xmlData,{trim:true},(err,data) =>{
                if (!err){
                    resolve(data);
                }else {
                    reject('发生错误的地方：parseXMLDataAsync' + err);
                }
            })
        })
    },
    //将用户发来的转成json字符串的数据，转成对象。
    formatMessage({xml}){

        let result = {};
        for (let key in xml){
            let value = xml[key];
            result[key] = value[0];
        }
        return result;
    },
    writeFileAsync (filePath,data){
        return new Promise((resolve,reject) =>{
            writeFile(filePath,JSON.stringify(data),err =>{
                if (!err){
                    resolve();
                }else {
                    reject('writeFileAsync :'+err);
                }
            })
        })
    },
    readFileAsync(filePath){
        return new Promise((resolve,reject) =>{
            readFile(filePath,(err,data) =>{
                if (!err){
                    //读取的是buffer，需要转换成js对象。
                    resolve(JSON.parse(data.toString()));
                } else {
                    reject('readFileAsync:'+err);
                }
            })
        })
    }
}

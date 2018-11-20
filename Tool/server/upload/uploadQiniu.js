//引入七牛库
const qiniu = require('qiniu')
const accessKey = 'hveqISvdgxTA4MaT2A-QS2TyxzfGWOU10aE2stP6';
const secretKey = 'IMf_UPsq96yme0f-pe8NazPwcTu3W4fp9MbVrFOA';
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
const config = new qiniu.conf.Config();
const bucketManager = new qiniu.rs.BucketManager(mac, config);
/*
  resUrl  网络资源地址
  bucket  七牛中对象存储空间名称
  key     要保存的网络资源名称（重命名）  唯一的
 */
// const resUrl = 'http://devtools.qiniu.com/qiniu.png';
const bucket = 'wechat';
// const key = "qiniu.png";
module.exports=((resUrl,key) => {
    return new Promise((resolve, reject) => {
        bucketManager.fetch(resUrl, bucket, key, function (err, respBody, respInfo) {
            if (err) {
                console.log(err);
                //throw err;
                reject(err);
            } else {
                if (respInfo.statusCode == 200) {
                    resolve();

                }
            }
        })
    })
})
/*
  菜单配置模块
 */
const {url} = require('../config');

module.exports =  {
    "button":[
        {
            "type":"view",
            "name":"预告片🎥",
            "url": `${url}/movie`
        },
        {
            "type":"view",
            "name":"语音识别🎤",
            "url":`${url}/search`
        },
        {
            "name":"戳我啊👈",
            "sub_button":[
                {
<<<<<<< HEAD
                    "type": "pic_weixin",
                    "name": "微信相册发图",
                    "key": "rselfmenu_1_2",
                    "sub_button": [ ]
                },
                {
                    "name": "发送位置",
                    "type": "location_select",
                    "key": "rselfmenu_2_0"
                },
<<<<<<< HEAD
                /*{
                  "type": "media_id",
                  "name": "图片",
                  "media_id": "MEDIA_ID1"
=======
                {
                  "type": "media_id",
                  "name": "图片",
                  "media_id": "K4kVx-8d03qbOddP_a4F6vsN6Z4In2M9YHLRV-Pw5Xw"
>>>>>>> dev
                },
                {
                  "type": "view_limited",
                  "name": "图文消息",
<<<<<<< HEAD
                  "media_id": "MEDIA_ID2"
                }*/
=======
                  "media_id": "K4kVx-8d03qbOddP_a4F6kRQTd1QIfR9si-PmBWADJw"
=======
                    "type": "click",
                    "name": "新手指引",
                    "key": "help",
                },
                {
                    "name": "官网",
                    "type": "view",
                    "url": "https://movie.douban.com/"
>>>>>>> dev
                }
>>>>>>> dev
            ]
        }
    ]
}
/*
  菜单配置模块
 */

module.exports =  {
    "button":[
        {
            "type":"click",
            "name":"戳我啊",
            "key":"戳我啊"
        },
        {
            "name":"个性化",
            "sub_button":[
                {
                    "type":"view",
                    "name":"跳转链接☀",
                    "url":"https://2213397919.github.io/3D-box/"
                },
                {
                    "type": "scancode_waitmsg",
                    "name": "扫码带提示🌸",
                    "key": "rselfmenu_0_0",
                    "sub_button": [ ]
                },
                {
                    "type": "scancode_push",
                    "name": "扫码推事件💋",
                    "key": "rselfmenu_0_1",
                    "sub_button": [ ]
                },
                {
                    "type": "pic_sysphoto",
                    "name": "系统拍照发图🎉",
                    "key": "rselfmenu_1_0",
                    "sub_button": [ ]
                },
                {
                    "type": "pic_photo_or_album",
                    "name": "拍照或者相册发图",
                    "key": "rselfmenu_1_1",
                    "sub_button": [ ]
                },
            ]
        },
        {
            "name":"小功能",
            "sub_button":[
                {
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
                /*{
                  "type": "media_id",
                  "name": "图片",
                  "media_id": "MEDIA_ID1"
                },
                {
                  "type": "view_limited",
                  "name": "图文消息",
                  "media_id": "MEDIA_ID2"
                }*/
            ]
        }
    ]
}
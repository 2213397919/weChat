//暴露一个回复模块出去
module.exports = message =>{
    //初始化一个配置对象
    let options = {
        //都是一些公共的属性，其他属性，需要时自己手动添加，比如，视频等
        toUserName: message.FromUserName,
        fromUserName: message.ToUserName,
        createTime: Date.now(),
        msgType: 'text'
    }

    //初始化一个文本信息
    let content = '';
    if (message.MsgType === 'text'){
            //判断用户发送消息的内容，根据内容返回特定的响应
            if (message.Content === '1'){
                content='爱你一万年，今生永不变。';
            }else if (message.Content === '2'){
                content='给我一杯忘情水，让我永远不忘怀。';
            } else if (message.Content.includes('爱')){
                content='嘣一个，么么哒';
            }else if (message.Content==='3'){
                options.msgType='news';
                options.title = '三行情诗';
                options.description = '跳跃在纸上的精灵，施展出花样的魔力。';
                options.picUrl = 'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1542420692&di=e2dddb8a76c0773010271e6f085fe1d7&src=http://www.quwan.com/images/201411/1416853425889145838.jpg';
                options.url = 'https://2213397919.github.io/album/';
            }
    }else if (message.MsgType === 'voice'){
        content = `语音识别结果为: ${message.Recognition}`;
    }else if (message.MsgType === 'location'){
        //用户主动发送位置
        content = `纬度：${message.Location_X}  经度：${message.Location_Y} 地图的缩放大小：${message.Scale} 位置详情：${message.Label}`;
    } else if (options.MsgType === 'event'){
        if (message.Event === 'subscribe') {
            //关注事件/订阅事件
            content = '欢迎您关注本公众号，该该公众号用于三行情书大赛。';
            if (message.EventKey) {
                //说明扫了带参数的二维码
                content = '欢迎您关注公众号, 扫了带参数的二维码';
            }
        } else if (message.Event === 'unsubscribe') {
            //取消关注事件
            console.log('手下留情');
        } else if (message.Event === 'LOCATION') {
            //用户初次访问公众号，会自动获取地理位置
            content = `纬度：${message.Latitude} 经度：${message.Longitude}`;
        } else if (message.Event === 'CLICK') {
            //用户初次访问公众号，会自动获取地理位置
            content = `用户点击了：${message.EventKey}`;
        }
    }
    options.content = content;
    return options;
}
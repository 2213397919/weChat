const {url} = require('../config');
//引入发送文本的库
const rp = require('request-promise-native');
//暴露一个回复模块出去
module.exports = async message =>{
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
            if (message.Content === '预告片'){
                //图文消息
                options.msgType='news';
                options.title='渤海电影预告片';
                options.description='有即将上映的电影';
                options.picUrl='http://mmbiz.qpic.cn/mmbiz_jpg/z37iaicGzwN4U5huLQ3uYvTQaoibWibYvHYLUicbzwXiau3M3Wwicfjavb11KCzFqoLibYHr46fJ3Zod4TZMfSZJ5LjPHg/0?wx_fmt=jpeg';
                options.url=`${url}/movie`;
            }else if (message.Content === '语音识别'){
                //图文消息
                options.msgType='news';
                options.title='语音识别电影';
                options.description='这里可以使用语音来搜索电影';
                options.picUrl='http://mmbiz.qpic.cn/mmbiz_jpg/z37iaicGzwN4U5huLQ3uYvTQaoibWibYvHYLUicbzwXiau3M3Wwicfjavb11KCzFqoLibYHr46fJ3Zod4TZMfSZJ5LjPHg/0?wx_fmt=jpeg';
                options.url=`${url}/search`;
            } else{
                //搜索相关电影,调用豆瓣的接口
                const url = `http://api.douban.com/v2/movie/search`;
                const {subjects} = await rp({method: 'GET', url, json: true, qs: {count: 1, q: message.Content}});
                options.msgType = 'news';
                options.title = subjects[0].title;
                options.description = `评分：${subjects[0].rating.average}`;
                options.picUrl = subjects[0].images.small;
                options.url = subjects[0].alt;
            }
    }else if (message.MsgType === 'voice'){
        //搜索相关电影,调用豆瓣的接口
        const url = `http://api.douban.com/v2/movie/search`;
        const {subjects} = await rp({method: 'GET', url, json: true, qs: {count: 1, q: message.Recognition}});
        options.msgType = 'news';
        options.title = subjects[0].title;
        options.description = `评分：${subjects[0].rating.average}`;
        options.picUrl = subjects[0].images.small;
        options.url = subjects[0].alt;
    } else if (message.MsgType === 'event'){
        if (message.Event === 'subscribe') {
            //关注事件/订阅事件
            content = `欢迎您关注本电影众号。\n
                       回复 预告片 查看硅谷电影预告片 /n
                回复 语音识别 查看语音识别电影 /n
                回复 任意文本 搜索相关的电影 /n
                回复 任意语音 搜索相关的电影 /n
                也可以点击<a href="${url}/search">语音识别</a>来跳转`;
        } else if (message.Event === 'unsubscribe') {
            //取消关注事件
            console.log('手下留情');
        }  else if (message.Event === 'CLICK') {
           if (message.EventKey === 'help') {
               content = `欢迎您关注本电影众号。/n
                       回复 预告片 查看硅谷电影预告片 /n
                回复 语音识别 查看语音识别电影 /n
                回复 任意文本 搜索相关的电影 /n
                回复 任意语音 搜索相关的电影 /n
                也可以点击<a href="${url}/search">语音识别</a>来跳转`;
           }
        }
    }
    options.content = content;
    return options;
}
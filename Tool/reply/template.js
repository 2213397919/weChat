//由于有参数的传入，故需要暴露一个函数出去
module.exports = options =>{
    //返回xml数据给微信服务器，提取出公共的部分。
    let reqMessage =`<xml>
      <ToUserName><![CDATA[${options.toUserName}]]></ToUserName>
      <FromUserName><![CDATA[${options.fromUserName}]]></FromUserName>
      <CreateTime>${options.createTime}</CreateTime>
      <MsgType><![CDATA[${options.msgType}]]></MsgType>`;
    //判断用户请求的消息类型，进行xml拼串进行返回。
    if (options.msgType === 'text'){
        reqMessage += `<Content><![CDATA[${options.content}]]></Content>`;
    }else if (options.msgType === 'image'){
        reqMessage += `</MsgType><Image><MediaId><![CDATA[${options.mediaId}]]></MediaId></Image>`
    }else if (options.msgType === 'voice'){
        reqMessage += `<Voice><MediaId><![CDATA[${options.mediaId}]]></MediaId></Voice>`;
    }else if (options.msgType === 'video'){
        reqMessage += `<Video>
      <MediaId><![CDATA[${options.mediaId}]]></MediaId>
      <Title><![CDATA[${options.title}]]></Title>
      <Description><![CDATA[${options.description}]]></Description>
      </Video>`;
    } else if (options.msgType === 'music'){
        reqMessage += ` <Title><![CDATA[${options.title}]]></Title>
      <Description><![CDATA[${options.description}]]></Description>
      <MusicUrl><![CDATA[${options.musicUrl}]]></MusicUrl>
      <HQMusicUrl><![CDATA[${options.hqMusicUrl}]]></HQMusicUrl>
      <ThumbMediaId><![CDATA[${options.mediaId}]]></ThumbMediaId>
      </Music>`;
    } else if (options.msgType === 'news'){
        reqMessage += `<ArticleCount>1</ArticleCount>
                       <Articles>
                       <item>
                      <Title><![CDATA[${options.title}]]></Title>
                      <Description><![CDATA[${options.description}]]></Description>
                      <PicUrl><![CDATA[${options.picUrl}]]></PicUrl>
                      <Url><![CDATA[${options.url}]]></Url>
                      </item>
      </Articles>`
    }
    reqMessage +='</xml>';
    return reqMessage;
}
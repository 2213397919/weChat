//引入模块
//生成随机数
const nanoid = require('nanoid');
const upload = require('./uploadQiniu');
const Trailers = require('../../module/index');

module.exports=async ()=>{
    //查询数据
    const movies = await Trailers.find({});
    for (let i = 0; i < movies.length; i++) {
        //文档对象
        const movie = movies[i];
        //生成随机字符串
        const coverKey = nanoid(10) + '.jpg';
        // upload(movie.cover,coverKey)
        const imageKey = nanoid(10) + '.jpg';
        // upload(movie.image,imageKey)
        const videoKey = nanoid(10) + 'mp4';
        // upload(movie.src,videoKey)
        await Promise.all([upload(movie.cover,coverKey),upload(movie.image,imageKey),upload(movie.src,videoKey)]);
        //给对象添加三个属性和属性值。
        movie.coverKey=coverKey;
        movie.imageKey=imageKey;
        movie.videoKey=videoKey;
        //保存在数据库中
        await movie.save();
    }
}
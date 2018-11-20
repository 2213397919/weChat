const Trailers = require('../../module/index');

module.exports = async movies => {
  for (var i = 0; i < movies.length; i++) {
    let item = movies[i];
    console.log(item);
    await Trailers.create(item);
  }
}

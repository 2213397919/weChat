const db = require('../db');
const crawler = require('./crawler');
const save = require('./save');
const upload = require('./upload');

(async () => {
  // const movies = await crawler();
  await db;
  // await save(movies);
  // await upload()
})()
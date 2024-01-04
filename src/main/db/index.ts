/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable prefer-template */
/* eslint-disable global-require */
const sqlite3 = require('sqlite3').verbose();

let db: any;
// 连接数据库
export default function conDb() {
  const os = require('os');
  const homedir = os.homedir(); // 用于获取当前用户的主目录路径
  const users = homedir.replace(/\\/g, '\\\\'); // 替换绝对和相对路径
  console.log('数据库地址：', users, users + '/jhy/db/test.db');
  if (!db || !db.open) {
    db = new sqlite3.Database(users + '/jhy/db/test.db', (err: any) => {
      if (err) {
        console.error('--------------------connectDatabaseErr', err.message);
      }
      console.log('👉👉👉-----------------sqlite3已经连接成功');
    }); // 保存地址文件
  }
  return db;
}

export function init() {
  db = conDb();

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // 测试数据库
      db.run(`create table if not exists test (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                createdTime int,
                updateTime int,
                content varchar(5000),
                tag varchar(2000),
                uid varchar(1000) DEFAULT null
            )`);
      resolve({});
    });
  });
}

/* eslint-disable no-console */
// @Description: 数据库连接
const sqlite3 = require('sqlite3');
// const NODE_ENV = process.env.NODE_ENV;
const path = require('path');

const DB_PATH = path.join(__dirname, '/test.db');

// @Description: 连接数据库
function connectDatabase() {
  return new sqlite3.Database(DB_PATH, (err: any) => {
    if (err) {
      console.error('--------------------connectDatabaseErr', err.message);
    }
    console.log('👉👉👉-----------------sqlite3已经连接成功');
  });
}

const db = connectDatabase();

/**
 * @Description: 创建数据库,如果用户本地没有数据库的话就创建否则跳过
 * @CreationDate 2023-05-10 13:44:48
 */
function createDataTable() {
  //  @Description: 创建用户表
  db.serialize(function () {
    db.run(
      'create table if not exists user (id INTEGER PRIMARY KEY AUTOINCREMENT, name text, email text, phone text);',
    );
  });
  // db.close();
}

exports.connectDatabase = connectDatabase;
exports.createDataTable = createDataTable;
exports.db = db;

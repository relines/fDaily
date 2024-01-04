/* eslint-disable @typescript-eslint/no-unused-vars */
import conDb from './index';

let db: any;
export default function init() {
  db = conDb();

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // 测试数据库
      db.run(`create table if not exists test (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                buyerType varchar(64) DEFAULT '1',
                tel int,
                cookie varchar(2000),
                uin varchar(1000) DEFAULT null,
                uid varchar(1000) DEFAULT null,
                createdTimer int
            )`);

      resolve({});
    });
  });
}

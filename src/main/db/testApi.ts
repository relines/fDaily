/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-lonely-if */
/* eslint-disable prefer-promise-reject-errors */
import dayjs from 'dayjs';

import conDb from './index';

export default {
  getTest({ page = 1, pageSize = 10, tel = '' }) {
    const db = conDb();
    // 获取total语法
    const totalSql = `select count(*) total from test`;

    let total = 0;
    return new Promise((resolve, reject) => {
      // 统计总数
      db.all(totalSql, (err: any, totalData: any) => {
        if (err) {
          reject({ code: 200, msg: err, data: '总计条数错误' });
        }
        total = totalData[0].total;
      });

      // 实现分页语法
      let sql = `select * from test ORDER BY code DESC`;
      if (tel) {
        sql += ` where tel = "${tel}"`;
      }
      sql += ` limit ${(page - 1) * pageSize},${pageSize}`;

      db.all(sql, (error: any, data: any) => {
        if (error) {
          reject({ code: 400, msg: error });
        } else {
          resolve({ code: 200, msg: '成功', data });
        }
      });
    });
  },
  addTest({ content, tag }: any) {
    const db = conDb();

    const createdTime = new Date().getTime();
    const formatDay = dayjs(new Date()).format('YYYYMMDD');
    let code = Number(`${formatDay}0001`);

    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM test WHERE code LIKE "${formatDay}%"`,
        (err: any, list: any) => {
          if (err) {
            reject({ code: 400, msg: err, data: [] });
          } else {
            if (list.length) {
              const codeArr = list.map((item: any) => item.code);
              const maxCode = Math.max(...codeArr);
              code = maxCode + 1;
              if (maxCode.toString().slice(-4) === '9999') {
                resolve({ code: 201, msg: '已经达到9999条数据', data: list });
              }
            }
            db.run(
              `INSERT INTO test (code, content, tag, createdTime) values ("${code}","${content}", "${tag}", "${createdTime}")`,
              (error: any, data: any) => {
                if (error) {
                  reject({ code: 400, msg: error });
                } else {
                  resolve({ code: 200, msg: '成功', data });
                }
              },
            );
          }
        },
      );
    });
  },
  updateTest({ id, content, tag }: any) {
    const db = conDb();

    const createdTime = new Date().getTime();

    return new Promise((resolve, reject) => {
      let sql = `INSERT INTO test (id,content, tag, createdTime) `;
      sql += `values ("${id}","${content}", "${tag}", "${createdTime}")`;

      const inquire = `select * from test where id = "${id}"`;

      db.all(inquire, (err: any, list: any) => {
        // 查询用户
        if (err) {
          reject({ code: 400, msg: err, data: [] });
        } else {
          if (list.length) {
            // 有用户
            resolve({ code: 201, msg: '已有该用户', data: list });
          } else {
            // 没有用户
            db.run(sql, (error: any, data: any) => {
              if (error) {
                reject({ code: 400, msg: error });
              } else {
                resolve({ code: 200, msg: '成功', data });
              }
            });
          }
        }
      });
    });
  },
  delTest({ id = 1 }) {
    const sql = `DELETE FROM test WHERE id = ${id}`;
    const weightSql = `select * from test where id = ${id}`;
    return new Promise((resolve, reject) => {
      const db = conDb();
      db.all(weightSql, (err: any, list: any) => {
        if (err) {
          reject({ code: 400, msg: err, data: [] });
        } else {
          if (list.length) {
            db.all(sql, (error: any, data: any) => {
              if (error) {
                reject({ code: 400, msg: error });
              } else {
                resolve({ code: 200, msg: '删除成功', data: list });
              }
            });
          } else {
            resolve({ code: 400, msg: `买家号不存在` });
          }
        }
      });
    });
  },
};

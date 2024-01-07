/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-lonely-if */
/* eslint-disable prefer-promise-reject-errors */
import dayjs from 'dayjs';

import conDb from './index';

export default {
  getList(params: any) {
    const { pageIndex = 1 } = params;
    const db = conDb();
    // 获取total语法
    const totalSql = `select count(*) total from list_table`;

    // 实现分页语法
    const sql = `select * from list_table ORDER BY code DESC LIMIT 10 OFFSET ${
      10 * pageIndex
    }`;

    let total = 0;
    return new Promise((resolve, reject) => {
      // 统计总数
      db.all(totalSql, (err: any, totalData: any) => {
        if (err) {
          reject({ code: 200, msg: err, data: '总计条数错误' });
        }
        total = totalData[0].total;
        db.all(sql, (error: any, data: any) => {
          if (error) {
            reject({ code: 400, msg: error });
          } else {
            resolve({ code: 200, msg: '成功', data, total });
          }
        });
      });
    });
  },
  addList({ content, tag }: any) {
    const db = conDb();

    const createTime = new Date().getTime();
    const formatDay = dayjs(new Date()).format('YYYYMMDD');
    let code = Number(`${formatDay}0001`);

    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM list_table WHERE code LIKE "${formatDay}%"`,
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
              `INSERT INTO list_table (code, content, tag, createTime) values ("${code}","${content}", "${tag}", "${createTime}")`,
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
  updateList(params: any) {
    const { code, content, tag } = params;
    const db = conDb();

    return new Promise((resolve, reject) => {
      const inquire = `select * from list_table where code = "${code}"`;
      const sql = `UPDATE list_table SET content = "${content}", tag = "${tag}" WHERE code = "${code}"`;
      db.run(sql, (error: any, data: any) => {
        if (error) {
          reject({ code: 400, msg: error });
        } else {
          db.get(inquire, (err: any, item: any) => {
            if (err) {
              reject({ code: 400, msg: err, data: [] });
            } else {
              if (!item) {
                resolve({ code: 201, msg: '没有查到code', data: item });
              } else {
                resolve({ code: 200, msg: '成功', data: item });
              }
            }
          });
        }
      });
    });
  },
  delList({ id = 1 }) {
    const sql = `DELETE FROM list_table WHERE id = ${id}`;
    const weightSql = `select * from list_table where id = ${id}`;
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

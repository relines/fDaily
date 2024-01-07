/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-lonely-if */
/* eslint-disable prefer-promise-reject-errors */
import dayjs from 'dayjs';

import conDb from './index';

export default {
  getData(params: any) {
    const { pageIndex = 1 } = params;
    const db = conDb();
    // 获取total语法
    const totalSql = `select count(*) total from category_table`;

    // 实现分页语法
    const sql = `select * from category_table ORDER BY code DESC LIMIT 10 OFFSET ${
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
  addData({ name, remark, sort }: any) {
    const db = conDb();

    const createTime = new Date().getTime();

    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM category_table WHERE sort LIKE "${sort}"`,
        (err: any, list: any) => {
          if (err) {
            reject({ code: 400, msg: err, data: [] });
          } else {
            if (list.length) {
              resolve({ code: 201, msg: 'sort repeat', data: list });
            } else {
              db.run(
                `INSERT INTO category_table (name, remark,sort, createTime) values ("${name}", "${remark}","${sort}", "${createTime}")`,
                (error: any, data: any) => {
                  if (error) {
                    reject({ code: 400, msg: error });
                  } else {
                    resolve({ code: 200, msg: '成功', data });
                  }
                },
              );
            }
          }
        },
      );
    });
  },
  upDate(params: any) {
    const { code, content, tag } = params;
    const db = conDb();

    return new Promise((resolve, reject) => {
      const inquire = `select * from category_table where code = "${code}"`;
      const sql = `UPDATE category_table SET content = "${content}", tag = "${tag}" WHERE code = "${code}"`;
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
  delData({ id = 1 }) {
    const sql = `DELETE FROM category_table WHERE id = ${id}`;
    const weightSql = `select * from category_table where id = ${id}`;
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

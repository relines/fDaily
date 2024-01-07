/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-lonely-if */
/* eslint-disable prefer-promise-reject-errors */
import dayjs from 'dayjs';

import conDb from './index';

export default {
  getData() {
    const db = conDb();
    // 获取total语法
    const totalSql = `select count(*) total from category_table`;

    // 实现分页语法
    const sql = `select * from category_table ORDER BY sort ASC`;

    let total = 0;
    return new Promise((resolve, reject) => {
      // 统计总数
      db.all(totalSql, (err: any, totalData: any) => {
        if (err) {
          reject({ code: 200, msg: err, data: '查询总数错误' });
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
  addData({ name, remark, sort, current }: any) {
    const db = conDb();

    const createTime = new Date().getTime();

    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM category_table WHERE name LIKE "${name}"`,
        (err1: any, list1: any) => {
          if (err1) {
            reject({ code: 400, msg: err1, data: [] });
          } else {
            if (list1.length) {
              resolve({ code: 201, msg: 'name repeat', data: list1 });
            } else {
              db.all(
                `SELECT * FROM category_table WHERE sort LIKE "${sort}"`,
                (err2: any, list2: any) => {
                  if (err2) {
                    reject({ code: 400, msg: err2, data: [] });
                  } else {
                    if (list2.length) {
                      resolve({ code: 201, msg: 'sort repeat', data: list });
                    } else {
                      db.run(
                        `INSERT INTO category_table (name, remark, sort, current, createTime) values ("${name}", "${remark}", "${sort}", "${current}", "${createTime}")`,
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
            }
          }
        },
      );
    });
  },
  updateData(params: any) {
    const { id, name, remark, sort } = params;
    const db = conDb();

    return new Promise((resolve, reject) => {
      const inquire = `select * from category_table where id = "${id}"`;
      const sql = `UPDATE category_table SET name = "${name}", remark = "${remark}", sort = "${sort}" WHERE id = "${id}"`;

      db.all(
        `SELECT * FROM category_table WHERE name LIKE "${name}"`,
        (err1: any, list1: any) => {
          if (err1) {
            reject({ code: 400, msg: err1, data: [] });
          } else {
            if (list1.length) {
              resolve({ code: 201, msg: 'name repeat', data: list1 });
            } else {
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
            }
          }
        },
      );
    });
  },
  setCurrent(params: any) {
    const { name } = params;
    const db = conDb();
    return new Promise((resolve, reject) => {
      const inquire = `select * from category_table where current = "1"`;
      const sql1 = `UPDATE category_table SET current = "2"`;
      const sql2 = `UPDATE category_table SET current = "1" WHERE name = "${name}"`;
      db.run(sql1, (err1: any, data1: any) => {
        if (err1) {
          reject({ code: 400, msg: err1 });
        } else {
          db.run(sql2, (error: any, data: any) => {
            if (error) {
              reject({ code: 400, msg: error });
            } else {
              db.all(inquire, (err: any, item: any) => {
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
        }
      });
    });
  },
  delData({ id }: any) {
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
            resolve({ code: 400, msg: `数据不存在` });
          }
        }
      });
    });
  },
};

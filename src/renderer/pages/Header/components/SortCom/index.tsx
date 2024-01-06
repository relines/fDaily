/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-unstable-nested-components */
// 分类设置
import React, { useState } from 'react';

import { Space, Table, Button } from 'antd';

import styles from './index.module.less';

type Iprops = {
  dataSource: any[];
};

export default function SortCom(props: Iprops) {
  const { dataSource } = props;

  const [loading, setLoading] = useState<boolean>(false);

  const columns: any[] = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      align: 'center',
    },
    {
      title: '日记数',
      dataIndex: 'number',
      key: 'number',
      width: 100,
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 200,
      align: 'center',
    },
    {
      title: '操作',
      key: 'operate',
      align: 'center',
      render: (_: any, record: any) => (
        <div
          style={{
            textAlign: 'center',
          }}
        >
          <a>编辑</a>
          <a>删除</a>
        </div>
      ),
    },
  ];

  const data: any[] = [
    {
      key: '1',
      name: '分类一',
      number: 32,
      remark: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: '分类二',
      number: 42,
      remark: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
      name: '分类三',
      number: 32,
      remark: 'Sydney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.topbar}>
        <Button type="primary">新增</Button>
      </div>
      <Table
        rowKey="key"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total: number, range: number[]) => {
            const Styles = {
              color: '#2766FF',
            };
            return (
              <span>
                第
                <strong>
                  <span style={Styles}>{range[0]}</span>
                </strong>{' '}
                -{' '}
                <strong>
                  <span style={Styles}> {range[1]} </span>
                </strong>
                条，总共
                <strong>
                  {' '}
                  <span style={Styles}>{total}</span>
                </strong>{' '}
                条
              </span>
            );
          },
        }}
      />
    </div>
  );
}

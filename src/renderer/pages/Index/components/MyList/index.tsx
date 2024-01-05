/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
import React, { useState, useEffect, useRef } from 'react';
import VirtualList from 'rc-virtual-list';
import { List, message } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';

import dayjs from 'dayjs';

import styles from './index.module.less';

require('dayjs/locale/zh-cn');

const ContainerHeight = 500;

type Iprops = {};

export default function Index(props: Iprops) {
  const [activeRecord, setActiveRecord] = useState<any>({});
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);

  const pageIndexRef = useRef<number>(0);

  const getData = async () => {
    const result = await window.electron.ipcRenderer.invoke('get-list', {
      pageIndex: pageIndexRef.current,
    });
    if (result.data?.length) {
      pageIndexRef.current += 1;
      setTableData(tableData.concat(result.data));
      setTotal(result.total);
      message.success('+10条数据');
    } else {
      message.warning('没有更多数据了');
    }
  };

  const addData = async () => {
    setLoading(true);
    await window.electron.ipcRenderer.invoke('add-data', {
      content: '',
      tag: 'default',
    });
    setLoading(false);
    getData();
  };

  useEffect(() => {
    getData();
  }, []);

  const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    if (
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
      ContainerHeight
    ) {
      getData();
    }
  };

  return (
    <div className={styles.container}>
      <List>
        <div className={styles.header}>
          <span>共{total}条</span>
          <PlusCircleOutlined
            disabled={loading}
            style={{
              float: 'right',
              cursor: 'pointer',
              marginTop: '3px',
            }}
            onClick={() => addData()}
          />
        </div>
        <VirtualList
          data={tableData}
          height={ContainerHeight}
          itemHeight={50}
          itemKey="email"
          onScroll={onScroll}
        >
          {(item: any) => (
            <List.Item key={item.email} className={styles.listItem}>
              <div className={styles.timeLine}>
                <div className={styles.left}>
                  {dayjs(item.createdTime).format('DD')}
                </div>
                <div className={styles.right}>
                  <div>{dayjs(item.createdTime).format('MM')}月</div>
                  <div>
                    {dayjs(item.createdTime).locale('zh-cn').format('dddd')}
                  </div>
                </div>
              </div>
              <div className={styles.liner}>
                <div className={styles.circle} />
                <div className={styles.line} />
              </div>
              <div
                className={`${styles.content} ${
                  activeRecord.code === item.code && styles.activedContent
                }`}
                onClick={() => {
                  setActiveRecord(item);
                }}
              >
                <div className={styles.text}>{item.content}</div>
                <div className={styles.img}>
                  {/* <Avatar src={item.picture} /> */}
                </div>
                <div className={styles.bottom}>
                  <span className={styles.time}>
                    {dayjs(item.createdTime).format('YYYY-MM-DD HH:mm:ss')}
                  </span>
                </div>
              </div>
            </List.Item>
          )}
        </VirtualList>
      </List>
    </div>
  );
}

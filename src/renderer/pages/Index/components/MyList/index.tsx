/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
import React, { useState, useEffect } from 'react';
import VirtualList from 'rc-virtual-list';
import { Avatar, List, message } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';

import dayjs from 'dayjs';

import styles from './index.module.less';

interface UserItem {
  email: string;
  gender: string;
  name: {
    first: string;
    last: string;
    title: string;
  };
  nat: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
}

const fakeDataUrl =
  'https://randomuser.me/api/?results=20&inc=name,gender,email,nat,picture&noinfo';
const ContainerHeight = 500;

type Iprops = {};

export default function Index(props: Iprops) {
  const [data, setData] = useState<UserItem[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const appendData = () => {
    fetch(fakeDataUrl)
      .then((res) => res.json())
      .then((body) => {
        setData(data.concat(body.results));
        message.success(`${body.results.length} more items loaded!`);
      });
  };

  const getData = async () => {
    const result = await window.electron.ipcRenderer.invoke('get-list', '');
    const list = result.data.map((item: any) => {
      return {
        ...item,
        createdTime: dayjs(item.createdTime).format('YYYY-MM-DD HH:mm:ss'),
      };
    });
    setTableData(list);
  };

  const addData = async () => {
    setLoading(true);
    const result = await window.electron.ipcRenderer.invoke('add-data', {
      content: '',
      tag: 'default',
    });
    setLoading(false);
    console.log(333, result);
  };

  useEffect(() => {
    appendData();
    getData();
  }, []);

  const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    if (
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
      ContainerHeight
    ) {
      appendData();
    }
  };

  return (
    <div className={styles.container}>
      <List>
        <div className={styles.header}>
          <button
            type="button"
            onClick={() => {
              getData();
            }}
          >
            getList
          </button>
          <PlusCircleOutlined
            disabled={loading}
            style={{
              float: 'right',
              cursor: 'pointer',
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
          {(item: UserItem) => (
            <List.Item key={item.email} className={styles.listItem}>
              {console.log(333, item)}
              <div className={styles.timeLine}>
                <div className={styles.left}>30</div>
                <div className={styles.right}>
                  <div>11月</div>
                  <div>星期四</div>
                </div>
              </div>
              <div className={styles.liner}>
                <div className={styles.circle} />
                <div className={styles.line} />
              </div>
              <div className={styles.content}>
                <div className={styles.text}>{item.content}</div>
                <div className={styles.img}>
                  {/* <Avatar src={item.picture} /> */}
                </div>
                <div className={styles.bottom}>
                  <span className={styles.time}>{item.createdTime}</span>
                </div>
              </div>
            </List.Item>
          )}
        </VirtualList>
      </List>
    </div>
  );
}

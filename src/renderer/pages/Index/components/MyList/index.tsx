/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
import React, { useState, useEffect } from 'react';
import VirtualList from 'rc-virtual-list';
import { Avatar, List, message } from 'antd';
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

  const appendData = () => {
    fetch(fakeDataUrl)
      .then((res) => res.json())
      .then((body) => {
        setData(data.concat(body.results));
        message.success(`${body.results.length} more items loaded!`);
      });
  };

  const getData = async () => {
    const result = await window.electron.ipcRenderer.invoke(
      'get-list',
      'SELECT * FROM user',
    );
    console.log(333, result);
  };

  const addData = async () => {
    const result = await window.electron.ipcRenderer.invoke('add-data', {
      name: 'harry',
      email: '123@qq.com',
      phone: 130303030303,
    });
    console.log(333, result);
  };

  useEffect(() => {
    appendData();
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
        <button
          type="button"
          onClick={() => {
            getData();
          }}
        >
          getList
        </button>
        <button
          type="button"
          onClick={() => {
            addData();
          }}
        >
          addData
        </button>
        <VirtualList
          data={data}
          height={ContainerHeight}
          itemHeight={50}
          itemKey="email"
          onScroll={onScroll}
        >
          {(item: UserItem) => (
            <List.Item key={item.email} className={styles.listItem}>
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
                <div className={styles.text}>{item.email}</div>
                <div className={styles.img}>
                  <Avatar src={item.picture.large} />
                </div>
                <div className={styles.bottom}>
                  <span className={styles.time}>2023-12-03 12:07:17</span>
                </div>
              </div>
            </List.Item>
          )}
        </VirtualList>
      </List>
    </div>
  );
}

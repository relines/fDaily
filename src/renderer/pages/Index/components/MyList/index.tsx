/* eslint-disable import/no-cycle */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
import React, { useState } from 'react';
import VirtualList from 'rc-virtual-list';
import { List } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';

import dayjs from 'dayjs';

import styles from './index.module.less';

require('dayjs/locale/zh-cn');

const ContainerHeight = 500;

type Iprops = {
  dataSource: any[];
  total: number;
  updateDataSource: () => void;
  activeItem: any;
  changeActiveItem: any;
};

export default function Index(props: Iprops) {
  const { dataSource, total, updateDataSource, activeItem, changeActiveItem } =
    props;

  const [loading, setLoading] = useState<boolean>(false);

  const addData = async () => {
    setLoading(true);
    await window.electron.ipcRenderer.invoke('add-data', {
      content: '',
      tag: 'default',
    });
    setLoading(false);
    updateDataSource();
  };

  const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    if (
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
      ContainerHeight
    ) {
      updateDataSource();
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
          data={dataSource}
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
                  activeItem.code === item.code && styles.activedContent
                }`}
                onClick={() => {
                  changeActiveItem(item);
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

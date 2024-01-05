/* eslint-disable react/jsx-no-constructed-context-values */
import React, { useState, useEffect, useRef } from 'react';

import { message } from 'antd';

import MyCalendar from './components/MyCalendar';
import MyList from './components/MyList';
import MyEdit from './components/MyEdit';

import styles from './index.module.less';

export default function IndexCom() {
  const [activeItem, setActiveItem] = useState({});
  const [tableData, setTableData] = useState([]);
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

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className={styles.container}>
      <div className={`${styles.content} ${styles.calendarContainer}`}>
        <MyCalendar />
      </div>
      <div className={`${styles.content} ${styles.listContainer}`}>
        <MyList
          dataSource={tableData}
          total={total}
          updateDataSource={() => getData()}
          activeItem={activeItem}
          changeActiveItem={setActiveItem}
        />
      </div>
      <div className={`${styles.content} ${styles.editContainer}`}>
        <MyEdit updateDataSource={() => getData()} activeItem={activeItem} />
      </div>
    </div>
  );
}

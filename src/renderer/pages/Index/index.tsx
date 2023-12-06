import React, { useState, useEffect } from 'react';

import MyCalendar from './components/MyCalendar';
import MyList from './components/MyList';
import MyEdit from './components/MyEdit';

import styles from './index.module.less';

export default function IndexCom() {
  return (
    <div className={styles.container}>
      <div className={`${styles.content} ${styles.calendarContainer}`}>
        <MyCalendar />
      </div>
      <div className={`${styles.content} ${styles.listContainer}`}>
        <MyList />
      </div>
      <div className={`${styles.content} ${styles.editContainer}`}>
        <MyEdit />
      </div>
    </div>
  );
}

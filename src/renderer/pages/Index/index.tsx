import React, { useState, useEffect } from 'react';

import styles from './index.module.less';

export default function IndexCom() {
  return (
    <div className={styles.container}>
      <div className={`${styles.content} ${styles.calendarContainer}`}>
        {/* <MyCalendar /> */}1
      </div>
      <div className={`${styles.content} ${styles.listContainer}`}>
        {/* <MyList /> */}2
      </div>
      <div className={`${styles.content} ${styles.editContainer}`}>
        {/* <MyEdit /> */}3
      </div>
    </div>
  );
}

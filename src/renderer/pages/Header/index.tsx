/* eslint-disable react/jsx-no-constructed-context-values */
import React, { useState, useEffect, useRef } from 'react';

import { message } from 'antd';
import { CloseOutlined, MinusOutlined } from '@ant-design/icons';

import styles from './index.module.less';

export default function HeaderCom() {
  const [isFullScreen, setIsFullScreen] = useState<any>(false);

  window.electron.ipcRenderer.on('mainWindowResize', (arg) => {
    setIsFullScreen(arg);
  });

  return (
    <div
      className={styles.container}
      style={
        isFullScreen
          ? {}
          : {
              marginLeft: '57px',
            }
      }
    >
      <div className={styles.icons}>
        <CloseOutlined
          className={styles.icon}
          style={{
            background: '#FF5F56',
          }}
        />
        <MinusOutlined
          className={styles.icon}
          style={{
            background: '#FFBD2E',
          }}
        />
      </div>
    </div>
  );
}

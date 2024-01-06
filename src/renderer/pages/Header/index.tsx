/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-no-constructed-context-values */
import React, { useState, useEffect, useRef } from 'react';

import { Button, Dropdown, Modal } from 'antd';
import { MenuUnfoldOutlined } from '@ant-design/icons';

import SortCom from './components/SortCom';

import styles from './index.module.less';

export default function HeaderCom() {
  const [isFullScreen, setIsFullScreen] = useState<any>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <Dropdown
        trigger={['click']}
        menu={{
          items: [
            {
              key: '1',
              label: <div onClick={() => setIsModalOpen(true)}>主目录设置</div>,
            },
            {
              key: '2',
              label: '分类设置',
            },
            {
              key: '3',
              label: '标签设置',
              children: [
                {
                  key: '1-1',
                  label: '新建标签',
                },
                {
                  key: '1-2',
                  label: '2nd menu item',
                },
              ],
            },
          ],
        }}
      >
        <div className={styles.setup}>
          <MenuUnfoldOutlined />
        </div>
      </Dropdown>

      <Modal
        title="分类设置"
        open={isModalOpen}
        width={600}
        onOk={() => {}}
        onCancel={() => setIsModalOpen(false)}
      >
        <SortCom dataSource={[]} />
      </Modal>
    </div>
  );
}

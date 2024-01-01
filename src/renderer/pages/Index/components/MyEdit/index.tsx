/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import styles from './index.module.less';

// const ReactQuill =
//   typeof window === 'object' ? require('react-quill') : () => false;

type Iprops = {};

export default function Index(props: Iprops) {
  const [value, setValue] = useState('');

  const quillRef = useRef<any>();

  return (
    <div className={styles.container}>
      <div
        onClick={() => {
          console.log(3, value);
        }}
      >
        getVal
      </div>
      <ReactQuill
        theme="snow"
        ref={quillRef}
        value={value}
        modules={
          {
            // toolbar: [[{ color: [] }, { background: [] }]],
          }
        }
        style={{
          // width: '608px',
          height: '160px',
          resize: 'none',
          borderRadius: '5px',
          marginBottom: '5px',
        }}
        onChange={setValue}
      />
    </div>
  );
}

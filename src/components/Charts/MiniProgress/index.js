import React from 'react';
import {  } from 'antd-mobile';

import styles from './index.less';

const MiniProgress = ({ target, color = 'rgb(19, 194, 194)', strokeWidth, percent }) => (
  <div className={styles.miniProgress}>
    <div title={`目标值: ${target}%`}>
      <div
        className={styles.target}
        style={{ left: (target ? `${target}%` : null) }}
      >
        <span style={{ backgroundColor: (color || null) }} />
        <span style={{ backgroundColor: (color || null) }} />
      </div>
    </div>
    <div className={styles.progressWrap}>
      <div
        className={styles.progress}
        style={{
          backgroundColor: (color || null),
          width: (percent ? `${percent}%` : null),
          height: (strokeWidth || null),
        }}
      />
    </div>
  </div>
);

export default MiniProgress;

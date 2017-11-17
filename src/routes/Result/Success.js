import React from 'react';
import {Link} from 'dva/router';
import { Flex } from 'antd-mobile';
import Result from '../../components/Result';
import classNames from 'classnames';
import styles from './Result.less';
import SS from 'parsec-ss';


export default ()=>{
  const dataList = SS.getObj('dataList');
  const completeData = SS.getObj('completeData');
  const timeConsuming = SS.get('timeConsuming');
  const paperType = SS.get('paperType');

  console.log('dataList',dataList);
  console.log('completeData',completeData);
  console.log('timeConsuming',timeConsuming);
  console.log('paperType',paperType);


  const extra = (<div></div>);

  const urls = ['/exam','/study']; //0 为考试，1为学习

  const actions = (
    <Flex>
      <Flex.Item>
        <Link to={urls[parseInt(paperType) - 1]}>
          <div className={styles.resultIcon}><i className={styles.carmeIcon}>&#xe624;</i></div>
          <p>返回试题</p></Link>
      </Flex.Item>
      <Flex.Item>
        <Link to={'/paper/result'}>
          <div className={classNames(styles.resultIcon,styles.error)}><i className={styles.carmeIcon}>&#xe62a;</i></div>
          <p>查看错题</p>
        </Link>
      </Flex.Item>
    </Flex>
  );
  return(<Result
    type="success"
    title="提交成功"
    description={`本次答题总用时：${timeConsuming || 3} 秒`}
    // extra={extra}
    actions={actions}
  />);
};

import React from 'react';
import {Link} from 'dva/router';
import { Icon } from 'antd-mobile';
import Result from '../../components/Result';


const extra = (
  <div>
    <div style={{fontSize: 22, color: 'rgba(0, 0, 0, 0.85)', fontWeight: '500', marginBottom: 16}}>
      您提交的内容有如下错误：
    </div>
    <p style={{marginBottom: 16 ,fontSize: 18,lineHeight:1.5}}>
      <Icon style={{color: '#f5222d', marginRight: 8,verticalAlign:'middle'}} type="cross-circle-o" size='xxs'/>您的账户已被冻结
      <a style={{marginLeft: 16}}>立即解冻 <Icon type="right" size='xxs' style={{verticalAlign:'middle'}}/></a>
    </p>
    <p style={{fontSize: 18,lineHeight:1.5}}>
      <Icon style={{color: '#f5222d', marginRight: 8,verticalAlign:'middle'}} type="cross-circle-o" size='xxs'/>您的账户还不具备申请资格
      <a style={{marginLeft: 16}}>立即升级 <Icon type="right" size='xxs' style={{verticalAlign:'middle'}}/></a>
    </p>
  </div>
);

const actions = <Link to={'/'}>返回试题</Link>;

export default () => (
  <div>
    <Result
      type="error"
      title="提交失败"
      description="请核对并修改以下信息后，再重新提交。"
      extra={extra}
      actions={actions}
    />
  </div>
);

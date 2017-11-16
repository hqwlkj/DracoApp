import React from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {NavBar,Icon} from 'antd-mobile';
import styles from './MessageDetails.less';


@connect(state => ({}))
export default class MessageDetails extends React.Component {
  constructor(props) {
    super(props);
    let msgId = parseInt(this.props.location.pathname.split('/').pop());
    this.state = {
      msgId,//消息Id
      message: {},//本条消息详情
    }
  }

  render() {
    return (
      <div className={styles.message_details_component}>
        <NavBar
          mode="dark"
          icon={<Icon type='left'/>}
          onLeftClick={() => this.props.dispatch(routerRedux.goBack())}
        >消息详情</NavBar>
        <div className={styles.message_details_container}>
          <h2 className={styles.msg_title}>{this.state.message.title}</h2>
          <div className={styles.msg_time}>{this.state.message.createTime}</div>
          <div className={styles.msg_content}>
            {this.state.message.content}
          </div>
        </div>
      </div>
    );
  }
}



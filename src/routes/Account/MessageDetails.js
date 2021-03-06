import React from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {NavBar,Icon} from 'antd-mobile';
import styles from './MessageDetails.less';


@connect(state => ({
  messages: state.messages,
}))
export default class MessageDetails extends React.Component {
  constructor(props) {
    super(props);
    let msgId = parseInt(this.props.location.pathname.split('/').pop());
    this.state = {
      msgId,//消息Id
      message: {},//本条消息详情
    };
  }


  componentWillMount() {

  }

  componentDidMount() {
    this.getMessageDetail();
  }

  componentWillReceiveProps(nextProps) {
    const msg = nextProps.messages.data;
    this.setState({
      message: msg,
    });
  }



  // 消息列表数据
  getMessageDetail() {
    const { dispatch } = this.props;
    const params = {
      id: this.state.msgId,
    }
    console.log(params);
    dispatch({
      type: 'messages/fetchMessageDetail',
      payload: params.id,
    });
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



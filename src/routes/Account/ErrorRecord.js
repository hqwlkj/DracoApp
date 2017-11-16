import React from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {List, Badge, NavBar, Button, Icon,Toast} from 'antd-mobile';
import styles from './ErrorRecord.less';

@connect(state => ({
  errorRecord: state.errorRecord
}))
export default class ErrorRecordComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: [{title: '单选题', color: '#55cdb5'}, {title: '多选题', color: '#f19736'}]
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'errorRecord/fetchErrorRecordTotalNum'
    });
    // const {} = this.props;
    // this.setState({isLoading: true});
    // let headers = {};
    // headers['userId'] = SS.get(Config.USER_ID);
    // headers['answerId'] = SS.get(Config.TOKEN_ID);
    // requestService.get(dataApi['error_record']['num'], {}, headers).then((data) => {
    //   if (data.code === 200) {
    //     let allNum = 0;
    //     _.map(data.result, (o) => {
    //       allNum += o.num
    //     });
    //     this.setState({
    //       allNum: allNum,
    //       dataList: _.filter(data.result, (o) => {
    //         o.questionType === 1 ? o.title = '单选题' : o.title = '多选题';
    //         o.questionType === 1 ? o.color = '#55cdb5' : o.color = '#f19736';
    //         return o;
    //       })
    //     })
    //   } else {
    //     Toast.error('查询失败，请稍后重试');
    //   }
    // });
  }

  componentDidUpdate() {
    const { loading} = this.props.errorRecord;
    console.log('componentDidUpdate',loading);
    if (loading) {
      Toast.loading('加载中...',0);
    }else{
      Toast.hide();
    }
  }

  /**
   * 页面跳转
   * @param type 题目类型
   * */
  goToWrongTitle(type) {
    this.props.dispatch(routerRedux.push('/account/wrong/title/' + type));
  }


  render() {
    const {data = {}, loading} = this.props.errorRecord;
    console.log(data);
    return (
      <div className={styles.error_record_component}>
        <NavBar
          mode='dark'
          onLeftClick={() => this.props.dispatch(routerRedux.push('/account'))}
          icon={<Icon type='left'/>}
        >错题汇总</NavBar>

        <div className={styles.error_header}>
          <div className={styles.error_header_content}>
            <p>全部错题</p>
            <div className={styles.num}>{(data.allNum || 0)} <span>题</span></div>
            <div className={styles.rond}>&nbsp;</div>
          </div>
          <Button className={styles.error_header_learn} onClick={() => {
            this.props.dispatch(routerRedux.push('/study'))
          }}>我要练习</Button>
          <p className={styles.error_header_desc}>认真学习知识要点，让我这里变得冷清一点吧~</p>
        </div>
        <div className={styles.error_body}>
          {this.state.dataList.length === 0 ?
            <div className={styles.noDataContainer} style={{height: '5rem'}}>
              <div className={styles.noDataContent}>
                <i className={styles.carmeIcon}>&#xe6f7;</i>
                <div className={styles.info}>没有任何数据</div>
              </div>
            </div>
            :
            <List renderHeader={() => <div className={styles.test_header_title}>
              <span><i className={styles.carmeIcon}>&#xe6b3;</i>错题分类解析练习</span>
            </div>} className={styles.my_list}>
              <List.Item key={Math.random()} extra={data.radioNum || 0} arrow='horizontal' onClick={() => {
                this.goToWrongTitle(1)
              }}>
                <Badge text={'单'} style={{
                  marginRight: 15,
                  padding: '0.03rem 0.1rem',
                  backgroundColor: '#55cdb5',
                  borderRadius: 50
                }}/>单选
              </List.Item>
              <List.Item key={Math.random()} extra={data.checkboxNum || 0} arrow='horizontal' onClick={() => {
                this.goToWrongTitle(2)
              }}>
                <Badge text={'多'} style={{
                  marginRight: 15,
                  padding: '0.03rem 0.1rem',
                  backgroundColor: '#f19736',
                  borderRadius: 50
                }}/>多选
              </List.Item>
            </List>
          }
        </div>
      </div>
    );
  }
}

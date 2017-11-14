'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'dva';
import {Link} from 'dva/router';
import {PullToRefresh, ListView, List, Badge, Flex, NavBar, Icon, Toast} from 'antd-mobile';
import {Pie} from '../../components/Charts';
import moment from 'moment';
import classnames from 'classnames';

import styles from './Index.less';


/**
 * 判断当前时间与试卷当日时间的关系
 * @param startTime 试卷的开始时间  HH:mm:ss
 * @param endTime   试卷的结束时间  HH:mm:ss
 *
 * return 1:当前时间>endTime; 0:startTime<=当前时间<=endTime; -1:当前时间<startTime
 */
function calculatPaperTimeRelation(startTime, endTime) {
  let date = moment(new Date()).format('YYYY/MM/DD');
  let c = new Date().getTime();
  let s = new Date(date + ` ${startTime}`).getTime();
  let e = new Date(date + ` ${endTime}`).getTime();
  return c < s ? -1 : c < e ? 0 : 1;
}

class TestComponent extends React.Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });
    this.state = {
      dataSource: dataSource,
      refreshing: true,
      isLoading: true,
      initData: [],
      height: document.documentElement.clientHeight,
      currentDayPaper: 0,
      allCurrentDayPaper: 0
    };
  }

  loadData(pagination) {
    const {dispatch} = this.props;
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };
    dispatch({
      type: 'exam/fetch',
      payload: params,
    });
  }

  componentDidMount() {
    const hei = this.state.height - ReactDOM.findDOMNode(this.lv).offsetTop;
    setTimeout(() => {
      this.setState({
        height: hei,
        refreshing: false,
        isLoading: false,
      });
    }, 1500);
  }

  componentWillReceiveProps(nextProps) {
    let props = this.props;
    let data = nextProps.exam.data;
    debugger;
    this.setState({
      currentDayPaper: (data || {}).result.list.filter(s=>s.maxCount>0).length,
      allCurrentDayPaper: (data || {}).list.length,
      dataSource: this.state.dataSource.cloneWithRows((data || {}).list),
      refreshing: false,
      isLoading: false,
    });
  }


  componentWillUnmount() {
  }

  componentWillMount() {
    const {data} = this.props;
    console.log('componentWillMount-data',data);
    this.loadData({current:1,pageSize:10});
  }

  onRefresh = () => {
    console.log('onRefresh');
    if (!this.manuallyRefresh) {
      this.setState({refreshing: true});
    } else {
      this.manuallyRefresh = false;
    }
    this.loadData({current:1,pageSize:10});
  };

  /**
   * 跳转到试卷页面
   * @param id 时间ID
   * @param time 考试总时间 （分）
   */
  goToPaper(id, time) {
    window.location.href = '#/paper/3/' + id + '/' + time + '/0'
  }


  render() {
    const {exam: {loading: refreshing, data}} = this.props;
    console.log('data',data);
    const separator = (sectionID, rowID) => (
      <div
        key={`${sectionID}-${rowID}`}
        style={{
          backgroundColor: '#F5F5F9',
          height: 20
        }}
      />
    );
    const row = (rowData, sectionID, rowID) => {
      // if (index < 0) {
      //   index = data.length - 1;
      // }
      let badge;
      let state = calculatPaperTimeRelation(rowData.startTime, rowData.endTime);
      switch (state) {
        case -1:
          badge = <Badge text='未开始'
                         style={{marginRight: 12, padding: '0 0.06rem', backgroundColor: '#f19736', borderRadius: 2}}/>;
          break;
        case 0:
          badge = <Badge text='进行中...'
                         style={{marginRight: 12, padding: '0 0.06rem', backgroundColor: '#21b68a', borderRadius: 2}}/>;
          break;
        case 1:
          badge = <Badge text='已完成' style={{
            marginRight: 12,
            padding: '0 0.06rem',
            backgroundColor: '#fff',
            borderRadius: 2,
            color: '#f19736',
            border: '1px solid #f19736',
          }}/>;
          break;
      }
      //判断次数到了没
      if (rowData.lengthTime <= rowData.maxCount) {
        badge = <Badge text='已完成' style={{
          marginRight: 12,
          padding: '0 0.06rem',
          backgroundColor: '#fff',
          borderRadius: 2,
          color: '#f19736',
          border: '1px solid #f19736',
        }}/>
      }
      return (
        <List className={styles.test_list} key={rowID}>
          <List.Item
            data-seed='logId'
            arrow='horizontal'
            multipleLine
            onClick={() => {
              if (rowData.maxCount >= rowData.frequency && rowData.frequency) {
                Toast.fail('你已经完成了本次考试');
                return;
              }
              if (state === -1) {
                Toast.fail('考试还没开始呢');
                return;
              }
              if (state === 1) {
                Toast.fail(`${rowData.name}的考试时间已经过啦`);
                return;
              }
              this.goToPaper(rowData.id, rowData.lengthTime);
            }}>
            <div className={styles.test_title}>
              {badge} {rowData.name}</div>
            <List.Item.Brief>开始日期：<span>{rowData.startDay}</span></List.Item.Brief>
            <List.Item.Brief>结束日期：<span>{rowData.endDay}</span></List.Item.Brief>
            <List.Item.Brief>答题时段：<span>{rowData.startTime + '-' + rowData.endTime}</span></List.Item.Brief>
            <List.Item.Brief>考试时间：<span>{rowData.lengthTime}</span>分钟</List.Item.Brief>
            <List.Item.Brief>题目数量：<span>{rowData.subjectCount}</span>题</List.Item.Brief>
          </List.Item>
        </List>
      );
    };

    return (
      <div className={styles.test_component}>
        <NavBar key='NavBar' icon={<Icon type="left"/>}
                onLeftClick={() => window.history.go(-1)} rightContent={
          <i className={styles.carmeIcon} onClick={() => {
            window.location.href = '#/account';
          }}>&#xe604;</i>
        }>在线考试</NavBar>
        <div className={styles.test_header}>
          <Flex>
            <Flex.Item>
              <Pie
                animate={false}
                percent={28}
                subTitle="完成率"
                total="28%"
                height={268}
                lineWidth={1}
              />
            </Flex.Item>
            <Flex.Item className={styles.test_info_box}>
              <p>今日考试数：<span>{this.state.allCurrentDayPaper}</span></p>
              <p>已参加考试：<span>{this.state.currentDayPaper}</span></p>
            </Flex.Item>
          </Flex>
        </div>
        <div className={styles.test_body}>
          <ListView
            ref={el => this.lv = el}
            dataSource={this.state.dataSource}
            renderRow={row}
            renderSeparator={separator}
            initialListSize={5}
            pageSize={5}
            scrollRenderAheadDistance={200}
            onEndReachedThreshold={50}
            scrollEventThrottle={20}
            style={{height: this.state.height, overflow: 'auto'}}
            scrollerOptions={{scrollbars: true}}
            pullToRefresh={<PullToRefresh
              refreshing={refreshing}
              onRefresh={this.onRefresh}
            />}
            onEndReached={this.onEndReached}
            renderFooter={() => refreshing ?
              <div className={styles.loadMore}><Icon type='loading' size='xs'/> 数据加载中...</div> :
              (((data || {}).list || []).length > 0 ? <div className={styles.noMore}>我是有底线的</div> :
                <div className={styles.noDataContainer} style={{height: (this.state.height - 100)}}>
                  <div className={styles.test_component}>
                    <i className={styles.carmeIcon}>&#xe6f7;</i>
                    <div className={styles.info}>没有任何数据</div>
                  </div>
                </div>)}
          />
        </div>
      </div>
    );
  }
}

TestComponent.displayName = 'ExamTestComponent';

// Uncomment properties you need
// CourseComponent.propTypes = {};
// CourseComponent.defaultProps = {};

export default connect(state => ({
  exam: state.exam
}))(TestComponent);

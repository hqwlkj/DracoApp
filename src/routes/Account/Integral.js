import React from "react";
import ReactDOM from "react-dom";
import {connect} from "dva";
import {routerRedux} from "dva/router";
import {Icon, List, ListView, NavBar, PullToRefresh} from "antd-mobile";

import styles from "./Integral.less";

@connect(state => ({
  exam: state.exam
}))
export default class Integral extends React.Component {

  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });

    this.initData = [];
    for (let i = 0; i < 20; i++) {
      this.initData.push(`r${i}`);
    }
    this.state = {
      pageIndex: 1,
      dataSource,
      originData: [],
      refreshing: false,
      height: document.documentElement.clientHeight,
      hasMore: false, //有更多数据的时候 设置为 true
      isLoading: true,
      pageNo: 1,
      pageSize: 10,
      dataIndex: 0,
    };
  }

  loadData(pageNo = 1) {
    const {dispatch} = this.props;
    const params = {
      currentPage: pageNo,
      pageSize: 0x7fffffff,
    };
    dispatch({
      type: 'exam/fetchCredit',
      payload: params,
    });
  }

  componentDidMount() {
    const hei = this.state.height - ReactDOM.findDOMNode(this.lv).offsetTop;
    this.loadData();
    this.setState({
      height: hei
    });
  }

  componentWillReceiveProps(nextProps) {
    let {list = [], score} = nextProps.exam.data;
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(list),
    });
  }

  componentWillMount() {

  }


  onRefresh = () => {
    console.log('onRefresh');
    if (!this.manuallyRefresh) {
      this.setState({refreshing: true, pageIndex: 1});
    } else {
      this.manuallyRefresh = false;
    }
    this.loadData();
  }

  /**
   * 上拉加载更多
   */
  onEndReached = (event) => {
    if (event === undefined) {
      return;
    }
    if (this.state.isLoading && !this.state.hasMore) {
      return;
    }
    if (this.state.pageNo + 1 > this.state.pages) {
      return;
    }
    this.loadData(this.state.pageNo + 1);
  }

  render() {
    const {exam: {loading: refreshing, data}} = this.props;
    console.log(refreshing);
    console.log(data);
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
      return (
        <List className={styles.test_list} key={rowID}>
          <List.Item
            data-seed='logId'
            extra={<span><span
              style={{color: '#f40', fontWeight: 500, fontSize: '36px'}}>{rowData.score}</span> 分</span>}
            multipleLine
          >
            <div className={styles.test_title}>{rowData.source}</div>
            <List.Item.Brief>获得时间：<span>{rowData.createTime}</span></List.Item.Brief>
          </List.Item>
        </List>
      );
    };
    return (<div className={styles.credit_component}>
      <NavBar
        mode='dark'
        onLeftClick={() => this.props.dispatch(routerRedux.push('/account'))}
        icon={<Icon type='left'/>}
      >我的学分</NavBar>
      <div className={styles.credit_head}>
        <p>当前总学分</p>
        <strong className={styles.total_score}>{data.score}</strong>
        <p className={styles.credit_header_desc}>认真学习知识要点，才能获取更多的学分哦~</p>
      </div>
      <div className={styles.credit_body}>
        <ListView
          ref={el => this.lv = el}
          dataSource={this.state.dataSource}
          renderRow={row}
          renderSeparator={separator}
          initialListSize={10}
          pageSize={10}
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
                <div className={styles.noDataContent}>
                  <i className={styles.carmeIcon}>&#xe6f7;</i>
                  <div className={styles.info}>没有任何数据</div>
                </div>
              </div>)}
        />
      </div>
    </div>);
  }
}

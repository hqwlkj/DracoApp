import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'dva';
import {ListView, NavBar, List, Icon, PullToRefresh} from 'antd-mobile';
import styles from './TestRecord.less';


Array.prototype.unique = function () {
  let a = this.concat();
  for (let i = 0; i < a.length; i++) {
    for (let j = i + 1; j < a.length; j++) {
      if (a[i].id === a[j].id) {
        a.splice(j, 1);
      }
    }
  }
  return a;
}
@connect(state => ({
  exam: state.exam
}))
export default class TestRecord extends React.Component {
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
    let originData = this.state.originData || [];
    if (pageNo === 1) {
      originData = [];
    }
    // this.setState({isLoading: true}, () => {
    //   request.get(api.test.record + '?tokenId=' + SS.get(Config.TOKEN_ID) + '&pageNo=' + pageNo).then((data) => {
    //     if (data.code === 200 && data.result && data.result.list) {
    //       if (data.result) {
    //         originData = originData.concat(data.result.list || [])
    //         // const dataSource = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
    //         this.setState({
    //           dataSource: this.state.dataSource.cloneWithRows(originData),
    //           dataIndex: (data.result.list || []).length - 1,
    //           originData: originData,
    //           refreshing: false,
    //           isLoading: false,
    //           hasMore: !data.result.pageNo == data.result.pages,//是否是最有一页
    //           pageNo: pageNo,
    //           pages: data.result.pages
    //         });
    //       } else {
    //       }
    //
    //     } else {
    //       Toast.fail(data.message);
    //     }
    //   });
    // })

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

  componentWillMount() {
    this.loadData();
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

  /**
   * 跳转到试卷页面
   * @param id 时间ID
   * @param time 考试总时间 （分）
   */
  goToRanking(id, title) {
    window.location.href = '#/paper/rank/' + id + '/' + title
  }


  render() {
    const {exam: {loading: refreshing, data}} = this.props;

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
        <List className='test-list' key={rowID}>
          <List.Item
            data-seed='logId'
            arrow='horizontal'
            multipleLine
            onClick={() => {
              this.goToRanking(rowData.id, rowData.title);
            }}
          >
            <div className='test-title'>{rowData.title}</div>
            <List.Item.Brief>正确题目数量：<span>{rowData.rightNum}</span></List.Item.Brief>
            <List.Item.Brief>题目数量：<span>{rowData.totalNum}</span></List.Item.Brief>
            <List.Item.Brief>正确率：<span>{rowData.correctRate}</span></List.Item.Brief>
          </List.Item>
        </List>
      );
    };

    return (
      <div className={styles.test_record_component}>
        <NavBar
          mode='dark'
          onLeftClick={() => window.location.href = '#/account'}
          icon={<Icon type='left'/>}
        >考试记录</NavBar>
        <div className={styles.test_body}>
          <ListView
            ref={el => this.lv = el}
            dataSource={this.state.dataSource}
            renderRow={row}
            renderSeparator={separator}
            renderBodyComponent={() => <MyBody/>} //自定义 body 的包裹组件
            initialListSize={5}
            pageSize={5}
            scrollRenderAheadDistance={200}
            onEndReachedThreshold={50}
            scrollEventThrottle={20}
            style={{height: this.state.height, overflow: 'auto'}}
            scrollerOptions={{scrollbars: true}}
            pullToRefresh={<PullToRefresh
              refreshing={!refreshing}
              onRefresh={this.onRefresh}
            />}
            onEndReached={this.onEndReached}
            renderFooter={() => !refreshing ?
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
      </div>
    );
  }
}


const MyBody = (props) => {
  return (
    <div className='am-list-body my-body'>
      {props.children}
    </div>
  );
}

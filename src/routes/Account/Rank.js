import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'dva';
import {NavBar, Icon, ListView, Tabs, PullToRefresh, List,Flex} from 'antd-mobile';


import styles from './Rank.less';

const colors = ['#f50', '#f78e3d', '#108ee9', '#3dbd7d', '#87d068'];
@connect(state => ({
  exam: state.exam
}))
export default class Rank extends React.Component{

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
      tabActiveKey: '1',
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

  handleTabClick(key) {
    this.setState({
      tabActiveKey: key
    },()=>{this.loadData()})
  }

  loadData(pageNo = 1) {
    const {dispatch} = this.props;
    const params = {
      currentPage: pageNo,
      pageSize: 10,
    };
    dispatch({
      type: 'exam/fetch',
      payload: params,
    });
  }

  componentWillReceiveProps(nextProps) {
    let data = nextProps.exam.data;
    debugger;
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows((data || {}).list),
    });
  }

  componentDidMount() {
    const hei = this.state.height - ReactDOM.findDOMNode(this.lv).offsetTop;
    setTimeout(() => {
      this.loadData();
      this.setState({
        height: hei,
        refreshing: false,
        isLoading: false,
      });
    }, 1500);
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
  };

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
  };

  render(){
    const {exam: {loading: refreshing, data}} = this.props;

    const separator = (sectionID, rowID) => (
      <div
        key={`${sectionID}-${rowID}`}
        style={{
          backgroundColor: '#F5F5F9',
          height: .5
        }}
      />
    );

    const row = (rowData, sectionID, rowID) => {
      return (
        <List className='test-list' key={rowID}>
          <List.Item
            multipleLine
          >
            <Flex>
              <Flex.Item>第{parseInt(rowData.rankNum) + 1}名</Flex.Item>
              <Flex.Item>{rowData.username}</Flex.Item>
              <Flex.Item align='center' style={{color: colors[rowData.rankNum]}}>{rowData.score}</Flex.Item>
            </Flex>
          </List.Item>
        </List>
      );
    };

    return(<div className={styles.rank_component}>
      <NavBar
        mode='dark'
        onLeftClick={() => window.location.href = '#/account'}
        icon={<Icon type='left'/>}
      >我的排名</NavBar>
      <div className={styles.rank_header}>
        <div className={styles.rank_header_content}>
          <i className={styles.carmeIcon}>&#xe6f1;</i>
          <div className={styles.flashing}>
            <i className={styles.carmeIcon}>&#xe631;</i>
            <i className={styles.carmeIcon}>&#xe631;</i>
            <i className={styles.carmeIcon}>&#xe631;</i>
          </div>
        </div>
        <p className={styles.rank_header_desc}>只有认真学习、认真答题，你的名字才会出现在这里哦~</p>
      </div>
      <div className={styles.rank_body}>
        <Tabs initialPage={this.state.tabActiveKey} tabs={[{title:'学分排名'}]} animated={true} onTabClick={() => {
          this.handleTabClick.bind(this)
        }}>
          <div style={{
            display: 'flex',
            backgroundColor: '#fff',
            overflowY: 'scroll',
            minHeight: '8rem'
          }}>
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
        </Tabs>
      </div>
    </div>);
  }
}

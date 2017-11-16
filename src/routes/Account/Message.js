import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import { NavBar, Popover, Icon, List, PullToRefresh, Badge, ListView } from 'antd-mobile';
import classnames from 'classnames';
import styles from './Message.less';
import { Link, routerRedux } from 'dva/router';


@connect(state => ({
  messages: state.messages,
}))
export default class Message extends React.Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.state = {
      dataSource,
      refreshing: true,
      height: document.documentElement.clientHeight,
      hasMore: true, // 有更多数据的时候 设置为 true
      isLoading: true,
      pageNo: 1, // 当前页
      pages: 1,
      pageSize: 10,
      dataIndex: 0,
      msgList: [],
      nowPageData: [],
      visible: false,
      selected: '',
    };
    this.getMsgList = this.getMsgList.bind(this);
  }

  // 消息列表数据
  getMsgList(pageNo = 1) {
    const { dispatch } = this.props;
    const params = {
      currentPage: pageNo,
      pageSize: 10,
      status: 2,
    };
    dispatch({
      type: 'messages/fetch',
      payload: params,
    });
  }

  componentWillMount() {

  }

  componentDidMount() {
    const hei = this.state.height - ReactDOM.findDOMNode(this.lv).offsetTop;
    setTimeout(() => {
      this.getMsgList(1);
      this.setState({
        height: hei,
      });
    }, 1500);
  }

  componentWillReceiveProps(nextProps) {
    const data = nextProps.messages.data;
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows((data || {}).list),
      pageNo: data.pageNo,
      pageSize: data.pageSize,
      pages: data.pages,
    });
  }

  componentWillUnmount() {

  }

  onRefresh = () => {
    if (!this.manuallyRefresh) {
      this.setState({ refreshing: true });
    } else {
      this.manuallyRefresh = false;
    }
    this.getMsgList(1);
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
    this.getMsgList(this.state.pageNo + 1);
  }

  onSelect = (opt) => {
    // console.log(opt.props.value);
    this.setState({
      visible: false,
      selected: opt.props.value,
    });
  };


  // 查看未读消息
  onlyUnRead = (pageNo = 1) => {
    const { dispatch } = this.props;
    const params = {
      currentPage: pageNo,
      pageSize: 10,
      status: 0,
    };
    dispatch({
      type: 'messages/fetch',
      payload: params,
    });
  }


  /**
   * 跳转到消息详情页面
   * @param id 时间ID
   * @param time 考试总时间 （分）
   */
  goToMessageDetails(id) {
    const { dispatch } = this.props;
    // window.location.href = `#/account/message/${id}`;
    dispatch(
      routerRedux.push(`account/message/${id}`));
  }

  // 修改所有未读为已读
  changeMsgRead = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'messages/fetchReadAll',
    });
  }


  handleVisibleChange = (visible) => {
    this.setState({
      visible,
    });
  };


  render() {
    const { messages: { loading: refreshing, data } } = this.props;
    const separator = (sectionID, rowID) => (
      <div
        key={`${sectionID}-${rowID}`}
        style={{
          backgroundColor: '#F5F5F9',
          height: 20,
        }}
      />
    );

    const row = (rowData, sectionID, rowID) => {
      return (<List className="message-list" key={rowID}>
        <List.Item
          key={rowID}
          arrow="horizontal"
          multipleLine
          className={classnames(styles.unread_badge, rowData.status === 1 ? ' ' : styles.have_read_badge)}
          onClick={() => {
            this.goToMessageDetails(rowData.id);
          }}
        >
          <div className={styles.message_title}>{rowData.title}</div>
          {rowData.status === 0 ? <Badge text="未读" /> : <Badge text="已读" />}
          <List.Item.Brief>消息时间：<span>{rowData.createTime}</span></List.Item.Brief>
          <List.Item.Brief>
            <div className={styles.message_content}>
              {rowData.content}
            </div>
          </List.Item.Brief>
        </List.Item>
      </List>);
    };

    return (<div className={styles.message_component}>
      <NavBar
        mode="dark"
        onLeftClick={() => window.location.href = '#/account'}
        icon={<Icon type="left" />}
        rightContent={
          <Popover
            mask
            overlayClassName="fortest"
            overlayStyle={{ color: 'currentColor' }}
            visible={this.state.visible}
            overlay={[
                     (<Popover.Item
                       key="4"
                       value="scan"
                       icon={<i className={styles.carmeIcon}>&#xe621;</i>}
                       data-seed="logId"
                       onClick={() => {
                         this.getMsgList();
                       }}
                     >全部
                      </Popover.Item>),
                     (<Popover.Item
                       key="5"
                       value="special"
                       icon={<i className={styles.carmeIcon}>&#xe628;</i>}
                       style={{ whiteSpace: 'nowrap' }}
                       onClick={() => {
                         this.onlyUnRead();
                       }}
                     >只看未读
                      </Popover.Item>),
                     (<Popover.Item
                       key="6"
                       value="button ct"
                       icon={<i className={styles.carmeIcon}>&#xeb90;</i>}
                       onClick={() => {
                       this.changeMsgRead();
                     }}
                     >
                       <span style={{ marginRight: 5 }}>全部标记为已读</span>
                     </Popover.Item>),
                   ]}
            align={{
                     overflow: { adjustY: 0, adjustX: 0 },
                     offset: [-10, 0],
                   }}
            onVisibleChange={this.handleVisibleChange}
            onSelect={this.onSelect}
          >
            <div style={{
              height: '100%',
              padding: '0 15px',
              marginRight: '-15px',
              display: 'flex',
              alignItems: 'center',
            }}
            >
              <Icon type="ellipsis" />
            </div>
          </Popover>
        }
      >
        我的消息
      </NavBar>
      <div className={styles.message_body}>
        <ListView
          ref={el => this.lv = el}
          dataSource={this.state.dataSource}
          renderRow={row}
          renderSeparator={separator}
          initialListSize={10}
          pageSize={10}
          scrollRenderAheadDistance={200}
          scrollEventThrottle={20}
          style={{ height: this.state.height, overflow: 'auto' }}
          scrollerOptions={{ scrollbars: true }}
          pullToRefresh={<PullToRefresh
            refreshing={refreshing}
            onRefresh={this.onRefresh}
          />}
          onEndReached={this.onEndReached}
          renderFooter={() => (refreshing ?
            <div className={styles.loadMore}><Icon type="loading" size="xs" /> 数据加载中...</div> :
            (((data || {}).list || []).length > 0 ? <div className={styles.noMore}>我是有底线的</div> :
            <div className={styles.noDataContainer} style={{ height: (this.state.height - 100) }}>
              <div className={styles.noDataContent}>
                <i className={styles.carmeIcon}>&#xe6f7;</i>
                <div className={styles.info}>没有任何数据</div>
              </div>
            </div>))}
          onLayout={({ nativeEvent: { layout: { width, height } } }) => {
            // console.log('nativeEvent', width, height)
          }}
          onEndReachedThreshold={10}
        />
      </div>
    </div>);
  }
}

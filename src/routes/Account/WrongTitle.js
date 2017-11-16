import React from 'react';
import ReactDOM from 'react-dom';
import {List, NavBar, Icon, ListView, PullToRefresh} from 'antd-mobile';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';

import styles from './WrongTitle.less';

@connect(state => ({
  exam: state.exam
}))
export default class WrongTitle extends React.Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });
    this.state = {
      dataSource,
      refreshing: true,
      height: document.documentElement.clientHeight,
      hasMore: true, //有更多数据的时候 设置为 true
      isLoading: true,
      initState: false,
      options: [],
      pages: 0,
      pageNo: 1,   //当前页
      pageSize: 10,
      dataIndex: 0,
      msgList: []
    };
    this.getDataList = this.getDataList.bind(this);
    this.getFullPathName = this.getFullPathName.bind(this);
    this.getAllChildCateId = this.getAllChildCateId.bind(this);
  }

  getDataList(pageNo = 1) {
    const {dispatch} = this.props;
    const params = {
      currentPage: pageNo,
      pageSize: 10,
    };
    dispatch({
      type: 'exam/fetch',
      payload: params,
    });
    // requestService.get(dataApi['error_record']['list'], {
    //   'pageNo': pageNo,
    //   'pageSize': this.state.pageSize,
    //   'questionType': this.props.params.type
    // }, headers).then((data) => {
    //   let dataResult = data.result;
    //   let _data = this.state.data || [];
    //   _data = _data.concat(_.map(dataResult.list, (q) => {
    //     q.typeName = _.filter(_.map(this.state.options, o => this.getFullPathName(o, q.cateId)), o => o).join("");
    //     return q
    //   })).unique();
    //   this.setState({
    //     dataSource: this.state.dataSource.cloneWithRows(_data),
    //     dataIndex: (dataResult.list || []).length - 1,
    //     data: _data,
    //     refreshing: false,
    //     isLoading: false,
    //     hasMore: data.result.pages === data.result.pageNo, //是否是最有一页
    //     msgList: this.state.msgList.concat(dataResult.list),
    //     pageNo: pageNo,
    //     pages: data.result.pages
    //   })
    // });
  }

  componentWillMount() {
    // this.getDataList();
    let headers = {};
    // requestService.get(dataApi['directory']['list'], {type: 1}, headers).then((data) => {
    //   if (data.code !== 200) {
    //     Toast.error(data.message);
    //   } else {
    //     const options = [];//树形结构的目录
    //     let node = {};
    //     let result = data.result;
    //     result.forEach(function (o) {
    //       node[o.id] = {value: o.id + "", label: o.name, children: []};
    //       if (o.parentId === 0) {
    //         options.push(node[o.id]);
    //       } else {
    //         node[o.parentId + ""].children.push(node[o.id]);
    //       }
    //     });
    //     this.setState({options: options, initState: true});
    //   }
    // });
  }


  /**
   * 递归获取完整分类名称 中国电信／重庆电信／重庆电信观音桥营业厅
   * @param node  包含子目录ID的父目录
   * @param cateId 子目录的ID
   * @returns {string}
   */
  getFullPathName(node = {}, cateId) {
    if (cateId) {
      if (Number(node.value) === cateId) {
        return node.label;
      }
      for (let i = 0; i < node.children.length; i++) {
        let fullPathName = this.getFullPathName(node.children[i], cateId);
        if (fullPathName) {
          return node.label + '/' + fullPathName
        }
      }
    }
    return '';
  }


  //获取所有子节点
  getAllChildCateId(node = {}, cateId, append = false) {
    let cateIds = '';
    append = (node.value === cateId) || append;
    if (append) {
      cateIds += (node.value + ',')
    }
    if (node.children)
      node.children.forEach(function (childNode) {
        cateIds += (this.getAllChildCateId(childNode, cateId, append))
      });
    return cateIds;
  }

  componentDidMount() {
    const hei = this.state.height - ReactDOM.findDOMNode(this.lv).offsetTop;
    setTimeout(() => {
      this.getDataList(1);
      this.setState({
        height: hei
      });
    }, 1500);
  }

  componentWillReceiveProps(nextProps) {
    let data = nextProps.exam.data;
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows((data || {}).list),
    });
  }

  componentWillUnmount() {

  }

  onRefresh = () => {
    if (!this.manuallyRefresh) {
      this.setState({refreshing: true});
    } else {
      this.manuallyRefresh = false;
    }
    this.getDataList(1);
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
    this.getDataList(this.state.pageNo + 1);
  };

  /**
   * 跳转到试卷页面
   * @param id 时间ID
   * @param time 考试总时间 （分）
   */
  goToRanking(id) {
    this.props.dispatch(routerRedux.push('/account/error/record/' + id))
  }

  render() {

    const {exam: {loading: refreshing, data}} = this.props;

    console.log('==>',this.props);
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
              this.goToRanking(rowData.questionId);
            }}
          >
            <div className='test-title' style={{whiteSpace: 'inherit'}}
                 dangerouslySetInnerHTML={{__html: rowData.questionName}}></div>
            <List.Item.Brief>分&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              类：{rowData.typeName || '--'}</List.Item.Brief>
            <List.Item.Brief>答题时间：<span>{rowData.createTime}</span></List.Item.Brief>
            <List.Item.Brief>答错次数：<span>{rowData.num}</span>次</List.Item.Brief>
          </List.Item>
        </List>
      );
    };
    return (
      <div className={styles.wrong_title_component}>
        <NavBar
          mode='dark'
          icon={<Icon type='left'/>}
          onLeftClick={() => this.props.dispatch(routerRedux.push('/account/error/record'))}
        >{`${this.props.match.params.type === '1' ? '单' : '多'}选题列表`}</NavBar>
        <div className={styles.error_body}>
          <ListView
            ref={el => this.lv = el}
            dataSource={this.state.dataSource}
            renderRow={row}
            renderSeparator={separator}
            initialListSize={10}
            pageSize={10}
            scrollRenderAheadDistance={200}
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
            onLayout={({nativeEvent: {layout: {width, height}}}) => {
              // console.log('nativeEvent', width, height)
            }}
            onEndReachedThreshold={10}
          />
        </div>
      </div>
    );
  }
}

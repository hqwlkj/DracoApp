'use strict';

import React from "react";
import ReactDOM from "react-dom";
import {connect} from "dva";
import {Link} from "dva/router";
import {Accordion, Flex, Icon, ListView, NavBar, PullToRefresh} from "antd-mobile";
import {Pie} from "../../components/Charts";
import classnames from "classnames";

import styles from "./Index.less";

const dataList = [
  {
    img: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
    title: '一级分类名称',
    des: '不是所有的兼职汪都需要风吹日晒',
  },
  {
    img: 'https://zos.alipayobjects.com/rmsportal/XmwCzSeJiqpkuMB.png',
    title: '一级分类名称',
    des: '不是所有的兼职汪都需要风吹日晒',
  },
  {
    img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png',
    title: '一级分类名称',
    des: '不是所有的兼职汪都需要风吹日晒',
  },
];
let index = dataList.length - 1;

let pageIndex = 0;

class CourseComponent extends React.Component {
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
      dataSource: dataSource.cloneWithRows(this.initData),
      refreshing: true,
      isLoading: true,
      initData: this.initData,
      height: document.documentElement.clientHeight
    };
  }

  componentDidMount() {
    const hei = this.state.height - ReactDOM.findDOMNode(this.lv).offsetTop;
    setTimeout(() => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(dataList),
        height: hei,
        refreshing: false,
        isLoading: false,
      });
    }, 1500);
  }

  componentWillMount() {
    this.loadData();
  }

  componentWillUnmount() {

  }

  loadData() {
    const {dispatch} = this.props;
    const params = {type:2};
    dispatch({
      type: 'study/feacthDirectory',
      payload: params,
    });
  }

  onRefresh = () => {
    console.log('onRefresh');
    this.setState({refreshing: true, isLoading: true});
    // simulate initial Ajax
    setTimeout(() => {
      this.rData = dataList;
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.rData),
        refreshing: false,
        isLoading: false,
      });
    }, 600);
  }

  onChange = (key) => {
    console.log(key);
  }

  goToCourseDetails(id) {
    window.location.href = '#/course/details/' + id;
  }

  onEndReached = (event) => {
    // load new data
    // hasMore: from backend data, indicates whether it is the last page, here is false
    if (this.state.isLoading && !this.state.hasMore) {
      return;
    }
    console.log('reach end', event);
    this.setState({isLoading: true});
    setTimeout(() => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(dataList),
        isLoading: false,
      });
    }, 1000);
  };

  render() {
    const {study: {loading: refreshing, data = []}} = this.props;
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
      if (index < 0) {
        index = dataList.length - 1;
      }
      const obj = dataList[index--];
      return (
        <Accordion defaultActiveKey='0' accordion openAnimation={{}} className={styles.myAccordion}
                   onChange={this.onChange}
                   key={rowID}>
          <Accordion.Panel header={obj.title} key={rowID}>
            <div className={styles.searchContent}>
              <ul>
                <li>二级分类1</li>
                <li className={styles.cur}>二级分类2</li>
                <li className={styles.cur}>二级分类3</li>
                <li className={styles.cur}>二级分类4</li>
              </ul>
            </div>
            <div className={styles.courseList}>
              <div className={styles.courseItem} onClick={() => {
                this.goToCourseDetails(1);
              }}>
                <div className={styles.courseTitle}>第一课：知否知否，应是绿肥红瘦</div>
                <div className={styles.courseScore}>90 <span className={styles.unit}>分</span></div>
                <div className={styles.courseState}>已学习</div>
              </div>
              <div className={styles.courseItem} onClick={() => {
                this.goToCourseDetails(2);
              }}>
                <div className={styles.courseTitle}>第二课：知否知否，应是绿肥红瘦</div>
                <div className={styles.courseScore}>90 <span className={styles.unit}>分</span></div>
                <div className={styles.courseState}>已学习</div>
              </div>
              <div className={styles.courseItem} onClick={() => {
                this.goToCourseDetails(3);
              }}>
                <div className={styles.courseTitle}>第三课：知否知否，应是绿肥红瘦</div>
                <div className={styles.courseScore}></div>
                <div className={classnames(styles.courseState, styles.unread)}>未学习</div>
              </div>
            </div>
          </Accordion.Panel>
        </Accordion>
      );
    };

    return (
      <div className={styles.courseComponent}>
        <NavBar key='NavBar' icon={<Icon type="left"/>}
                onLeftClick={() => window.history.go(-1)} rightContent={
          <i className={styles.carmeIcon} onClick={() => {
            window.location.href = '#/account';
          }}>&#xe604;</i>
        }>学习天地</NavBar>
        <div className={styles.courseHeader}>
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
            <Flex.Item className={styles.courseInfoBox}>
              <p>已学习课程数：<span>3</span></p>
              <p>学习中课程数：<span>4</span></p>
              <p>未学习课程数：<span>1</span></p>
              <p>当前总学分：<span>150 分</span></p>
              <p>学分排名：<span>5</span></p>
            </Flex.Item>
          </Flex>
        </div>
        <div className={styles.courseBody}>
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
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />}
            onEndReached={this.onEndReached}
            renderFooter={() => this.state.isLoading ?
              <div className={styles.loadMore}><Icon type='loading' size='xs'/> 数据加载中...</div> :
              (this.state.initData.length > 0 ? <div className={styles.noMore}>我是有底线的</div> :
                <div className={styles.noDataContainer} style={{height: (this.state.height - 100)}}>
                  <div className={styles.courseComponent}>
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

CourseComponent.displayName = 'PublicCourseComponent';

// Uncomment properties you need
// CourseComponent.propTypes = {};
// CourseComponent.defaultProps = {};
export default connect(state => ({
  study: state.study
}))(CourseComponent);

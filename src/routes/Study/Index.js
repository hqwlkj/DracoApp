'use strict';

import React from "react";
import ReactDOM from "react-dom";
import {connect} from "dva";
import {Link,routerRedux} from "dva/router";
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
      initData: [],//目录
      height: document.documentElement.clientHeight,
    };

    this.updateDailyList = this.updateDailyList.bind(this);
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
    this.getDirectory();

  }

  componentWillUnmount() {

  }

  componentWillReceiveProps(nextProps) {
    let {
      study: {
        studyOriginList = [],
        directoryTree = [],
      }
    } = nextProps;
    let initData = this.state.initData;

    if ((directoryTree && directoryTree.length != 0) && (!initData || !initData.length )) {
      this.setState({
        initData: directoryTree,
      }, () => this.onChange(directoryTree[0], null, 0));
      return;
    }

    if (studyOriginList.length > 0) {
      let id = parseInt(studyOriginList[0].pathCode.split("/")[0].replace('P', ''));
      initData.forEach((i, index) => {
        if (i.id == id && !i['studyOriginList']) {
          initData[index]['studyOriginList'] = studyOriginList;
          initData[index]['studyFilterPath'] = new Set();
          initData[index]['studyList'] = studyOriginList;
        }
      })
    }
    this.setState({
      initData: initData,
      studyOriginList: studyOriginList,
    });
  }

  getCourseList() {
    const {dispatch} = this.props;
    dispatch({
      type: 'study/feacthStudyDirectory',
    });
  }

  getDirectory() {
    const {dispatch} = this.props;
    const params = {type: 1};
    dispatch({
      type: 'study/feacthDirectory',
      payload: params,
    });
    this.getCourseList();
  }

  onRefresh = () => {
    this.setState({refreshing: true, isLoading: true ,initData:[]},this.getDirectory);
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

  //手风琴被点开的事件
  onChange = (rowData, sectionID, rowID) => {
    let initData = this.state.initData;
    if (!!initData && initData.length > 0) {
      //如果已经有学习列表,则不请求数据
      if (initData[rowID]['studyOriginList']) {
        this.setState({initData: initData});
        return;
      }
      let path = rowData.path.replace('P', '');
      let params = {pathCode: path};
      const {dispatch} = this.props;
      dispatch({
        type: 'study/feacthStudyList',
        payload: params,
      });

    }
  }

  goToCourseDetails(id) {
    this.props.dispatch(routerRedux.push('/study/' + id));
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
        dataSource: this.state.dataSource.cloneWithRows([]),
        isLoading: false,
      });
    }, 1000);
  };

  //当分类按钮被选中时,按照分类进行筛选
  updateDailyList(index) {
    let initData = this.state.initData;
    let directory = initData[index];
    let studyFilterPath = directory.studyFilterPath;
    let studyOriginList = directory.studyOriginList;
    if (studyOriginList && studyOriginList.length !== 0) {
      //路径过滤集合studyFilterPath中没有值的时候就显示全部
      directory.studyList = studyOriginList.filter(s => studyFilterPath.size === 0 || studyFilterPath.has(s.pathCode));
      this.setState({initData});
    }
  }

  render() {
    let _this = this;
    const {
      study: {
        loading: refreshing,
        completeStudyNum = 0,
        isStudyNum = 0,
        notStudyNum = 0,
        score = 0,
        rank = 0,
      }
    } = this.props;
    let studySum = completeStudyNum + isStudyNum + notStudyNum;
    let dataSource = this.state.dataSource.cloneWithRows(this.state.initData);
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
        <Accordion defaultActiveKey='0' accordion openAnimation={{}} className={styles.myAccordion}
                   onChange={() => this.onChange(rowData, sectionID, rowID)}
                   key={rowID}>
          <Accordion.Panel header={rowData.name} key={rowID}>
            {rowData.children ?
              (<div className={styles.searchContent}>
                <ul key={`ul_${rowID}`}>
                  {rowData.children.map((c, _index) => (
                    <StudyItem key={_index} secondDirectory={c} parent={_this} index={parseInt(rowID)}/>))}
                </ul>
              </div>)
              : null}

            {rowData.studyList && rowData.studyList.length !== 0 ? (
              <div className={styles.courseList}>
                {rowData.studyList.map((study, _index) => (
                  <div className={styles.courseItem} key={_index} onClick={() => {
                    this.goToCourseDetails(study.id);
                  }}>
                    <div className={styles.courseTitle}>{study.title}</div>
                    <div className={styles.courseScore}>{study.state == 2 ? study.score : null}<span
                      className={styles.unit}>{study.state == 2 ? '分' : null}</span></div>
                    <div
                      className={study.state == 2 ? (styles.courseScore) : (classnames(styles.courseState, styles.unread))}>{study.state == 0 ? '未学习' : (study.state == 1 ? '学习中' : '已完成')}</div>
                  </div>
                ))}
              </div>
            ) : null}
          </Accordion.Panel>
        </Accordion>
      );
    };

    return (
      <div className={styles.courseComponent}>
        <NavBar key='NavBar' icon={<Icon type="left"/>}
                onLeftClick={() => this.props.dispatch(routerRedux.goBack())} rightContent={
          <i className={styles.carmeIcon} onClick={() => {
            this.props.dispatch(routerRedux.push('/account'));
          }}>&#xe604;</i>
        }>学习天地</NavBar>
        <div className={styles.courseHeader}>
          <Flex>
            <Flex.Item>
              <Pie
                animate={false}
                percent={28}
                subTitle="完成率"
                total={ (studySum == 0 ? 0 : (completeStudyNum / studySum * 100).toFixed(2)) + "%"}
                height={268}
                lineWidth={1}
              />
            </Flex.Item>
            <Flex.Item className={styles.courseInfoBox}>
              <p>已学习课程数：<span>{completeStudyNum}</span></p>
              <p>学习中课程数：<span>{isStudyNum}</span></p>
              <p>未学习课程数：<span>{notStudyNum}</span></p>
              <p>当前总学分：<span>{score} 分</span></p>
              <p>学分排名：<span>{rank}</span></p>
            </Flex.Item>
          </Flex>
        </div>
        <div className={styles.courseBody}>
          <ListView
            ref={el => this.lv = el}
            dataSource={dataSource}
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

class StudyItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      secondDirectory: this.props.secondDirectory,
      parent: this.props.parent,
      index: this.props.index,
      isChecked: false
    };
  }

  onClick(e) {
    this.setState({isChecked: this.state.isChecked ^ true}, () => {
      let initData = this.state.parent.state.initData;
      let path = this.state.secondDirectory.path;
      if (this.state.isChecked) {
        initData[this.state.index].studyFilterPath.add(path);
      } else {
        initData[this.state.index].studyFilterPath.delete(path);
      }
      this.state.parent.setState({
        initData
      }, () => this.state.parent.updateDailyList(this.state.index));
    });
  }

  render() {

    return (<li className={this.state.isChecked ? styles.cur : null}
                onClick={(e) => this.onClick(e)}>{this.state.secondDirectory.name}</li>);
  }
}

CourseComponent.displayName = 'PublicCourseComponent';

// Uncomment properties you need
// CourseComponent.propTypes = {};
// CourseComponent.defaultProps = {};
export default connect(state => ({
  study: state.study
}))(CourseComponent);

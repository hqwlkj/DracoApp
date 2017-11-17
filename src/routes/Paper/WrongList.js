import React from 'react';
import ReactDOM from 'react-dom';
import {routerRedux} from 'dva/router';
import {Checkbox, NavBar, Radio, Icon, ListView} from 'antd-mobile';
import _ from 'lodash';
import SS from 'parsec-ss';
import * as Tools from '../../utils/utils';
import styles from './wrong_list.less';


export default class WrongList extends React.Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });

    this.state = {
      dataSource,
      isLoading: true,
      dataList: [],
      completeData: [],
      height: document.documentElement.clientHeight,
      questionTypeMap: {1: '单选题', 2: '多选题'},
    };
  }

  componentWillMount() {
    const dataList = SS.getObj('dataList');
    const completeData = SS.getObj('completeData');
    this.setState({
      dataList, completeData,
      isLoading: false,
      dataSource: this.state.dataSource.cloneWithRows(dataList),
    });
  }

  componentDidMount() {
    // you can scroll to the specified position
    // setTimeout(() => this.lv.scrollTo(0, 120), 800);
    const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
    this.setState({
      height: hei,
    });
  }


  // 如果你使用了redux，那么数据可能在 props 上，你需要使用`componentWillReceiveProps`
  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.dataSource !== this.props.dataSource) {
  //     this.setState({
  //       dataSource: this.state.dataSource.cloneWithRowsAndSections(nextProps.dataSource),
  //     });
  //   }
  // }

  onEndReached = (event) => {
    // 加载新的数据
    // hasMore：从后端数据，表示是否是最后一页，这里是false
    if (this.state.isLoading && !this.state.hasMore) {
      return;
    }
    console.log('reach end', event);
    this.setState({isLoading: true});
    setTimeout(() => {
      this.setState({
        isLoading: false,
      });
    }, 1000);
  }

  //渲染该条问题的所有答案
  getItemList(questionIndex) {
    let itemList = this.state.dataList[questionIndex].itemList;
    if (itemList) {
      return itemList.map((item, itemIndex) => this.getQuestionItem(itemIndex, questionIndex));
    } else
      return null;
  }

  //渲染该条问题的一条答案
  getQuestionItem(itemIndex, questionIndex) {
    let question = this.state.dataList[questionIndex].question;
    let item = this.state.dataList[questionIndex].itemList[itemIndex];
    let questionItem = null;
    switch (question.questionType) {
      case 1:
        questionItem = (
          <div className={styles.my_radio} key={`question_item_${_.uniqueId()}`}><Radio checked={!!item.checked}
                                                                                 onChange={e => {}}>{item.title}</Radio>
          </div>);
        break;
      case 2:
        questionItem = (
          <Checkbox.AgreeItem key={`question_item_${_.uniqueId()}`} checked={!!item.checked}
                              onChange={e => {}}>{item.title}</Checkbox.AgreeItem>);
        break;
      default:
        questionItem = null;
        break;
    }

    return questionItem;
  }

  render() {
    const separator = (sectionID, rowID) => (
      <div
        key={`${sectionID}-${rowID}`}
        style={{
          backgroundColor: '#F5F5F9',
          height: 18,
          borderTop: '1px solid #ECECED',
          borderBottom: '1px solid #ECECED',
        }}
      />
    );

    let analysis = (dd, questionIndex) => {
      if (dd.question.analysis !== '') {
        return (<div className={styles.question_analysis}>
          <div className={styles.analysis_title}>题目解析</div>
          <div className={styles.analysis_info}>
            <div className={styles.analysis_answer}>答案：A.XXXXXXXXX</div>
            <div className={styles.analysis_difficulty}>&nbsp;</div>
          </div>
          <div className={styles.analysis_desc}>
            <span dangerouslySetInnerHTML={{__html: Tools.formatFontSize(dd.question.analysis)}}/>
          </div>
        </div>);
      } else {
        return (
          <div className={styles.question_analysis}>
            <div className={styles.analysis_title}>题目解析</div>
            <div className={styles.analysis_info}>
              <div className={styles.noData}>
                <i className={styles.carmeIcon}>&#xe6f7;</i>
                <div className={styles.noDataText}>
                  <p>Sorry</p>
                  <p>该试题,没有错题解析</p>
                </div>
              </div>
            </div>
          </div>
        );
      }
    };


    const row = (rowData, sectionID, rowID) => {
      console.log('rowData',rowData);
      return (
        <div key={rowID} style={{padding: '25px'}}>
          <div
            style={{
              lineHeight: '50px',
              color: '#888',
              fontSize: 32,
              padding: '10px 0'
            }}
            className={styles.question_title}
          >
            <span className={styles.tags}>{this.state.questionTypeMap[rowData.question.questionType]}</span>
            <span dangerouslySetInnerHTML={{__html: rowData.question.content}}/>
          </div>
          <div style={{padding: '15px 0'}}>
            <div style={{lineHeight: 1}}>
              <div className={styles.question_content}>
                {this.getItemList(rowID)}
              </div>
              {analysis(rowData,rowID)}
            </div>
          </div>
        </div>
      );
    };

    return (<div className={styles.wrong_list}>
      <NavBar onLeftClick={() => {
        this.props.dispatch(routerRedux.goBack());
      }} icon={<Icon type='left'/>}>错题列表</NavBar>

      <div className={styles.wrong_list_component}>
        <ListView
          ref={el => this.lv = el}
          dataSource={this.state.dataSource}
          renderFooter={() => this.state.isLoading ?
            <div className={styles.loadMore}><Icon type='loading' size='xs'/> 数据加载中...</div> :
            (this.state.dataList.length > 0 ? <div className={styles.noMore}>我是有底线的</div> :
              <div className={styles.noDataContainer} style={{height: (this.state.height - 100)}}>
                <div className={styles.wrong_list_component}>
                  <i className={styles.carmeIcon}>&#xe6f7;</i>
                  <div className={styles.info}>没有任何数据</div>
                </div>
              </div>)}
          renderBodyComponent={() => <MyBody/>}
          initialListSize={10}
          renderRow={row}
          renderSeparator={separator}
          style={{
            height: this.state.height,
            overflow: 'auto',
          }}
          pageSize={10}
          scrollRenderAheadDistance={500}
          onEndReachedThreshold={10}
        />
      </div>
    </div>);
  }
}


function MyBody(props) {
  return (
    <div className="am-list-body my-body">
      <span style={{display: 'none'}}>you can custom body wrap element</span>
      {props.children}
    </div>
  );
}

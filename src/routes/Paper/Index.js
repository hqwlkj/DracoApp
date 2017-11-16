import React from "react";
import {connect} from "dva";
import {Badge, Carousel, Checkbox, Flex, Icon, Modal, NavBar, Pagination, Radio} from "antd-mobile";
import _ from "lodash";
import classnames from 'classnames';
import SS from "parsec-ss";
import Config from "../../utils/config";
import styles from "./Index.less";
import * as Tools from '../../utils/utils';

let timer = 0;
let loadUrl = null;

@connect(state => ({
  paper: state.paper
}))
export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navbarTitle: '',
      params: {},
      progressNum: 10,
      current: 0, //当前答题呈现的 试题
      answeredIds: [], //已答题目的ID
      hidden: false,
      initialHeight: 100,

      dataList: [],//问题列表
      completeData: [],//完成答题列表
      answerTime: null,//每道题的答题开始时间
      recordTime: null,//每道题道题时长,单位s
      questionTypeMap: {1: '单选题', 2: '多选题'},
      showAnalyse: [],
    }

    this.countdown = this.countdown.bind(this);
    this.goForward = this.goForward.bind(this);
    this.selectedPaperItem = this.selectedPaperItem.bind(this);
    this.onItemClick = this.onItemClick.bind(this);
    this.onItemClick2 = this.onItemClick2.bind(this);
    this.getQuestionItem = this.getQuestionItem.bind(this);
    this.getItemList = this.getItemList.bind(this);
    this.submit = this.submit.bind(this);
    this.ensureSubmit = this.ensureSubmit.bind(this);
    this.computeTrueOrFalse = this.computeTrueOrFalse.bind(this);
    this.endOneQuestion = this.endOneQuestion.bind(this);
    this.computeTrueOrFalseThenCommit = this.computeTrueOrFalseThenCommit.bind(this);
    this.updateAnswerTime = this.updateAnswerTime.bind(this);
    this.assembleQuestion = this.assembleQuestion.bind(this);
  }


  componentWillMount() {
    this.doProps(this.props);
  }

  componentDidMount() {
    let param = this.props.match.params;
    let navbarTitle;
    switch (param.type) {
      case '1':
        navbarTitle = '在线考试';
        break;
      case '2':
        navbarTitle = '学习答题';
        break;
      default:
        break;
    }
    if (this.props.match.params.type !== '2') {
      navbarTitle = '倒计时 00:00';
    } else {
      this.setState({answerTime: new Date(new Date().getTime() + 1000)});//感觉还是补偿1秒比较好
    }
    // simulate img loading
    setTimeout(() => {
      this.setState({
        navbarTitle,
      }, () => {
        if (this.props.match.params.type !== '2') {
          this.countdown();
        }
      });
    }, 100);
  }

  componentWillReceiveProps(nextProps) {
    let {
      paper: {
        dataList = [],
      }
    } = nextProps;
    this.setState({
      dataList: dataList,
    }, this.assembleQuestion);
  }

  doProps(props) {
    this.props = props;
    let param = this.props.match.params;
    this.setState({params: param});
    const queryString = {
      id: param.id,
    };
    switch (param.type) {
      case '1':
        loadUrl = 'feacthTestPaper';
        break;
      case '2':
        loadUrl = 'feacthStudyPaper';
        break;
      default:
        break;
    }
    this.props.dispatch({
      type: `paper/${loadUrl}`,
      payload: queryString//参数
    })
  }

  //装配习题答题情况
  assembleQuestion() {
    let param = this.props.match.params;
    let dataList = this.state.dataList;
    let completeData = [];
    switch (param.type) {
      case '2':
        dataList.forEach((m, index) => {
          completeData[index] = {
            questionId: m.question.id,
            category: param.type,
            cateId: param.id,
            questionOwner: SS.get(Config.USER_ID),
            answererId: SS.get(Config.TOKEN_ID),
            isCorrect: 0,
            recordTime: null
          };
        });
        break;
      default:
        break;
    }

    this.setState({
      completeData
    });
  }

  /**
   * 销毁&清理
   */
  componentWillUnmount() {
    //清除定时器
    clearInterval(timer);
  }

  goBackOff() {
    Modal.alert('提示', '是否放弃本次答题?', [
      {
        text: '取消', onPress: () => {
      }
      },
      {
        text: '确定', onPress: () => {
        //清除定时器
        clearInterval(timer);
        window.history.go(-1)
      }
      }
    ])
  }

  /**
   **初始化考试倒计时时间
   **
   */
  countdown() {
    if (this.props.match.params.time === '0') return;
    let times = (this.props.match.params.time || '').split('.');
    let answerTime = parseInt(times[0]);
    let h = Math.floor(answerTime >= 60 ? answerTime / 60 : 0);
    let m, s = 59;

    if (times.length > 1) {
      m = answerTime;
      s = (parseInt(times[1]) * 60) / 10;
    } else {
      m = ((answerTime % 60) - 1);
    }


    let navbarTitle = '';
    //设置第一道题的开始答题时间
    this.setState({answerTime: new Date(new Date().getTime() + 1000)});//感觉还是补偿1秒比较好
    timer = setInterval(() => {
      s--;
      if (s < 0) {
        s = 59;
        m--;
      }
      if (m <= 0 && h > 0) {
        m = 59;
        h--;
      }
      if (s < 10) {
        navbarTitle = '倒计时 ' + ( h > 0 ? (h <= 9 ? '0' + h : h) + ':' : '') + ( m <= 9 ? '0' + m : m) + ':0' + s;
      } else {
        navbarTitle = '倒计时 ' + ( h > 0 ? (h <= 9 ? '0' + h : h) + ':' : '') + ( m <= 9 ? '0' + m : m) + ':' + s;
      }
      this.setState({navbarTitle});
      if (h === 0 && m === 0 && s === 0) {
        clearInterval(timer);
        // TODO: 倒计时到了之后直接调用提交试卷的方法。
        Modal.alert('答题时间结束!', <p>放弃:放弃本次答题<br/>提交:提交当前答案</p>, [
          {
            text: '放弃', onPress: () => {
            window.history.go(-1)
          }
          },
          {text: '提交', onPress: () => this.computeTrueOrFalseThenCommit}
        ]);
      }
    }, 1000)
  }

  /**
   * 考试时提供的选题
   * @param 数据index下标
   */
  selectedPaperItem(index) {
    this.computeTrueOrFalse(true);
    this.setState({
      current: index,
      hidden: false
    })
  }

  //单选被点击
  onItemClick(e, itemIndex, questionIndex) {
    let dataList = this.state.dataList;
    dataList[questionIndex].itemList.forEach(i => i.checked = false);
    dataList[questionIndex].itemList[itemIndex].checked = true;

    dataList[questionIndex].itemList.forEach(i => {
      if (i.checked) {
        let answeredIds = this.state.answeredIds;
        if (answeredIds.filter(s => s === questionIndex).length === 0) {
          answeredIds.push(questionIndex);
        }
        return;
      }
    });

    this.setState({dataList});
  }

  //多选被点击
  onItemClick2(e, itemIndex, questionIndex) {
    let dataList = this.state.dataList;
    dataList[questionIndex].itemList[itemIndex].checked = e.target.checked;


    dataList[questionIndex].itemList.forEach(i => {
      if (i.checked) {
        let answeredIds = this.state.answeredIds;
        if (answeredIds.filter(s => s === questionIndex).length === 0) {
          answeredIds.push(questionIndex);
        }
        return;
      }
    });

    this.setState({dataList});
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
          <div className={styles.my_radio} key={`question_item_${_.uniqueId()}`}>
            <Radio checked={!!item.checked}
                   onChange={e => this.onItemClick(e, itemIndex, questionIndex)}>{item.title}
            </Radio>
          </div>);
        break;
      case 2:
        questionItem = (
          <Checkbox.AgreeItem key={`question_item_${_.uniqueId()}`} checked={!!item.checked}
                              onChange={e => this.onItemClick2(e, itemIndex, questionIndex)}>{item.title}
          </Checkbox.AgreeItem>);
        break;
      default:
        questionItem = null;
        break;
    }

    return questionItem;
  }

  //计算答案函数
  computeTrueOrFalse(isCarousel) {
    let questionIndex = this.state.current;
    let itemList = this.state.dataList[questionIndex].itemList;
    let result = true;
    itemList.forEach(i => {
      let tmp = i.flag === 'T';
      result = result && (!tmp ^ (!!i.checked));
    });
    let completeData = this.state.completeData;
    completeData[questionIndex].isCorrect = result;
    this.setState({completeData}, () => {
      if (!isCarousel) this.goForward(questionIndex)
    });
  }

  computeTrueOrFalseThenCommit() {
    let questionIndex = this.state.current;
    this.updateAnswerTime(questionIndex);
    let itemList = this.state.dataList[questionIndex].itemList;
    let result = true;
    itemList.forEach(i => {
      let tmp = i.flag === 'T';
      result = result && (!tmp ^ (!!i.checked));
    });
    let completeData = this.state.completeData;
    completeData[questionIndex].isCorrect = result;
    this.setState({completeData}, () => {
      this.submit();
    });
  }

  //结束一道题需要操作一些数据,如计算答案,道题时长,重置答题开始时间
  endOneQuestion(current) {
    this.updateAnswerTime(current);
    //跳至下一页前计算当前题的正确还是错误
    this.computeTrueOrFalse();
  }

  goForward(current) {
    if (current === this.state.dataList.length - 1) {
      this.ensureSubmit();
    } else {
      current += 1;
      this.selectedPaperItem(current);
    }
  }

  updateAnswerTime(current) {
    let answerTime = this.state.answerTime;
    let recordTime = (new Date() - answerTime) / 1000;
    let completeData = this.state.completeData;
    completeData[current].recordTime = (completeData[current].recordTime || 0) + recordTime;
    this.setState({
      completeData,
      answerTime: new Date() //重置答题开始时间
    });
  }

  //是否交卷
  ensureSubmit() {
    Modal.alert('提示', '是否确定提交本次答题?', [
      {
        text: '取消', onPress: () => {
      }
      },
      {
        text: '确定', onPress: () => {
        this.submit();
      }
      }
    ])
  }

  //交卷
  submit() {
    //清除定时器
    clearInterval(timer);

    let timeConsuming = 0;
    this.state.completeData.forEach(i => {
      timeConsuming += i.recordTime;
      i.recordTime = Math.ceil(i.recordTime);
    });
    let headers = {'Content-type': 'application/json'};
    // request.post(api.answer + '?timeConsuming=' + Math.ceil(timeConsuming),
    //   JSON.stringify(this.state.completeData), headers).then(data => {
    //   if (data.code !== 200) {
    //     Toast.fail(data.message);
    //   } else {
    //     window.history.go(-1);
    //   }
    // });

  }

  paperChooseItem() {
    let completeData = this.state.completeData;
    let row = Math.floor((completeData.length + 5) / 6);
    let rowData = [];
    for (let i = 0; i < row; i++) {
      let c = [];
      for (let j = 1; j <= 6; j++) {
        let number = (i) * 6 + j;
        if (number <= completeData.length) {
          c.push(number);
        } else c.push(-1);
      }
      rowData.push(c);
    }
    let array = (rowData.map((s, index) => {
      return (<Flex className={styles.paper_list} key={`paper-list-${index}`}>
        {s.map((i, cindex) => {
          return (i !== -1 ? (<Flex.Item key={`paper-list-item-${index}-${cindex}`}>
            <div
              className={classnames(styles.paper_item,this.state.current === i - 1 ? styles.current : '',this.state.answeredIds.filter(x => x === i - 1).length === 1 ? styles.success : '')}
              onClick={() => {
                this.selectedPaperItem(i - 1);
              }}>{i}
            </div>
          </Flex.Item>) : (
            <Flex.Item className={classnames(styles.paper_item,styles.no_data)} key={`paper-list-item-${index}-${cindex}`}>&nbsp;</Flex.Item>))
        })}
      </Flex>)
    }));
    return array;
  }

  render() {
    const {dataList = []} = this.props.paper;
    const hProp = this.state.initialHeight ? {padding: '5px'} : {};
    let analysis = (dd, questionIndex) => {
      if (this.props.match.params.type === '2' && dd.question.analysis !== 'close') {
        if (dd.question.analysis !== '') {
          return (<div className={styles.question_analysis}
                       style={{display: this.state.showAnalyse[questionIndex] ? 'block' : 'none'}}>
            <div className={styles.analysis_title}>题目解析</div>
            <div className={styles.analysis_info}></div>
            <div className={styles.analysis_desc}>
              <span dangerouslySetInnerHTML={{__html: Tools.formatFontSize(dd.question.analysis)}}/>
            </div>
          </div>);
        } else {
          return (
            <div className={styles.question_analysis}
                 style={{display: this.state.showDifficulty[questionIndex] ? 'block' : 'none'}}>
              <div className={styles.analysis_title}>题目解析</div>
              <div className={styles.analysis_desc}>
                {/*没有解释的时候显示这个*/}
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
      } else {
        return null;
      }
    };

    return (
      <div className={styles.test_paper_component}>
        <NavBar onLeftClick={() => {
          this.goBackOff()
        }}
                icon={<Icon type='left'/>} rightContent={this.props.match.params.type !== '2' ? [
          <span key='0' style={{fontSize: '0.28rem'}} onClick={() => this.ensureSubmit()}>
            <i className={styles.carmeIcon} style={{fontSize: '0.28rem'}}>&#xe600;</i>交卷
          </span>,] : null}>{this.state.navbarTitle}</NavBar>

        <div className={styles.test_paper_container}>
          <Pagination mode='number' total={this.state.dataList.length} current={this.state.current + 1}/>
          <Carousel
            className={styles.my_carousel}
            autoplay={false}
            infinite={false}
            selectedIndex={this.state.current}
            dots={false}
            swipeSpeed={35}

            beforeChange={(from, to) => {
              //这个比较可以判断是点击下一页还是左右翻页
              if (this.state.current === from) {
                this.computeTrueOrFalse(true);
                this.setState({current: to}, () => {
                  this.updateAnswerTime(from);
                });
              }
            }}
          >
            {dataList.map((dd, questionIndex) => (
              <div key={dd} className={styles.paper} style={hProp}
                   onLoad={() => {
                     // fire window resize event to change height
                     window.dispatchEvent(new Event('resize'));
                     this.setState({
                       initialHeight: 75
                     });
                   }}
              >
                <div className={styles.question_title}>
                  <span className={styles.tags}>{this.state.questionTypeMap[dd.question.questionType]}</span>
                  <span
                    dangerouslySetInnerHTML={{__html: dd.question.content}}/>
                </div>
                <div className={styles.question_content}>
                  {this.getItemList(questionIndex)}
                </div>
                {/*{*/}
                  {/*analysis(dd, questionIndex)*/}
                {/*}*/}
              </div>
            ))}
          </Carousel>
        </div>


        {
          this.props.match.params.type === '3' ?
            <div>
              <div className={styles.test_paper_footer} style={{bottom: !!this.state.hidden ? '-2rem' : '0'}}>
                <div className={styles.selected_topic} onClick={() => {
                  this.setState({hidden: true});
                }}>
                  <div className={styles.topic_icon}>
                    <i className={styles.carmeIcon}>&#xe624;</i>
                  </div>
                  <div className={styles.topic_btn_text}>选题</div>
                </div>
              </div>
              <div className={styles.selected_mask} onClick={() => {
                this.setState({hidden: false});
              }} style={{display: !!this.state.hidden ? 'block' : 'none'}}>&nbsp;</div>
              <div className={styles.selected_modal} style={{bottom: !!this.state.hidden ? '.5rem' : '-100vh'}}>
                <div className={styles.selected_modal_info_box}>
                  <Flex>
                    <Flex.Item>共有：<span>{this.state.completeData.length}</span>题</Flex.Item>
                    <Flex.Item>已答：<span>{this.state.answeredIds.length}</span>题</Flex.Item>
                    <Flex.Item>未答：<span>{this.state.completeData.length - this.state.answeredIds.length}</span>题</Flex.Item>
                  </Flex>
                </div>
                <div className={styles.selected_modal_content}>
                  {this.paperChooseItem()}
                </div>
              </div>
            </div>
            :
            <div className={styles.test_paper_footer}>
              <div className={styles.next_btn} onClick={() => {
                let current = this.state.current;
                //结束本道题进入下一道题之前保存一些数据,然后进入下一道题或者提交
                this.endOneQuestion(current);
              }}>
                {this.state.current === this.state.dataList.length - 1 ? '交卷' : '下一题'}
              </div>
            </div>
        }
      </div>
    );
  }
}

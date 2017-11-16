import React from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {List, Badge, NavBar, Button, Icon, Radio} from 'antd-mobile';
import _ from 'lodash';
import * as Tools from '../../utils/utils';
import styles from './ErrorDetails.less';


@connect(state => ({
  exam : state.exam
}))
export default class ErrorDetails extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      questionTypeMap: {1: '单选题', 2: '多选题'},
      options: [],
      question: {}
    }
  }

  componentDidMount() {
    this.setState({isLoading: true});
    // requestService.get(dataApi['error_record']['detail'] + this.props.params.id).then((data) => {
    //   if (data.code === 200 && data.result.list && data.result.list.length > 0) {
    //     this.setState({
    //       options: data.result.list[0].itemList,
    //       question: data.result.list[0].question,
    //       difficulty: _.filter(data.result.difficulty,o=>o.value===data.result.list[0].question.difficulty)[0]['text'],
    //     });
    //   } else {
    //     Toast.error('查询失败，请稍后重试');
    //   }
    // });
  }

  render() {
    const {exam: {question = {}}} = this.props;
    return (
      <div className={styles.error_details_component}>
        <NavBar
          mode='dark'
          icon={<Icon type='left'/>}
          onLeftClick={() => this.props.dispatch(routerRedux.goBack())}
        >错题解析</NavBar>
        <div className={styles.error_paper}>
          <div className={styles.question_title}>
            <span className={styles.tags}>{question.questionTypeMap[question.questionType]}</span>
            <span dangerouslySetInnerHTML={{__html: question.content}}/>
          </div>
          <div className={styles.question_content}>
            {
              (question.options || []).map((item) => {
                return (
                  <div className={styles.my_radio} key={Math.random()}>
                    <Radio onChange={(e) => {
                    }} checked={item.flag === 'T'} disabled={true}>{item.title}</Radio>
                  </div>
                );
              })
            }
          </div>
          <div className={styles.question_analysis}>
            <div className={styles.analysis_title}>题目解析</div>
            <div className={styles.analysis_info}>
              <div className={styles.analysis_answer}>
                答案：<span>{_.map(_.filter(question.options, o => o.flag === 'T'), o => o.title).join(',')}</span></div>
              <div className={styles.analysis_difficulty}>难度：<span>{question.difficulty}</span></div>
            </div>
            <div className={styles.analysis_desc}>
              {(question.analysis ?
                <div dangerouslySetInnerHTML={{__html: Tools.formatFontSize(question.analysis)}}></div> :
                <div className={styles.noData}>
                  <i className={styles.carmeIcon}>&#xe6f7;</i>
                  <div className={styles.noDataText}>
                    <p>Sorry</p>
                    <p>该试题,没有错题解析</p>
                  </div>
                </div>)}
            </div>
          </div>
        </div>
      </div>
    );
  }

}

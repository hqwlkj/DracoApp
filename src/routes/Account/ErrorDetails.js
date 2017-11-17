import React from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {List, Checkbox, NavBar, Button, Icon, Radio} from 'antd-mobile';
import _ from 'lodash';
import * as Tools from '../../utils/utils';
import styles from './ErrorDetails.less';


@connect(state => ({
  errorRecord: state.errorRecord
}))
export default class ErrorDetails extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      questionTypeMap: ['单选题', '多选题'],
      options: [],
      question: {}
    }
  }

  componentDidMount() {
    // let data = nextProps..data.result;
    this.props.dispatch({
      type: 'errorRecord/getErrorRecordDetail',
      payload:{id:this.props.match.params.id}
    });
  }

  render() {
    const {errorRecord: {errorRecordDetail : {question = {},itemList =[]}}} = this.props;
    return (
      <div className={styles.error_details_component}>
        <NavBar
          mode='dark'
          icon={<Icon type='left'/>}
          onLeftClick={() => this.props.dispatch(routerRedux.goBack())}
        >错题解析</NavBar>
        <div className={styles.error_paper}>
          <div className={styles.question_title}>
            <span className={styles.tags}>{this.state.questionTypeMap[question.questionType-1]}</span>
            <span dangerouslySetInnerHTML={{__html: question.content}}/>
          </div>
          <div className={styles.question_content}>
            {
              (itemList || []).map((item) => {
                if(question.questionType === 1){
                  return (
                    <div className={styles.my_radio} key={Math.random()}>
                      <Radio onChange={(e) => {
                      }} checked={item.flag === 'T'} disabled={true} >{item.title}</Radio>
                    </div>
                  );
                }else{
                   return( <Checkbox.AgreeItem key={`question_item_${_.uniqueId()}`} checked={item.flag === 'T'} disabled={true} >{item.title}</Checkbox.AgreeItem>)
                }
              })
            }
          </div>
          <div className={styles.question_analysis}>
            <div className={styles.analysis_title}>题目解析</div>
            <div className={styles.analysis_info}>
              <div className={styles.analysis_answer}>
                答案：<span>{_.map(_.filter(itemList, o => o.flag === 'T'), o => o.title).join(',')}</span></div>
              <div className={styles.analysis_difficulty}>&nbsp;</div>
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
ErrorDetails.displayName = 'ErrorDetails';

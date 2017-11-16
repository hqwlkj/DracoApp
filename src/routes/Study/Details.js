import React from 'react';
import { connect } from 'dva';
import {routerRedux} from 'dva/router';
import {NavBar,Icon} from 'antd-mobile';
import PhotoSwipe from '../../components/PhotoSwipe/index';
import 'react-photoswiper/lib/photoswipe.css';
import Config from '../../utils/config';
import * as Tools from '../../utils/utils';
import moment from 'moment';
import classnames from 'classnames';
import styles from './Details.less';


class StudyDetails extends React.Component{

  constructor(props) {
    super(props);
    let studyId = parseInt(this.props.location.pathname.split('/').pop());
    this.state = {
      navbarTitle: '在线学习',
      params: {},
      visible: false,
      selected: '',
      studyId,//学习Id
      existQuestion: false,//是否该学习有习题
      study: {},//本条学习详情
      isOpen: false
    }
    this.getStudy = this.getStudy.bind(this);
  }

  getStudy() {
    // let fetchApi = api.course.studyItem;
    // let params = {studyId: this.state.studyId};
    // request.get(fetchApi, params).then((data) => {
    //   let directoryMap = sessionStorage.getItem('directoryMap');
    //   if (directoryMap) {
    //     directoryMap = JSON.parse(directoryMap);
    //     let catePathName = [];
    //     data.result.obj.pathCode.split('/').forEach(i => {
    //       catePathName.push(directoryMap[parseInt(i)].name);
    //     });
    //     data.result.obj.catePathName = catePathName
    //   }
    //   this.setState({study: data.result.obj, existQuestion: data.result.existQuestion});
    // });
  }

  componentWillMount() {
    this.setState({params: this.props.match.params});
    this.getStudy();
  }

  goBackOff() {
    this.props.dispatch(routerRedux.goBack());
  }

  /**
   * 跳转到试卷页面
   * @param id 数据Id
   */
  goToPaper(id) {
    this.props.dispatch(routerRedux.push('/paper/4/' + id + '/0/0'));
  }

  downloadAttachments(key) {
    window.open(Config.QINIU_URL + key); //正式的时候 开启
  }

  openPhotoSwipe() {
    let index = 0;
    this.setState({
      isOpen: true,
      imgIndex: index
    });
  }

  handleClose = () => {
    this.setState({
      isOpen: false
    });
  }


  render(){
    let offsetX = -10; // just for pc demo
    if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) {
      offsetX = -26;
    }

    let content = '<p><img src="http://ojiowy5mw.bkt.clouddn.com/Fuy3ZITG3Vh3FvjIc1SgSH8-ox8q" style="max-width:100%;"></p><p><img src="http://ojiowy5mw.bkt.clouddn.com/FnXzAfVUsS4--WFiYCU1YEneLc0v" style="max-width:100%;"><img src="http://ojiowy5mw.bkt.clouddn.com/FgohbvLb_YXOuZp6Pbywj52cLShZ" style="max-width: 100%;"><img src="http://ojiowy5mw.bkt.clouddn.com/FmJUrerB0Ehs6z8WAR4tQ79mO-Lo" style="max-width: 100%;"><img src="http://ojiowy5mw.bkt.clouddn.com/Fl_thKgW9fuYAh_Dh_DY8lFT4DQB" style="max-width: 100%;"><img src="http://ojiowy5mw.bkt.clouddn.com/FrlGnAh6f2wXdYfSSPDImuTeBQn-" style="max-width: 100%;"><img src="http://ojiowy5mw.bkt.clouddn.com/FksxL4O-7kmSgKCRdw6rOhGE228A" style="max-width: 100%;"><br></p><p><img src="http://ojiowy5mw.bkt.clouddn.com/FvwJR6cloNb1B69y8HoyRBKg3f-8" style="max-width:100%;"><img src="http://ojiowy5mw.bkt.clouddn.com/FrWDdCQLWLz1txHta1HUsPSbtRZW" style="max-width: 100%;"><img src="http://ojiowy5mw.bkt.clouddn.com/Fi9QvvNDMImlLZmvK8PqLf5plsFY" style="max-width: 100%;"><img src="http://ojiowy5mw.bkt.clouddn.com/Fv7BTjhuHr-oL2YLBcpLc-fQs6r2" style="max-width: 100%;"><img src="http://ojiowy5mw.bkt.clouddn.com/FoM7pR85LnWopfo7WghtkmQEb1X7" style="max-width: 100%;">知否<img src="http://ojiowy5mw.bkt.clouddn.com/FivWsjkO2gNZDrDMWqLbkvTiDzzm" style="max-width: 100%;"><img src="http://ojiowy5mw.bkt.clouddn.com/Fn2vr6PZey1hqynuLXP8xAPap5On" style="max-width: 100%;"><img src="http://ojiowy5mw.bkt.clouddn.com/Fu4DDeOieQq_cH4aV34Gaif2_WAw" style="max-width: 100%;"><img src="http://ojiowy5mw.bkt.clouddn.com/FlXqLgAdubLtVh6-lk2NUXqlObXX" style="max-width: 100%;"><img src="http://ojiowy5mw.bkt.clouddn.com/FoW2xvbnWhSBtQbLNNtTofMJmnVG" style="max-width: 100%;"><img src="http://ojiowy5mw.bkt.clouddn.com/FgPUsta56ahsZoWPSe6XxSsAFdNG" style="max-width: 100%;"><img src="http://ojiowy5mw.bkt.clouddn.com/FsM2BwieNawU8ZAzjMqwVeorzbOp" style="max-width: 100%;"><img src="http://ojiowy5mw.bkt.clouddn.com/FtYgkt8fhThwpDTXg8pkTJ4jKaDV" style="max-width: 100%;"><span style="line-height: 1.8;">&nbsp;</span></p><p><br></p>'
    let x = this.state.study.catePathName;
    let attachment = this.state.study.attachment;
    return(<div className={classnames(styles.course_details_component)}>
      <NavBar onLeftClick={() => {
        this.goBackOff()
      }}
              icon={<Icon type='left'/>}
              rightContent={[
        attachment ? (
          <i className={styles.carmeIcon} key='0' style={{marginRight: '0.32rem'}} onClick={() => {
            this.downloadAttachments(attachment);
          }}>&#xe630;</i>) : '', this.state.existQuestion ?
          <i className={styles.carmeIcon} key='1' onClick={() => {
            this.goToPaper(this.state.params.id)
          }}>&#xe600;</i> : null
      ]}>{this.state.navbarTitle}</NavBar>
      <div className={styles.course_details_container} onClick={() => {
        this.setState({
          isOpen: true,
          imgIndex: 0
        })
      }}>
        <h3>{this.state.study.title}</h3>
        <div className={styles.course_details_info}>
          <p className={styles.classify}>
            课程分类： {this.state.study.catePathName ? this.state.study.catePathName.map((value, index, array) =>
            index === (array.length - 1) ? (<span key={index}>{value}</span>) :
              (<span key={index}>{value}/</span>)
          ) : null}</p>
          {this.state.study.createTime ? <p className={styles.time}>
            创建时间：<span>{moment(new Date(parseInt(this.state.study.createTime))).format('YYYY-MM-DD HH:mm:ss')}</span>
          </p> : null}
        </div>
        {/*<div className={styles.course_details_content} dangerouslySetInnerHTML={{__html: Tools.formatFontSize((this.state.study || {}).content)}}/>*/}
        <div className={styles.course_details_content} dangerouslySetInnerHTML={{__html: Tools.formatFontSize(content)}}/>
        {/*<div className='course-details-content'>&nbsp;*/}
        {/*{(this.state.study || {}).content}</div>*/}
      </div>

        <PhotoSwipe gallerySelector={'course-details-content'} currentId={this.state.imgIndex} options={{}}
                    isOpen={this.state.isOpen} handleClose={this.handleClose.bind(this)}/>
    </div>)
  }
}

export default connect(state => ({

}))(StudyDetails);

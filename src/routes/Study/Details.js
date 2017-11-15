import React from 'react';
import { connect } from 'dva';
import {NavBar,Icon} from 'antd-mobile';
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
    window.history.go(-1);
  }

  /**
   * 跳转到试卷页面
   * @param id 数据Id
   */
  goToPaper(id) {
    window.location.href = '#/public/paper/4/' + id + '/0/0';
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
        <div className={styles.course_details_content} dangerouslySetInnerHTML={{__html: Tools.formatFontSize((this.state.study || {}).content)}}/>
        {/*<div className='course-details-content'>&nbsp;*/}
        {/*{(this.state.study || {}).content}</div>*/}
      </div>
      {/*{ !!this.state.isOpen ?*/}
        {/*<PhotoSwipe gallerySelector={'.course-details-content'} currentId={this.state.imgIndex} options={{}}*/}
                    {/*isOpen={this.state.isOpen} handleClose={this.handleClose.bind(this)}/> : null}*/}
    </div>)
  }
}

export default connect(state => ({

}))(StudyDetails);

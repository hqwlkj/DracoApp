import React, {Component} from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import {Carousel, Flex, Icon, ActivityIndicator} from 'antd-mobile';
import styles from './Index.less';
import img_a from '../../assets/swiper/1.jpg';
import img_b from '../../assets/swiper/2.jpg';
import img_c from '../../assets/swiper/3.jpg';
import img_d from '../../assets/swiper/4.jpg';
import img_e from '../../assets/swiper/5.jpg';


class HomeIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [{
        key: 'img_a',
        url: img_a
      }, {
        key: 'img_b',
        url: img_b
      }, {
        key: 'img_c',
        url: img_c
      }, {
        key: 'img_d',
        url: img_d
      }, {
        key: 'img_e',
        url: img_e
      }],
      initialHeight: 176,
    }
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'user/fetchCurrent',
    });
  }

  render() {
    const { currentUser } = this.props;
    const hProp = this.state.initialHeight ? {height: this.state.initialHeight} : {};

    return (<div className={styles.main}>
      <Carousel
        className={styles.carousel}
        autoplay={true}
        infinite
        selectedIndex={0}
        swipeSpeed={35}
      >
        {this.state.data.map(ii => (
          <a key={ii.key} style={hProp}>
            <img
              src={ii.url}
              alt=""
              onLoad={() => {
                // fire window resize event to change height
                window.dispatchEvent(new Event('resize'));
                this.setState({
                  initialHeight: null,
                });
              }}
            />
          </a>
        ))}
      </Carousel>
      <Flex align='center' justify='center' alignContent='center'>
        <Flex.Item>
          <Link className={styles.btnItem} to='/study'>
            <img src={require('../../assets/btns/learn.png')} alt=""/>
            <span>学习天地</span>
          </Link>
        </Flex.Item>
        <Flex.Item>
          <Link className={styles.btnItem} to='/exam'>
            <img src={require('../../assets/btns/exam.png')} alt=""/>
            <span>在线考试</span>
          </Link>
        </Flex.Item>
        <Flex.Item>
          <a className={styles.btnItem} href='http://www.baidu.com'>
            <img src={require('../../assets/btns/message.png')} alt=""/>
            <span>法规查询</span>
          </a>
        </Flex.Item>
      </Flex>
      <Link className={styles.userInfo} to='/account'>
        <div className={styles.accountImg}>
          <img src={require('../../assets/btns/account.png')} alt=""/>
        </div>
        <div className={styles.accountInfo}>
          {currentUser.userName ? (
            <span><span className={styles.userName}>{currentUser.userName}</span>
          <span className={styles.userScore}>学分：{currentUser.credit} 分</span></span>
          ) : <ActivityIndicator size="small" style={{ marginLeft: 8,marginTop:5 }} />}
        </div>
        <div className={styles.accountArrow}>
          <Icon type='right'/>
        </div>
      </Link>
    </div>);
  }
}


export default connect(state => ({
  currentUser: state.user.currentUser,
}))(HomeIndex)

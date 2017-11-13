import React from 'react';
import {connect} from 'dva';
import {NavBar, List, InputItem, Toast, Icon} from 'antd-mobile';
import {createForm} from 'rc-form';
import Config from '../../utils/config';
import SS from 'parsec-ss';
import styles from './ModifyPwd.less';

class ModifyPwd extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: 1
    }
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'user/fetchCurrent',
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.code === 200) {
      nextProps.form.resetFields();
      Toast.success('修改成功');
    }
  }

  validatePassWord = (rule, value, callback) => {
    const {getFieldValue} = this.props.form;
    if (value && value.length >= 6 && value.length <= 30) {
      if (Config.validateRules.weakPwd(value)) {
        callback(new Error('密码强度太弱了，请重新输入！'));
        return;
      }
      if (value && value !== getFieldValue('newPwd')) {
        callback(new Error('您两次输入的密码不一致！'));
        return;
      } else if (Config.validateRules.weakPwd(value)) {
        callback(new Error('新密码太弱了，请重新输入！'));
        return;
      }
      callback();
    } else {
      callback();
    }
  }

  //保存修改密码
  updatePwd = () => {
    const {getFieldValue} = this.props.form;
    let userId = getFieldValue('userId');
    let oldPwd = getFieldValue('oldPwd');
    let newPwd = getFieldValue('newPwd');
    let newPwd2 = getFieldValue('newPwd2');
    //验证密码
    if (oldPwd === undefined || oldPwd === null) {
      Toast.fail("请输入原密码");
      return;
    }
    if (newPwd === undefined || newPwd === null) {
      Toast.fail("请输入新密码");
      return;
    }
    if (newPwd2 !== newPwd) {
      Toast.fail("您两次输入的密码不一致");
      return;
    }
    if (Config.validateRules.weakPwd(newPwd)) {
      Toast.fail("密码强度太弱了，请重新输入");
      return;
    }

    let values = {};
    values['userId'] = userId;
    values['oldPwd'] = oldPwd;
    values['newPwd'] = newPwd;
    this.props.dispatch({
      type: 'user/fetchModifyPwd',
      payload: values,
    })
  }


  render() {
    const {user, currentUser} = this.props;
    const {getFieldProps, getFieldError,} = this.props.form;
    return (
      <div className={styles.modify_pwd_component}>
        <NavBar
          mode="dark"
          onLeftClick={() => window.location.href = '#/account'}
          icon={<Icon type='left'/>}
          rightContent={
            <span style={{fontSize: '0.28rem'}} onClick={() => {
              this.updatePwd();
            }}>保存</span>
          }
        >修改密码</NavBar>
        {
          user.code !== 200 &&
          user.submitting === false &&
          Toast.fail('修改失败！请检查你的原密码是否正确')
        }
        <div style={{display: 'none'}}>
          <InputItem {...getFieldProps('userId', {initialValue: currentUser.userid})}/>
        </div>
        <List className={styles.modify_pwd_container}>
          <InputItem
            {...getFieldProps('oldPwd', {
              rules: [
                {required: true, pattern: /\S{6,30}/, message: '请输入一个长度范围在6~30位之间的密码', type: 'string'},
              ],
            })}
            clear
            error={!!getFieldError('oldPwd')}
            onErrorClick={() => {
              Toast.info(getFieldError('oldPwd').join('、'), 3);
            }}
            placeholder="请输入原密码"
            type="password"
          >原密码</InputItem>
          <InputItem {...getFieldProps('newPwd', {
            rules: [
              {required: true, pattern: /\S{6,30}/, message: '请输入一个长度范围在6~30位之间的密码', type: 'string'},
              {validator: this.validatePassWord}
            ]
          })} clear error={!!getFieldError('newPwd')}
                     onErrorClick={() => {
                       Toast.info(getFieldError('newPwd').join('、'), 3);
                     }} placeholder="请输入新密码" type="password">
            新密码
          </InputItem>
          <InputItem {...getFieldProps('newPwd2', {
            rules: [
              {required: true, message: '请输入确认新密码'},
              {validator: this.validatePassWord}
            ]
          })} clear error={!!getFieldError('newPwd2')}
                     onErrorClick={() => {
                       Toast.info(getFieldError('newPwd2').join('、'), 3);
                     }}
                     placeholder="请输入确认新密码" type="password">
            确认新密码
          </InputItem>
        </List>
      </div>
    );
  }
}

ModifyPwd = createForm()(ModifyPwd);
export default connect(state => ({
  currentUser: state.user.currentUser,
  user: state.user
}))(ModifyPwd);

import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { InputItem, List, Flex, Button, Checkbox, Toast, Modal } from 'antd-mobile';
import { createForm } from 'rc-form';
import Config from '../../utils/config';


import styles from './Login.less';

@connect(state => ({
  login: state.login,
}))

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'mobile',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.login.code === 200) {
      this.props.dispatch(routerRedux.push('/'));
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { type } = this.state;
    this.props.form.validateFields({ force: true }, (errors, values) => {
      if (errors) {
        for (const key in errors) {
          this.renderMessage(errors[key].errors[0].message);
          return;
        }
        return;
      }
      const phone = (values.phone || '').replace(/\s/g, '');// 去掉所有的空格;
      if (!Config.validateRules.isMobile(phone)) {
        this.renderMessage('请输入正确的手机号码');
        return;
      }
      values.phone = phone;
      this.props.dispatch({
        type: `login/${type}Submit`,
        payload: values,
      });
    });
  }

  renderMessage = (message) => {
    return (
      Toast.info(message)
    );
  }

  render() {
    const { form, login } = this.props;
    const { getFieldProps } = form;
    return (
      <div className={styles.main}>
        {
          login.code !== 200 &&
          login.type === 'mobile' &&
          login.submitting === false &&
          this.renderMessage('手机号码或密码错误')
        }
        <List className={styles.additional}>
          <InputItem
            {...getFieldProps('phone', {
              rules: [
                {
                  required: true, type: 'string', message: '请输入手机号码',
                },
              ],
            })}
            type="phone"
            labelNumber={3}
            placeholder="请输入手机号码"
          >手机号
          </InputItem>
          <InputItem
            {...getFieldProps('pwd', {
              rules: [
                {
                  required: true, type: 'string', message: '请输入密码', min: 6, max: 18,
                },
              ],
            })}
            labelNumber={3}
            type="password"
            placeholder="请输入密码"
          >密&nbsp;&nbsp;&nbsp;码
          </InputItem>
          <Flex>
            <Flex.Item>
              <Checkbox.AgreeItem
                data-seed="logId"
                className={styles.autoLogin}
                onChange={e => console.log('checkbox', e)}
              >
                自动登录
              </Checkbox.AgreeItem>
            </Flex.Item>
            <Flex.Item>
              <a
                className={styles.forgot}
                onClick={(e) => {
                e.preventDefault();
                Modal.alert('忘记密码', '如果你的密码丢失或遗忘，可以联系管理员找回密码。');
              }}
              >忘记密码
              </a>
            </Flex.Item>
          </Flex>
          <div>
            <Button
              size="large"
              loading={login.submitting}
              className={styles.submit}
              onClick={e => this.handleSubmit(e)}
            >
              登录
            </Button>
          </div>
        </List>
        <div className={styles.other}>
          其他登录方式
          {/* 需要加到 Icon 中 */}
          <span className={styles.iconAlipay} />
          <span className={styles.iconTaobao} />
          <span className={styles.iconWeibo} />
        </div>
      </div>
    );
  }
}

Login.displayName = 'Login';
Login = createForm()(Login);
export default Login;

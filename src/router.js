import React from 'react';
import { Router, Route, Switch, Redirect,withRouter } from 'dva/router';
import { LocaleProvider } from 'antd-mobile';
import zhCN from './locale/zh_CN';
import BasicLayout from './layouts/BasicLayout';
import UserLayout from './layouts/UserLayout';
import SS from 'parsec-ss';
import Config from './utils/config';


//权限验证(是否登录)
const handleAuth = function () {
  if (SS.get(Config.USER_TOKEN) === null) {
    fakeAuth.signout();
  }else{
    fakeAuth.authenticate();
  }
}

const fakeAuth = {
  isAuthenticated: false,
  authenticate() {
    this.isAuthenticated = true;
  },
  signout() {
    this.isAuthenticated = false;
  }
};


const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    fakeAuth.isAuthenticated ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/user/login',
        state: { from: props.location }
      }}/>
    )
  )}/>
)

function RouterConfig({ history }) {
  handleAuth();
  return (
    <LocaleProvider locale={zhCN}>
      <Router history={history}>
        <Switch>
          <Route path="/user" component={UserLayout} />
          <PrivateRoute path="/" component={BasicLayout}/>
          <Redirect to="/" />
        </Switch>
      </Router>
    </LocaleProvider>
  );
}

export default RouterConfig;

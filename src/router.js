import React from 'react';
import { Router, Route, Switch, Redirect,withRouter } from 'dva/router';
import { LocaleProvider } from 'antd-mobile';
import zhCN from './locale/zh_CN';
import BasicLayout from './layouts/BasicLayout';
import UserLayout from './layouts/UserLayout';
import SS from 'parsec-ss';
import Config from './utils/config';


// //权限验证(是否登录)
// const handleAuth = function () {
//   if (SS.get(Config.USER_TOKEN) === null) {
//     fakeAuth.signout();
//   }else{
//     fakeAuth.authenticate();
//   }
// }

const fakeAuth = {
  isAuthenticated: SS.get(Config.USER_TOKEN) === null ? false : true,
  // authenticate() {
  //   this.isAuthenticated = true;
  // },
  // signout() {
  //   this.isAuthenticated = false;
  // }
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
  // handleAuth();
  return (
    <LocaleProvider locale={zhCN}>
      <Router history={history}>
        <Switch>
          {/* 用了Switch 这里每次只匹配一个路由，所有只有一个节点。 */}
          {/* 不用 Switch 这里可能就会匹配多个路由了，即便匹配不到，也会返回一个null，使动画计算增加了一些麻烦。 */}
          <Route path="/user" component={UserLayout} />
          <PrivateRoute path="/" component={BasicLayout}/>
          <Redirect to="/" />
        </Switch>
      </Router>
    </LocaleProvider>
  );
}

export default RouterConfig;

import BasicLayout from '../layouts/BasicLayout';
import UserLayout from '../layouts/UserLayout';
import BlankLayout from '../layouts/BlankLayout';
import PublicLayout from '../layouts/PublicLayout';


import Exception403 from '../routes/Exception/403';
import Exception404 from '../routes/Exception/404';
import Exception500 from '../routes/Exception/500';

import Success from '../routes/Result/Success';
import Error from '../routes/Result/Error';

import Login from '../routes/User/Login';

import Home from '../routes/Home/Index';
import Study from '../routes/Study/Index';
import StudyDetails from '../routes/Study/Details';
import Exam from '../routes/Exam/Index';
import TestRecord from '../routes/Account/TestRecord';
import ErrorRecord from '../routes/Account/ErrorRecord';
import WrongTitle from '../routes/Account/WrongTitle';
import ErrorDetails from '../routes/Account/ErrorDetails';
import Message from '../routes/Account/Message';
import MessageDetails from '../routes/Account/MessageDetails';
import Integral from '../routes/Account/Integral';
import Rank from '../routes/Account/Rank';

import Center from '../routes/Account/Center';
import ModifyPwd from '../routes/Account/ModifyPwd';

import Paper from '../routes/Paper/Index';
import PaperResult from '../routes/Paper/WrongList';

const data = [{
  component: BasicLayout,
  layout: 'BasicLayout',
  name: '首页', // for breadcrumb
  path: '',
  children: [{
    name: '首页',
    path: 'home/index',
    component: Home,
  }, {
    name: '学习天地',
    path: 'study',
    component: Study,
  }, {
    name: '学习详情',
    path: 'study/:id',
    component: StudyDetails,
  }, {
    name: '在线考试',
    path: 'exam',
    component: Exam,
  }, {
    name: '个人中心',
    path: 'account',
    component: Center,
  }, {
    name: '修改密码',
    path: 'account/pwd',
    component: ModifyPwd,
  }, {
    name: '考试记录',
    path: 'account/test/record',
    component: TestRecord,
  }, {
    name: '错题汇总',
    path: 'account/error/record',
    component: ErrorRecord,
  }, {
    name: '错题汇总分类',
    path: 'account/wrong/title/:type',
    component: WrongTitle,
  }, {
    name: '错题详情',
    path: 'account/error/record/:id',
    component: ErrorDetails,
  }, {
    name: '我的消息',
    path: 'account/message',
    component: Message,
  }, {
    name: '消息详情',
    path: 'account/message/:id',
    component: MessageDetails,
  }, {
    name: '我的积分',
    path: 'account/credit',
    component: Integral,
  }, {
    name: '我的排名',
    path: 'account/rank',
    component: Rank,
  }, {
    name: '试卷页面',
    path: 'paper/:type/:id/:time/:subcateId',
    component: Paper,
  }, {
    name: '试卷结果',
    path: 'paper/result',
    component: PaperResult,
  }, {
    name: '结果',
    path: 'result',
    icon: 'check-circle-o',
    children: [{
      name: '成功',
      path: 'success',
      component: Success,
    }, {
      name: '失败',
      path: 'fail',
      component: Error,
    }],
  }, {
    name: '异常',
    path: 'exception',
    icon: 'warning',
    children: [{
      name: '403',
      path: '403',
      component: Exception403,
    }, {
      name: '404',
      path: '404',
      component: Exception404,
    }, {
      name: '500',
      path: '500',
      component: Exception500,
    }],
  }],
}, {
  component: UserLayout,
  layout: 'UserLayout',
  name: '', // for breadcrumb
  path: '',
  children: [{
    name: '帐户',
    icon: 'user',
    path: 'user',
    children: [{
      name: '登录',
      path: 'login',
      component: Login,
    }],
  }],
}, {
  component: BlankLayout,
  layout: 'BlankLayout',
  path: 'laws',
  children: {
    name: '法规查询',
    path: `http://file.eastonpharma.cn/interface.aspx?key=c8282564bab13ef344b88740fc2b369c&name=15998914691`,
    target: '_blank',
    icon: 'book',
  },
}];

export function getNavData() {
  return data;
}

export default data;

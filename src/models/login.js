import { routerRedux } from 'dva/router';
import { fakeAccountLogin, fakeMobileLogin } from '../services/api';
import SS from 'parsec-ss';
import Config from '../utils/config';

export default {
  namespace: 'login',

  state: {
    code: undefined,
  },

  effects: {
    // 账号密码登录
    *accountSubmit({ payload }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      yield put({
        type: 'changeSubmitting',
        payload: false,
      });
    },
    // 手机号码和密码登录
    *mobileSubmit({ payload }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const response = yield call(fakeMobileLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      yield put({
        type: 'changeSubmitting',
        payload: false,
      });
    },
    // 登出
    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
        },
      });
      yield put(routerRedux.push('/user/login'));
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      if (payload.code === 200) {
        SS.set(Config.USER_TOKEN, payload.result.token);
        SS.setObj(Config.USER, payload.result.user);
        SS.set(Config.USER_ID, payload.result.user.id);
        SS.set(Config.TOKEN_ID, payload.result.user.id);
        SS.setObj('loginUser', {
          phone: payload.result.user.phone,
          pwd: payload.result.user.pwd,
        });
      }
      return {
        ...state,
        code: payload.code,
        // type: payload.type,
      };
    },
    changeSubmitting(state, { payload }) {
      return {
        ...state,
        submitting: payload,
      };
    },
  },
};

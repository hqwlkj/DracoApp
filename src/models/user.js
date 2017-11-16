import { query as queryUsers, queryCurrent, fetchModifyPwd } from '../services/user';

export default {
  namespace: 'user',
  state: {
    code: undefined,
    list: [],
    loading: true,
    currentUser: {},
  },
  effects: {
    * fetch(_, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    * fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
    * fetchModifyPwd({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(fetchModifyPwd, payload);
      yield put({
        type: 'changeModifyPwdStatus',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
        submitting: action.payload,
      };
    },
    changeModifyPwdStatus(state, action) {
      return {
        ...state,
        code: action.payload.code,
        submitting: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload.result,
      };
    },
  },
};

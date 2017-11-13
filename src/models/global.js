import {queryNotices,queryAllNotices,queryErrorTotalNum} from '../services/api';


export default {
  namespace:'global',
  state:{
    collapsed: false,
    notices: [],
    fetchingNotices: false,
    errorNum:0   //错题总数量
  },

  effects: {
    //查询全部通知消息
    *fetchNotices(_, { call, put }) {
      yield put({
        type: 'changeNoticeLoading',
        payload: true,
      });
      const data = yield call(queryAllNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
    },
    //查询最新的通知消息
    *fetchNotices(_, { call, put }) {
      yield put({
        type: 'changeNoticeLoading',
        payload: true,
      });
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
    },
    //查询错题汇总的总数量
    *fetchErrorTotalNum(_, { call, put }) {
      yield put({
        type: 'changeNoticeLoading',
        payload: true,
      });
      const data = yield call(queryErrorTotalNum);
      yield put({
        type: 'saveErrorTotalNum',
        payload: data,
      });
    },
    //将所有的消息 标记为已读
    *clearNotices({ payload }, { put, select }) {
      const count = yield select(state => state.global.notices.length);
      yield put({
        type: 'user/changeNotifyCount',
        payload: count,
      });

      yield put({
        type: 'saveClearedNotices',
        payload,
      });
    },
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
        fetchingNotices: false,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
    changeNoticeLoading(state, { payload }) {
      return {
        ...state,
        fetchingNotices: payload,
      };
    },
    saveErrorTotalNum(state, { payload }) {
      return {
        ...state,
        errorNum: payload.length
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
}

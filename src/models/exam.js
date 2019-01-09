import {queryExam, queryCredit,queryCreditRank} from "../services/exam";

export default {
  namespace: 'exam',

  state: {
    data: {
      result: {
        list: []
      },
      pagination: {},
    },
    loading: true,
    question: {
      questionTypeMap: []
    }
  },
  effects: {
    * fetch({payload}, {call, put}) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryExam, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    * fetchCredit({payload}, {call, put}) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryCredit, payload);
      yield put({
        type: 'saveCredit',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    * fetchCreditRank({payload}, {call, put}) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryCreditRank, payload);
      yield put({
        type: 'saveCreditRank',
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
        data: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    saveCredit(state, action) {
      return {
        ...state,
        data: action.payload.result,
      };
    },

    saveCreditRank(state, action) {
      return {
        ...state,
        creditRank: action.payload.result.list,
      };
    },
  },
}

import {queryExam} from '../services/exam';

export default {
  namespace: 'exam',

  state: {
    data: {
      result:{
        list: []
      },
      pagination: {},
    },
    loading: true,
    question:{
      questionTypeMap:[]
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
    }
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
  },
}

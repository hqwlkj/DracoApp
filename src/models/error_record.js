import {queryErrorRecord, queryErrorRecordNum, getErrorRecordDetail} from '../services/account';

export default {
  namespace: 'errorRecord',
  state: {
    data: {
      list: [],
      allNum: 0,//错题总数量
      pagination: {},
    },
    allNum: 0, //错题总数量
    loading: true,
    errorRecordDetail: {
      itemList:[],
      question:{}
    },
  },
  effects: {
    * fetchErrorRecord({payload}, {call, put}) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryErrorRecord, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      })
    },
    * fetchErrorRecordTotalNum(_, {call, put}){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryErrorRecordNum);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      })
    },
    * getErrorRecordDetail({payload}, {call, put}){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(getErrorRecordDetail, payload);
      yield put({
        type: 'fetchErrorRecordDetail',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      })
    }
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    setTotalNum(state, action){
      return {
        ...state,
        allNum: action.payload,
      };
    },
    fetchErrorRecordDetail(state, action){
      return {
        ...state,
        errorRecordDetail: action.payload.result.list[0],
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  }

}

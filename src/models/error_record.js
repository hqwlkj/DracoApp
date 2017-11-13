import {queryErrorRecord,queryErrorRecordNum} from '../services/account';

export default {
  namespace:'errorRecord',
  state:{
    data:{
      list:[],
      allNum:0,//错题总数量
      pagination: {},
    },
    allNum:0, //错题总数量
    loading:true
  },
  effects:{
    * fetchErrorRecord({payload},{call,put}) {
      yield put({
        type:'changeLoading',
        payload: true,
      });
      const response = yield call(queryErrorRecord,payload);
      yield put({
        type:'save',
        payload: response,
      });
      yield put({
        type:'changeLoading',
        payload: false,
      })
    },
    * fetchErrorRecordTotalNum(_,{call,put}){
      yield put({
        type:'changeLoading',
        payload: true,
      });
      const response = yield call(queryErrorRecordNum);
      yield put({
        type:'save',
        payload: response,
      });
      yield put({
        type:'changeLoading',
        payload: false,
      })
    }
  },
  reducers:{
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
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  }

}

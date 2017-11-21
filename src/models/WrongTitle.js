import {queryErrorRecord,queryErrorRecordNum} from '../services/account';
import {getDirectory} from "../services/study";

export default {
  namespace:'wrongTitle',
  state:{
    directoryList:[],
    data:{
      result:{
        list:[],
      },
      // allNum:0,//错题总数量
      pagination: {},
    },
    allNum:0, //错题总数量
    loading:true
  },
  effects:{
    * fetch({payload},{call,put}) {
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

    *feacthDirectory({payload}, {call, put}){
      //启用加载状态
      yield put({
        type: "changeLoading",
        payload: true,
      });
      //发起请求
      const response = yield call(getDirectory, payload);
      yield put({
        type: "saveDirectoryData",
        payload: response,
      });
      //关闭加载状态
      yield put({
        type: "changeLoading",
        payload: false,
      })

    },
    // * fetchErrorRecordTotalNum(_,{call,put}){
    //   yield put({
    //     type:'changeLoading',
    //     payload: true,
    //   });
    //   const response = yield call(queryErrorRecordNum);
    //   yield put({
    //     type:'save',
    //     payload: response,
    //   });
    //   yield put({
    //     type:'changeLoading',
    //     payload: false,
    //   })
    // }
  },
  reducers:{
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    // setTotalNum(state, action){
    //   return {
    //     ...state,
    //     allNum: action.payload,
    //   };
    // },
    saveDirectoryData(state, action){
      return {
        ...state,
        directoryList: action.payload.result
      }
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  }

}

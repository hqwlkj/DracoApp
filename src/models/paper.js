import { routerRedux } from 'dva/router';
import {getStudyPaper, getTestPaper, submitPaper} from "../services/paper";
import SS from 'parsec-ss';


export default {
  namespace: 'paper',
  state: {
    dataList: [],
    loading: true
  },
  effects: {
    * feacthTestPaper({payload}, {call, put}) {
      //启用加载状态
      yield put({
        type: "checkLoading",
        payload: true,
      });
      //发起请求

      const response = yield call(getTestPaper, payload);
      yield put({
        type: "saveData",
        payload: response,
      });
      //关闭加载状态
      yield put({
        type: "checkLoading",
        payload: false,
      })

    },

    * feacthStudyPaper({payload}, {call, put}) {
      //启用加载状态
      yield put({
        type: "checkLoading",
        payload: true,
      });
      //发起请求

      const response = yield call(getStudyPaper, payload);
      yield put({
        type: "saveData",
        payload: response,
      });
      //关闭加载状态
      yield put({
        type: "checkLoading",
        payload: false,
      })

    },

    * submitPaper({payload}, {call, put,select}) {
      //启用加载状态
      yield put({
        type: "checkLoading",
        payload: true,
      });

      yield put({
        type:'saveSubmitData',
        payload:{
          ...payload
        }
      });
      //发起请求
      const response = yield call(submitPaper, payload);
      yield put({
        type: "checkSubmitPaper",
        payload: response,
      });
      //关闭加载状态
      yield put({
        type: "checkLoading",
        payload: false,
      });
      //跳转地址
      if(response.code === 200){
        yield put(routerRedux.push('/result/success'));
      }else{
        yield put(routerRedux.push('/result/fail'));
      }
    }
  },
  reducers: {
    checkLoading(state, {payload}) {
      return {
        ...state,
        loading: payload
      }
    },
    saveData(state, {payload}) {
      return {
        ...state,
        dataList:(payload.result instanceof Array)?payload.result: payload.result.list,
        answerTime: payload.result.answerTime,
      }
    },
    saveSubmitData(state, {payload}) {
      console.log('saveSubmitData - payload',payload);
      SS.setObj('dataList',payload.dataList);
      SS.setObj('completeData',payload.completeData);
      SS.set('timeConsuming',payload.timeConsuming);
      SS.set('paperType',payload.paperType);
      return {
        ...state,
        dataList: payload.result.list,
        answerTime: payload.result.answerTime,
        completeData: payload.completeData,
        timeConsuming: payload.timeConsuming,
        paperType:payload.paperType
      }
    },
    checkSubmitPaper(state, {payload}) {
      return {
        ...state,
        submitPaper: payload,
      }
    }
  }
}

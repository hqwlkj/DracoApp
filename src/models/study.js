import {getTestPaper,getStudyPaper} from '../services/paper';


export default {
  namespace:'paper',
  state:{
    dataList:[],
    loading: true,
  },
  effects:{
    *feacthTestPaper({payload},{call,put}){
      //启用加载状态
      yield put({
        type:"checkLoading",
        payload:true,
      })
      //发起请求

      const response = yield call(getTestPaper,payload);
      yield put({
        type:"saveData",
        payload:response,
      })
      //关闭加载状态
      yield put({
        type:"checkLoading",
        payload:false,
      })

    },
    *feacthStudyPaper({payload},{call,put}){
      //启用加载状态
      yield put({
        type:"checkLoading",
        payload:true,
      })
      //发起请求

      const response = yield call(getStudyPaper,payload);
      yield put({
        type:"saveData",
        payload:response,
      })
      //关闭加载状态
      yield put({
        type:"checkLoading",
        payload:false,
      })

    }
  },
  reducers:{
   checkLoading(state,payload){
     return {
       ...state,
       loading:payload
     }
   },
    saveData(state,payload){
     return {
       ...state,
       dataList:payload
     }
    }
  }
}

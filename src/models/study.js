import { getStudyDirectory,getDirectory} from "../services/study";


export default {
  namespace: 'study',
  state: {
    dataList: [],
    loading: true,
  },
  effects: {
    *feacthDirectory({payload}, {call, put}){
      //启用加载状态
      yield put({
        type: "checkLoading",
        payload: true,
      })
      //发起请求
      const response = yield call(getDirectory, payload);
      debugger;
      yield put({
        type: "saveDirectoryData",
        payload: response,
      })
      //关闭加载状态
      yield put({
        type: "checkLoading",
        payload: false,
      })

    },

    *feacthStudyDirectory({payload}, {call, put}){
      //启用加载状态
      yield put({
        type: "checkLoading",
        payload: true,
      })
      //发起请求
      const response = yield call(getStudyDirectory, payload);
      yield put({
        type: "saveStudyDirectory",
        payload: response,
      })
      //关闭加载状态
      yield put({
        type: "checkLoading",
        payload: false,
      })
    },

  },
  reducers: {
    checkLoading(state, payload){
      return {
        ...state,
        loading: payload
      }
    },
    saveDirectoryData(state, payload){
      debugger;
      return {
        ...state,
        dataList: payload
      }
    },
    saveStudyDirectory(state, payload){
      debugger;
      return {
        ...state,
        dataList: payload
      }
    }
  }
}

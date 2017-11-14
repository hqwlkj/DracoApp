import { getdirectory} from "../services/study";


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
      const response = yield call(getdirectory, payload);
      yield put({
        type: "saveData",
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
    saveData(state, payload){
      return {
        ...state,
        dataList: payload
      }
    }
  }
}

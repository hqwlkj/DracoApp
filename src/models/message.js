import {getAllMessages} from '../services/account';

export default {
  namespace: 'messages',
  state: {
    data: {
      list: []
    },
    loading: false
  },
  effects: {
    //处理数据，和状态
    * fetch({payload}, {call, put}) {
      console.log('payload', payload);
      //  1,将数据加载状态 设置为：true
      yield put({
        type: 'checkLoading',
        payload: true
      });
      //  2,发起请求，获取响应的数据
      // call  第一个参数默认是我们的请求方法，第二个是  请求参数 （非必填）
      const response = yield call(getAllMessages, payload);
      console.log('request', response);
      yield put({
        type: 'saveData',
        payload: response
      });
      //  3,将数据加载状态 设置为：false
      yield put({
        type: 'checkLoading',
        payload: false
      })
    }
  },
  reducers: {
    //处理响应结果和操作状态
    checkLoading(state, payload) {
      return {
        ...state,
        loading: payload
      }
    },
    saveData(state, action) {
      return {
        ...state,
        data: action.payload,
      }
    }
  }
}

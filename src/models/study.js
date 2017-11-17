import {getDirectory, getStudyDetail, getStudyDirectory, getStudyList} from "../services/study";
import SS from "parsec-ss";

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

    *feacthStudyList({payload}, {call, put}){
      //启用加载状态
      yield put({
        type: "checkLoading",
        payload: true,
      })
      //发起请求
      const response = yield call(getStudyList, payload);
      yield put({
        type: "saveStudyList",
        payload: response,
      })
      //关闭加载状态
      yield put({
        type: "checkLoading",
        payload: false,
      })
    },

    *feacthStudyDetail({payload}, {call, put}){
      //启用加载状态
      yield put({
        type: "checkLoading",
        payload: true,
      })
      //发起请求
      const response = yield call(getStudyDetail, payload);
      yield put({
        type: "saveStudyDetail",
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
    saveDirectoryData(state, response){
      if (response && response.payload && response.payload.result) {
        return {
          ...state,
          directoryOriginList: response.payload.result,
        }
      } else {
        return {
          ...state,
        }
      }
    },
    saveStudyDirectory(state, response){
      if (response && response.payload && response.payload.result) {
        let courseList = response.payload.result;
        let studyIds = new Set();
        for (let i of courseList.pathCodeList) {
          for (let j of  i.split('/')) {
            if (j) {
              j = j.substring(1, j.length);
              studyIds.add(parseInt(j));
            }
          }
        }
        let sortedDirectoryByStudyRate = courseList.sortedDirectoryByStudyRate || [];
        let directoryList = state.directoryOriginList.filter((direct) => studyIds.has(direct.id));
        let directoryMap = directoryListToMap(directoryList);
        SS.set('directoryMap', JSON.stringify(directoryMap));
        directoryListToTree(directoryList, directoryMap);
        //按当前分类完成课程的比例由小到大排序
        let tmp = [];
        let index = 0;
        sortedDirectoryByStudyRate.forEach(i => {
          if (!!directoryMap[i])
            tmp[index++] = directoryMap[i];
        });
        return {
          ...state,
          completeStudyNum: courseList.completeStudyNum,
          isStudyNum: courseList.isStudyNum,
          notStudyNum: courseList.notStudyNum,
          rank: courseList.rank,
          score: courseList.score,
          directoryList,
          directoryMap,
          initData: tmp,
          refreshing: false,
          directoryTree: tmp,
        }
      } else {
        return {
          ...state,
        }
      }
    },

    saveStudyList(state, response){
      if (response && response.payload && response.payload.result) {
        return {
          ...state,
          studyOriginList: response.payload.result.list,
        }
      } else {
        return {
          ...state,
        }
      }
    },

    saveStudyDetail(state, response){
      if (response && response.payload && response.payload.result) {
        return {
          ...state,
          studyDetail: response.payload.result,

        }
      } else {
        return {
          ...state,
        }
      }
    },
  }
}

function directoryListToMap(list) {
  let map = {};
  for (let i = 0; i < list.length; i++) {
    map[list[i].id] = list[i];
  }
  return map;
}

function directoryListToTree(list, dataMap) {
  let result = [];
  for (let i = 0; i < list.length; i++) {
    if (list[i].parentId === 0) {
      result.push(list[i])
    } else {
      if (!dataMap[list[i].parentId]) break;
      let children = dataMap[list[i].parentId].children;
      if (!children) {
        children = [];
        dataMap[list[i].parentId].children = children;
      }
      children.push(list[i]);
    }
  }
  return result;
}

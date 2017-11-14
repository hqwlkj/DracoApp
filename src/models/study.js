import {getDirectory, getStudyDirectory} from "../services/study";
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
        let directoryList = state.directoryOriginList.filter((direct) => studyIds.has(direct.id));
        let directoryMap = directoryListToMap(directoryList);
        SS.set('directoryMap', JSON.stringify(directoryMap));
        let directoryTree = directoryListToTree(directoryList, directoryMap);
        const dataSource = new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2
        });
        this.setState({
            ...state,
            completeStudyNum: courseList.completeStudyNum,
            isStudyNum: courseList.isStudyNum,
            notStudyNum: courseList.notStudyNum,
            directoryList,
            directoryMap,
            initData: directoryTree,
            refreshing: false,
            directoryTree,
          }, () => this.onChange(directoryTree[0], null, 0)
        );
        return {
          ...state,
        }
      } else {
        return {
          ...state,
        }
      }
    }
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

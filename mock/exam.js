import { getUrlParams } from './utils';

// mock tableListDataSource
let tableListDataSource = [];
for (let i = 0; i < 46; i += 1) {
  tableListDataSource.push({
    key: i,
    id: i,
    name: `一个任务名称 ${i}`,
    questionName: `错题名称 ${i}`,
    createTime: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    startDay: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    endDay: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    startTime:'00:00:00',
    endTime:'23:59:59',
    frequency: Math.ceil(Math.random() * 100),
    lengthTime: Math.ceil(Math.random() * 100),
    subjectCount: Math.ceil(Math.random() * 100),
    status:Math.ceil(Math.random() * 2),
    title: `获取积分的说明 ${i}`,
    score:Math.ceil(Math.random() * 100),
    username:`张三_ ${i}`,
    rankNum:`${i}`,
    num:`${i}`
  });
}

export function getExam(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  let dataSource = [...tableListDataSource];

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.status) {
    const s = params.status.split(',');
    if (s.length === 1) {
      dataSource = dataSource.filter(data => parseInt(data.status, 10) === parseInt(s[0], 10));
    }
  }

  if (params.no) {
    dataSource = dataSource.filter(data => data.no.indexOf(params.no) > -1);
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    list: dataSource,
    totalNum:Math.ceil(Math.random() * 1000),
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}


export default {
  getExam
};

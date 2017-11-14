import {getExam} from './mock/exam';
import {imgMap} from './mock/utils';
import {getNotices} from './mock/notices';
import {format, delay} from 'roadhog-api-doc';

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': {
    $desc: "获取当前用户接口",
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      name: '张三',
      avatar: imgMap.user,
      phone: '15888888888',
      credit: 80,
      userid: '00000001',
      notifyCount: 12, //未读消息数
    },
  },
  // GET POST 可省略
  'GET /api/user/00000001': {
    name: '张三',
    avatar: imgMap.user,
    userid: '00000001',
    sex: '1',
    address: '重庆市渝中区'
  },
  'GET /api/all_notices': getNotices,
  'GET /api/notices': getNotices,
  'GET /api/findAllExam': getExam,
  'POST /api/login/account': (req, res) => {
    const {password, userName} = req.body;
    res.send({code: password === '123456' && userName === 'admin' ? 200 : 201, type: 'account'});
  },
  'POST /api/login/mobile': (req, res) => {
    const {password, userName} = req.body;
    res.send({
      code: password === '123456' && userName === '15998914690' ? 200 : 201,
      type: 'mobile',
      message: '登录成功',
      result: {token: "eyJhbGciOiJIUzUxMiIsImNhbGciOiJHWklQIn0.H4sIAAAAAAAAAKtWyiwuVrJSSk4syk1V0lFKLE0B8sxNgczi0iQg0wjISq0oULIyNDU0sLQwNzI0qAUAS__oAjUAAAA.ZT0L8A-Wuq4aycmVUJQKGPqkb6sGEW306zaDHE5d2GsWafX-DrsJfQRSKFCvFe4I_hJ69nIF3a-1l6RdcATSQw"}
    });
  },
  'POST /api/updatePwd': (req, res) => {
    res.send({code: 200, message: '修改成功'});
  },
  'GET /api/query_error_record_num': (req, res) => {
    res.send({code: 200, allNum: 20, radioNum: 15, checkboxNum: 5});
  },
  'GET /api/findTestPaper':getExam,
  'GET /api/findStudyPaper':getExam,
  }
  'GET /api/query_all_message':getExam
};

export default noProxy ? {} : delay(proxy, 1000);

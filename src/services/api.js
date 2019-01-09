
import request from '../utils/request';


export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}


export async function fakeMobileLogin(params) {
  return request('/api/user/login', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/message/unRead');
}


export async function queryAllNotices() {
  return request('/api/message');
}

export async function queryErrorTotalNum() {
  return request('/api/notices');
}

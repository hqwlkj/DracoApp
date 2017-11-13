import { stringify } from 'qs';
import request from '../utils/request';

//账号密码登录
export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

//手机号码和密码登录
export async function fakeMobileLogin(params) {
  return request('/api/login/mobile', {
    method: 'POST',
    body: params,
  });
}

//查询最新的通知消息
export async function queryNotices() {
  return request('/api/notices');
}

//查询全部通知消息
export async function queryAllNotices() {
  return request('/api/all_notices');
}

//查询错题汇总的总数量
export async function queryErrorTotalNum() {
  return request('/api/notices');
}

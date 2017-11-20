import request from '../utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/user/currentUser');
}


export async function fetchModifyPwd(params) {
  return request('/api/user/updatePwd', {
    method: 'POST',
    body: params,
  });
}

export async function fetchCredit(params) {
  return request('/api/credit');
}

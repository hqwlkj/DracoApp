import request from '../utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}


//修改密码
export async function fetchModifyPwd(params) {
  return request('/api/updatePwd',{
    method: 'POST',
    body: params,
  });
}

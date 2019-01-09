import request from '../utils/request';

export function queryExam() {
  return request('/api/paper/user_answer');
}

export function queryCredit() {
  return request('/api/creditList');
}

export function queryCreditRank() {
  return request('/api/creditRank');
}

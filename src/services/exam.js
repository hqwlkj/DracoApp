import request from '../utils/request';

export function queryExam() {
  return request('/api/paper/user_answer');
}

export function queryExamCredit() {
  return request('/api/creditList');
}

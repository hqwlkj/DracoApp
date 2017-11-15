import request from '../utils/request';

export function queryExam() {
  return request('/api/paper/user_answer');
}

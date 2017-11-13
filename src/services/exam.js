import request from '../utils/request';

export function queryExam() {
  return request('/api/findAllExam');
}

import request from '../utils/request';

// 主要用于 个人中心的数据查询

/**
 * 查询错题列表
 * @param params type= 1 || 2  (单选|| 多选)
 * @returns {Object}
 */
export async function queryErrorRecord(params) {
  return request('/api/query_error_record', { body: params });
}


/**
 * 查询错题总数
 * @returns {Object}
 */
export async function queryErrorRecordNum() {
  return request('/api/query_error_record_num');
}


export async function getAllMessages(params) {
  return request('/api/message', { method: 'POST', body: params });
}


export async function queryUnReadNum() {
  return request('/api/message/unRead');
}

export async function readAllMessage() {
  return request('/api/message/read');
}

export async function getMessageDetail(params) {
  return request('/api/message/detail/'+params);
}

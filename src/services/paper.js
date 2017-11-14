/**
 * Created by xiaoyao on 17-11-13.
 */


import request from '../utils/request';


export async function getTestPaper() {
  return request('/api/findTestPaper');
}
export async function getStudyPaper() {
  return request('/api/findStudyPaper');
}

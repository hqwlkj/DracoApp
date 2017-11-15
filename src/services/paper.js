/**
 * Created by xiaoyao on 17-11-13.
 */


import request from "../utils/request";

export async function getTestPaper() {
  return request('/api/findTestPaper');
}
export async function getStudyPaper(options) {
  return request('/api/study_question/' + options.id);
}

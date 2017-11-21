/**
 * Created by xiaoyao on 17-11-13.
 */


import request from "../utils/request";

export async function getTestPaper(options) {
  return request(`/api/paper/test/${options.id}/questions`);
}
export async function getStudyPaper(options) {
  return request('/api/study_question/' + options.id);
}

export async function submitPaper(options) {
  return request('/api/answers', {
    method: 'POST',
    body: options,
  });
}

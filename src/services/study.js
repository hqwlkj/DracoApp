/**
 * Created by xiaoyao on 17-11-13.
 */


import request from "../utils/request";


export async function getdirectory(options) {
  return request('/api/directory/list',options);
}
// export async function getStudyDirectory() {
//   return request('/api/findStudyPaper');
// }

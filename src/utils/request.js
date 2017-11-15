import fetch from 'dva/fetch';
import {Toast} from 'antd-mobile';
import Config from './config';
import SS from 'parsec-ss';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  Toast.offline(`请求错误: ${response.status}: ${response.url}, 响应状态码:${response.statusText}`);

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = {...defaultOptions, ...options};
  newOptions.headers = {
    token: SS.get(Config.USER_TOKEN) === null ? 'eyJhbGciOiJIUzUxMiIsImNhbGciOiJHWklQIn0.H4sIAAAAAAAAAKtWyiwuVrJSSk4syk1V0lFKLE0B8gwNgczi0iQQE8hKrShQsjI0NTAxNje3NDCpBQBXkyoONQAAAA.d7kc-sToeUYyCwWsTQLQU21Rjdaw-50drcVTgUt3L5JVqyTQWK8OXCQ99OstBhJQ8cpdrcTEOmuqH7zc1xtqFA' : SS.get(Config.USER_TOKEN),
    tokenId: SS.get(Config.TOKEN_ID) === null ? '11' : SS.get(Config.TOKEN_ID),
    userId: SS.get(Config.USER_ID) === null ? '18' : SS.get(Config.USER_ID)
  };
  if (!newOptions.headers.tokenId) newOptions.headers['tokenId'] = SS.get(Config.TOKEN_ID) === null ? '11' : SS.get(Config.TOKEN_ID);
  newOptions.headers.userId = SS.get(Config.USER_ID) === null ? '18' : SS.get(Config.USER_ID);
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    newOptions.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      ...newOptions.headers,
    };
    newOptions.body = JSON.stringify(newOptions.body);
  }

  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => response.json())
    .catch((error) => {
      if (error.code) {
        Toast.fail(error.message);
      }
      if ('stack' in error && 'message' in error) {
        console.log(`请求错误: ${url}`);
        Toast.fail(error.message);
      }
      return error;
    });
}

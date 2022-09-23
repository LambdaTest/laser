import axios from 'axios';
import { getAuthToken } from '../../helpers/genericHelpers';
const CancelToken = axios.CancelToken;
export let cancelAxiosRequest;

export const httpGet = (url, params = {}, header) => {
  return axios({
    headers: { Authorization: `Bearer ${getAuthToken()}` },
    method: 'GET',
    params: params,
    url: url,
    cancelToken: new CancelToken(function executor(c) {
      cancelAxiosRequest = c;
    }),
  }).then((res) => res.data);
};

export const httpPost = (url, data, params = {}) => {
  return axios({
    data: data,
    headers: { Authorization: `Bearer ${getAuthToken()}` },
    method: 'POST',
    params: params,
    url: url,
  }).then((res) => res.data);
};

export const httpPut = (url, data, params = {}) => {
  return axios({
    data: data,
    headers: { Authorization: `Bearer ${getAuthToken()}` },
    method: 'PUT',
    params: params,
    url: url,
  }).then((res) => res.data);
};

export const httpDelete = (url, data, params = {}) => {
  return axios({
    data: data,
    headers: { Authorization: `Bearer ${getAuthToken()}` },
    method: 'DELETE',
    params: params,
    url: url,
  }).then((res) => res.data);
};

export const httpPatch = (url, data, params = {}) => {
  return axios({
    data: data,
    headers: { Authorization: `Bearer ${getAuthToken()}` },
    method: 'PATCH',
    params: params,
    url: url,
  }).then((res) => res.data);
};
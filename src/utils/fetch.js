import axios from 'axios';
import { message } from 'antd';

const instance = axios.create();

// 请求前拦截器
instance.interceptors.request.use((config) => {
  // 设置超时15s
  config.timeout = 15000;
  return config;
}, function (error) {
  return Promise.reject(error);
});

// 请求返回拦截器
instance.interceptors.response.use((res) => {
  return res.data;
}, (err) => {
  message.error('网络异常，请稍后尝试！');
  return err;
});

// 对外暴露get方法
export function get(url, params = {}) {
  console.log(url, params);
  return instance({
    method: 'get',
    url,
    params,
  });
}

export const request = instance;

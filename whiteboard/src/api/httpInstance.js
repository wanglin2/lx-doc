import axios from 'axios'
import { message } from 'antd'

const http = axios.create({
  timeout: 10000,
  withCredentials: true,
  baseURL: '/api/'
})

// 请求拦截器
http.interceptors.request.use(
  function (config) {
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  function (response) {
    if (response.data.code !== 0) {
      message.error(response.data.message)
      return Promise.reject(response)
    }
    return response
  },
  function (error) {
    return Promise.reject(error)
  }
)

export default http
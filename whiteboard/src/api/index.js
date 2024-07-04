import http from './httpInstance'
import getMockData from './mock'

const isDev = process.env.NODE_ENV !== 'production'
const useMock = import.meta.env.MODE === 'mock'

export default {
  // 上传文件
  uploadFiles(data) {
    if (useMock) {
      return getMockData('uploadFiles', data)
    }
    return http.post('/uploadFiles', data)
  },

  // 上传图片
  uploadImg(data) {
    if (useMock) {
      return getMockData('uploadImg', data)
    }
    return http.post('/uploadImg', data)
  },

  // 获取用户信息
  getUserInfo() {
    if (useMock) {
      return getMockData('getUserInfo')
    }
    return http.get('/getUserInfo')
  },

  // 获取用户配置
  getUserConfig(params) {
    if (useMock) {
      return getMockData('getUserConfig', params)
    }
    return http.get('/getUserConfig', {
      params
    })
  },

  // 更新用户配置
  updateUserConfig(data) {
    if (useMock) {
      return getMockData('updateUserConfig', data)
    }
    return http.post('/updateUserConfig', data)
  },

  // 更新文件
  updateFile(data) {
    if (useMock) {
      return getMockData('updateFile', data)
    }
    return http.post('/updateFile', data)
  },

  // 获取文件内容
  getFileContent(params) {
    if (useMock) {
      return getMockData('getFileContent', {
        params
      })
    }
    return http.get('/getFileContent', {
      params
    })
  }
}

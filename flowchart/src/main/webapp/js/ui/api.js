const http = axios.create({
  timeout: 10000,
  withCredentials: true
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
      ElementPlus.ElMessage.error(response.data.message)
      return Promise.reject(response)
    }
    return response
  },
  function (error) {
    return Promise.reject(error)
  }
)

const useMock = true

window.api = {
  // 上传文件
  uploadFiles(data) {
    if (useMock) {
      return window.getMockData('uploadFiles', data)
    }
    return http.post('/uploadFiles', data)
  },

  // 上传图片
  uploadImg(data) {
    if (useMock) {
      return window.getMockData('uploadImg', data)
    }
    return http.post('/uploadImg', data)
  },

  // 获取用户信息
  getUserInfo() {
    if (useMock) {
      return window.getMockData('getUserInfo')
    }
    return http.get('/getUserInfo')
  },

  // 获取用户配置
  getUserConfig(params) {
    if (useMock) {
      return window.getMockData('getUserConfig', params)
    }
    return http.get('/getUserConfig', {
      params
    })
  },

  // 更新用户配置
  updateUserConfig(data) {
    if (useMock) {
      return window.getMockData('updateUserConfig', data)
    }
    return http.post('/updateUserConfig', data)
  },

  // 更新文件
  updateFile(data) {
    if (useMock) {
      return window.getMockData('updateFile', data)
    }
    return http.post('/updateFile', data)
  },

  // 获取文件内容
  getFileContent(params) {
    if (useMock) {
      return window.getMockData('getFileContent', {
        params
      })
    }
    return http.get('/getFileContent', {
      params
    })
  }
}

import http from './httpInstance'
import getMockData from './mock'

const isDev = process.env.NODE_ENV === 'development'

export default {
  // 退出登录
  logout() {
    if (isDev) {
      return getMockData('logout')
    }
    return http.get('/logout')
  },

  // 获取用户信息
  getUserInfo() {
    if (isDev) {
      return getMockData('getUserInfo')
    }
    return http.get('/getUserInfo')
  },

  // 获取用户配置
  getUserConfig() {
    if (isDev) {
      return getMockData('getUserConfig')
    }
    return http.get('/getUserConfig')
  },

  // 更新用户配置
  updateUserConfig(data) {
    if (isDev) {
      return getMockData('updateUserConfig', data)
    }
    return http.post('/updateUserConfig', data)
  },

  // 获取文件夹树，异步树
  getFolderTree(params) {
    if (isDev) {
      return getMockData('getFolderTree', params)
    }
    return http.get('/getFolderTree', {
      params
    })
  },

  // 获取某个文件夹下的文件夹列表和文件列表
  getFolderAndFileList(params) {
    if (isDev) {
      return getMockData('getFolderAndFileList', params)
    }
    return http.get('/getFolderAndFileList', {
      params
    })
  },

  // 创建新文件--------------------
  createFile(data) {
    if (isDev) {
      return getMockData('createFile', data)
    }
    return http.post('/createFile', data)
  },

  // 更新文件
  updateFile(data) {
    if (isDev) {
      return getMockData('updateFile', data)
    }
    return http.post('/updateFile', data)
  },

  // 移动文件
  moveFile(data) {
    if (isDev) {
      return getMockData('moveFile', data)
    }
    return http.post('/moveFile', data)
  },

  // 复制文件
  copyFile(data) {
    if (isDev) {
      return getMockData('copyFile', data)
    }
    return http.post('/copyFile', data)
  },

  // 删除文件
  deleteFile(data) {
    if (isDev) {
      return getMockData('deleteFile', data)
    }
    return http.post('/deleteFile', data)
  },

  // 新建文件夹--------------------
  crateFolder(data) {
    if (isDev) {
      return getMockData('crateFolder', data)
    }
    return http.post('/crateFolder', data)
  },

  // 更新文件夹
  updateFolder(data) {
    if (isDev) {
      return getMockData('updateFolder', data)
    }
    return http.post('/updateFolder', data)
  },

  // 删除文件夹
  deleteFolder(data) {
    if (isDev) {
      return getMockData('deleteFolder', data)
    }
    return http.post('/deleteFolder', data)
  },

  // 移动文件夹
  moveFolder(data) {
    if (isDev) {
      return getMockData('moveFolder', data)
    }
    return http.post('/moveFolder', data)
  }
}

import http from './httpInstance'
import getMockData from './mock'
import config from '@/config'

const isDev = process.env.NODE_ENV === 'development'
const useMock = import.meta.env.MODE === 'mock'

export default {
  // 上传文件
  uploadFiles(data) {
    if (useMock) {
      return getMockData('uploadFiles', data)
    }
    return http.post('/uploadFiles', data)
  },

  // 退出登录---------------------------
  logout() {
    if (useMock) {
      return getMockData('logout')
    }
    return http.get('/logout')
  },

  // 登录
  login(data) {
    if (useMock) {
      return getMockData('login', data)
    }
    return http.post('/login', data)
  },

  // 注册
  register(data) {
    if (useMock) {
      return getMockData('register', data)
    }
    return http.post('/register', data)
  },

  // 获取用户信息
  getUserInfo() {
    if (useMock) {
      return getMockData('getUserInfo')
    }
    return http.get('/getUserInfo')
  },

  // 更新用户信息
  updateUserInfo(data) {
    if (useMock) {
      return getMockData('updateUserInfo', data)
    }
    return http.post('/updateUserInfo', data)
  },

  // 修改密码
  changePassword(data) {
    if (useMock) {
      return getMockData('changePassword', data)
    }
    return http.post('/changePassword', data)
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

  // 获取文件夹树，异步树---------------------------
  async getFolderTree(params) {
    if (useMock) {
      return getMockData('getFolderTree', params)
    }
    const { data } = await http.get('/getFolderTree', {
      params
    })
    // 如果没有根节点，那么就创建一个
    if (params.folderId === '' && data.length <= 0) {
      const res = await this.crateFolder({
        name: config.rootFolderName,
        parentFolderId: ''
      })
      return [{
        ...res.data,
        leaf: true
      }]
    } else {
      return data
    }
  },

  // 获取某个文件夹下的文件夹列表和文件列表
  getFolderAndFileList(params) {
    if (useMock) {
      return getMockData('getFolderAndFileList', params)
    }
    return http.get('/getFolderAndFileList', {
      params
    })
  },

  // 搜索文件夹和文件
  searchFolderAndFile(data) {
    if (useMock) {
      return getMockData('searchFolderAndFile', data)
    }
    return http.post('/searchFolderAndFile', data)
  },

  // 创建新文件--------------------
  createFile(data) {
    if (useMock) {
      return getMockData('createFile', data)
    }
    return http.post('/createFile', data)
  },

  // 更新文件
  updateFile(data) {
    if (useMock) {
      return getMockData('updateFile', data)
    }
    return http.post('/updateFile', data)
  },

  // 移动文件
  moveFile(data) {
    if (useMock) {
      return getMockData('moveFile', data)
    }
    return http.post('/moveFile', data)
  },

  // 复制文件
  copyFile(data) {
    if (useMock) {
      return getMockData('copyFile', data)
    }
    return http.post('/copyFile', data)
  },

  // 删除文件
  deleteFile(data) {
    if (useMock) {
      return getMockData('deleteFile', data)
    }
    return http.post('/deleteFile', data)
  },

  // 新建文件夹--------------------
  crateFolder(data) {
    if (useMock) {
      return getMockData('crateFolder', data)
    }
    return http.post('/crateFolder', data)
  },

  // 更新文件夹
  updateFolder(data) {
    if (useMock) {
      return getMockData('updateFolder', data)
    }
    return http.post('/updateFolder', data)
  },

  // 删除文件夹
  deleteFolder(data) {
    if (useMock) {
      return getMockData('deleteFolder', data)
    }
    return http.post('/deleteFolder', data)
  },

  // 移动文件夹
  moveFolder(data) {
    if (useMock) {
      return getMockData('moveFolder', data)
    }
    return http.post('/moveFolder', data)
  },

  // 复制文件夹
  copyFolder(data) {
    if (useMock) {
      return getMockData('copyFolder', data)
    }
    return http.post('/copyFolder', data)
  },

  // 获取收藏的文件列表---------------------
  getCollectFileList(params) {
    if (useMock) {
      return getMockData('getCollectFileList', params)
    }
    return http.get('/getCollectFileList', {
      params
    })
  },

  // 取消收藏
  cancelCollect(data) {
    if (useMock) {
      return getMockData('cancelCollect', data)
    }
    return http.post('/cancelCollect', data)
  },

  // 收藏文件
  collect(data) {
    if (useMock) {
      return getMockData('collect', data)
    }
    return http.post('/collect', data)
  },

  // 获取回收站列表-------------------------------------
  getRecycleFolderAndFileList(params) {
    if (useMock) {
      return getMockData('getRecycleFolderAndFileList', params)
    }
    return http.get('/getRecycleFolderAndFileList', {
      params
    })
  },

  // 从回收站恢复文件夹或文件
  restore(data) {
    if (useMock) {
      return getMockData('restore', data)
    }
    return http.post('/restore', data)
  },

  // 彻底删除文件夹或文件
  completelyDelete(data) {
    if (useMock) {
      return getMockData('completelyDelete', data)
    }
    return http.post('/completelyDelete', data)
  },

  // 清空回收站
  emptyRecycle() {
    if (useMock) {
      return getMockData('emptyRecycle')
    }
    return http.post('/emptyRecycle')
  }
}

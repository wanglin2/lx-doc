import http from './httpInstance'
import getMockData from './mock'
import { simpleDeepClone } from 'simple-mind-map/src/utils/index'

const SIMPLE_MIND_MAP_LANG = 'SIMPLE_MIND_MAP_LANG'
const SIMPLE_MIND_MAP_LOCAL_CONFIG = 'SIMPLE_MIND_MAP_LOCAL_CONFIG'

const isDev = process.env.NODE_ENV === 'development'
const useMock = isDev

// 上传文件
export const uploadFiles = data => {
  if (useMock) {
    return getMockData('uploadFiles', data)
  }
  return http.post('/uploadFiles', data)
}

// 上传图片
export const uploadImg = data => {
  if (useMock) {
    return getMockData('uploadImg', data)
  }
  return http.post('/uploadImg', data)
}

// 获取用户信息
export const getUserInfo = () => {
  if (useMock) {
    return getMockData('getUserInfo')
  }
  return http.get('/getUserInfo')
}

// 获取文件内容
export const getFileContent = params => {
  if (useMock) {
    return getMockData('getFileContent', {
      params
    })
  }
  return http.get('/getFileContent', {
    params
  })
}

// 更新文件内容
export const updateFile = data => {
  if (useMock) {
    return getMockData('updateFile', data)
  }
  return http.post('/updateFile', data)
}

/**
 * @Author: 王林
 * @Date: 2021-08-02 22:36:48
 * @Desc: 克隆思维导图数据，去除激活状态
 */
export const copyMindMapTreeData = (tree, root) => {
  if (!root) return null
  tree.data = simpleDeepClone(root.data)
  // tree.data.isActive = false
  tree.children = []
  if (root.children && root.children.length > 0) {
    root.children.forEach((item, index) => {
      tree.children[index] = copyMindMapTreeData({}, item)
    })
  }
  return tree
}

/**
 * javascript comment
 * @Author: 王林
 * @Date: 2022-11-05 14:36:50
 * @Desc: 存储语言
 */
export const storeLang = lang => {
  localStorage.setItem(SIMPLE_MIND_MAP_LANG, lang)
}

/**
 * javascript comment
 * @Author: 王林
 * @Date: 2022-11-05 14:37:36
 * @Desc: 获取存储的语言
 */
export const getLang = () => {
  let lang = localStorage.getItem(SIMPLE_MIND_MAP_LANG)
  if (lang) {
    return lang
  }
  storeLang('zh')
  return 'zh'
}

/**
 * javascript comment
 * @Author: 王林25
 * @Date: 2022-11-14 18:57:31
 * @Desc: 存储本地配置
 */
export const storeLocalConfig = config => {
  localStorage.setItem(SIMPLE_MIND_MAP_LOCAL_CONFIG, JSON.stringify(config))
}

/**
 * javascript comment
 * @Author: 王林25
 * @Date: 2022-11-14 18:57:37
 * @Desc: 获取本地配置
 */
export const getLocalConfig = () => {
  let config = localStorage.getItem(SIMPLE_MIND_MAP_LOCAL_CONFIG)
  if (config) {
    return JSON.parse(config)
  }
  return null
}

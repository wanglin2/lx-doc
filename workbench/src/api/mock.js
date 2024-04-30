import config from '../config'

const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min
}

const createFileList = () => {
  return new Array(getRandom(3, 20)).fill(0).map((item, index) => {
    return {
      id: Math.random(),
      name:
        Math.random() > 0.5
          ? '我是名称超级超级超级超级超级超级超级长的文件'
          : '文件' + index,
      type: config.createTypeList[getRandom(0, config.createTypeList.length)]
        .value,
      img:
        Math.random() > 0.5
          ? 'https://img2.baidu.com/it/u=2842168711,3751422993&fm=253&fmt=auto&app=120&f=JPEG?w=576&h=500'
          : '',
      createAt: '2024-04-29 16:55:55',
      updateAt: '2024-04-20 16:55:55'
    }
  })
}

const mockData = {
  noData: null,
  getUserInfo: {
    userName: '街角小林',
    userId: '123',
    avatar:
      'https://img0.baidu.com/it/u=3438909157,109984304&fm=253&fmt=auto&app=138&f=JPEG?w=530&h=500'
  },
  getUserConfig: {
    layoutType: 'grid'
  },
  getFolderTree: ({ folderId }) => {
    switch (folderId) {
      case '':
        return [
          {
            name: '我的文件',
            id: '0',
            leaf: false
          }
        ]
      case '0':
        return [
          {
            name: '思维导图',
            id: '1',
            leaf: false
          },
          {
            name: '流程图',
            id: '2',
            leaf: false
          }
        ]
      case '1':
        return [
          {
            name: '学习',
            id: '1-1',
            leaf: false
          },
          {
            name: '周末计划',
            id: '1-2',
            leaf: true
          }
        ]
      case '1-1':
        return [
          {
            name: '前端学习',
            id: '1-1-1',
            leaf: true
          },
          {
            name: '后端学习',
            id: '1-1-2',
            leaf: true
          }
        ]
      case '2':
        return [
          {
            name: '杭州旅行',
            id: '2-1',
            leaf: true
          },
          {
            name: '南京游玩',
            id: '2-2',
            leaf: true
          }
        ]
    }
  },
  getFolderAndFileList: ({ folderId }) => {
    switch (folderId) {
      case '':
        return {
          folderList: [
            {
              name: '我的文件',
              id: '0'
            }
          ],
          fileList: []
        }
      case '0':
        return {
          folderList: [
            {
              name: '思维导图',
              id: '1',
              createAt: '2024-04-25 16:55:55',
              updateAt: '2024-04-25 16:55:55'
            },
            {
              name: '流程图',
              id: '2',
              createAt: '2024-04-25 16:55:55',
              updateAt: '2024-04-25 16:55:55'
            }
          ],
          fileList: createFileList()
        }
      case '1':
        return {
          folderList: [
            {
              name: '学习',
              id: '1-1'
            },
            {
              name: '周末计划',
              id: '1-2'
            }
          ],
          fileList: createFileList()
        }
      case '2':
        return {
          folderList: [
            {
              name: '杭州旅行',
              id: '2-1'
            },
            {
              name: '南京游玩',
              id: '2-2'
            }
          ],
          fileList: createFileList()
        }
      case '1-1':
        return {
          folderList: [
            {
              name: '前端学习',
              id: '1-1-1'
            },
            {
              name: '后端学习',
              id: '1-1-2'
            },
            {
              name: '我是名称超级超级超级超级超级超级超级长的文件',
              id: '1-1-3'
            }
          ],
          fileList: createFileList()
        }
      default:
        return {
          folderList: [],
          fileList: createFileList()
        }
    }
  },
  searchFolderAndFile(data) {
    return {
      folderList: [
        {
          name: '思维导图',
          id: '1',
          path: [
            {
              name: '我的文件',
              id: '0'
            }
          ],
          createAt: '2024-04-25 16:55:55',
          updateAt: '2024-04-25 16:55:55'
        },
        {
          name: '前端学习',
          id: '1-1-1',
          path: [
            {
              name: '我的文件',
              id: '0'
            },
            {
              name: '思维导图',
              id: '1'
            },
            {
              name: '学习',
              id: '1-1'
            }
          ],
          createAt: '2024-04-25 16:55:55',
          updateAt: '2024-04-25 16:55:55'
        }
      ],
      fileList: createFileList()
    }
  },
  createFile: ({ name, type, folderId }) => {
    return {
      name,
      type,
      folderId,
      id: Math.random() + ''
    }
  },
  crateFolder: ({ name, parentFolderId }) => {
    return {
      name,
      parentFolderId,
      id: Math.random() + ''
    }
  },
  updateFolder: ({ name, id }) => {
    return {
      name,
      id
    }
  },
  updateFile: ({ name, id }) => {
    return {
      name,
      id
    }
  }
}

const getMockData = (api, ...args) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(api, ...args)
      if (typeof mockData[api] === 'function') {
        resolve({
          code: 0,
          message: 'success',
          data: mockData[api](...args)
        })
      } else if (mockData[api] !== undefined) {
        resolve({
          code: 0,
          message: 'success',
          data: mockData[api]
        })
      } else {
        resolve({
          code: 0,
          message: 'success',
          data: mockData.noData
        })
      }
      // reject({
      //   code: -1,
      //   message: 'fail',
      //   data: null
      // })
    }, 200)
  })
}

export default getMockData

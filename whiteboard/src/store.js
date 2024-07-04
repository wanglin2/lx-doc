import api from '@/api'
import eventBus from '@/utils/eventBus'

const store = {
  data: {
    // 用户信息
    userInfo: null,
    // 用户配置
    userConfig: null,
    // 文件数据
    fileData: null,
    // 自动保存状态，wait（有操作未保存）、ing（正在保存）、fail（保存失败）、success（保存成功）
    autoSaveStatus: 'success'
  },
  methods: {
    // 设置当前自动保存状态
    setAutoSaveStatus(data) {
      store.data.autoSaveStatus = data
      eventBus.emit('autoSaveStatusChange', data)
    },

    // 获取用户信息
    async getUserInfo() {
      if (store.data.userInfo) {
        return store.data.userInfo
      }
      const { data } = await api.getUserInfo()
      store.data.userInfo = data
      return data
    },

    // 获取用户配置
    async getUserConfig() {
      if (store.data.userConfig) {
        return store.data.userConfig
      }
      const { data } = await api.getUserConfig({
        configType: config.configType
      })
      store.data.userConfig = data ? JSON.parse(data) : {}
      return store.data.userConfig
    },

    // 更新用户配置
    async updateUserConfig(data) {
      const newConfig = {
        ...store.data.userConfig,
        ...data
      }
      await api.updateUserConfig({
        configType: config.configType,
        configContent: JSON.stringify(newConfig)
      })
      store.data.userConfig = newConfig
    },

    // 获取文件数据
    async getFileData(id) {
      const { data } = await api.getFileContent({
        id
      })
      if (data.content) {
        data.content = data.content ? JSON.parse(data.content) : null
      }
      store.data.fileData = data
      return data
    },

    // 更新文件数据
    async updateFileData(data) {
      try {
        store.methods.setAutoSaveStatus('ing')
        store.data.fileData = {
          ...store.data.fileData,
          ...data
        }
        await api.updateFile({
          id: store.data.fileData.id,
          ...data
        })
        store.methods.setAutoSaveStatus('success')
      } catch (error) {
        console.log(error)
        store.methods.setAutoSaveStatus('fail')
      }
    }
  }
}

export default store

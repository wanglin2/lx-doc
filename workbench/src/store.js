import { createPinia, defineStore } from 'pinia'
import api from './api'

export const pinia = createPinia()

export const useStore = defineStore('main', {
  state: () => {
    return {
      // 用户信息
      userInfo: null,
      // 用户配置
      userConfig: null,
      // 当前所在文件夹
      currentFolder: null,
      // 当前文件夹路径
      currentFolderPath: [],
      // 当前被拖拽的文件或文件夹
      currentDragData: null
    }
  },
  actions: {
    // 获取用户信息
    async getUserInfo() {
      if (this.userInfo) {
        return this.userInfo
      }
      const { data } = await api.getUserInfo()
      this.userInfo = data
      return data
    },

    // 获取用户配置
    async getUserConfig() {
      if (this.userConfig) {
        return this.userConfig
      }
      const { data } = await api.getUserConfig()
      this.userConfig = data
      return data
    },

    // 更新用户配置
    async updateUserConfig(data) {
      const newConfig = {
        ...this.userConfig,
        ...data
      }
      await api.updateUserConfig(newConfig)
      this.userConfig = newConfig
    },

    // 设置当前所在文件夹
    setCurrentFolder(data) {
      if (this.currentFolder && data && data.id === this.currentFolder.id)
        return
      this.currentFolder = data
    },

    // 设置当前所在文件夹路径
    setCurrentFolderPath(data) {
      this.currentFolderPath = data
    },

    // 设置当前被拖拽的数据
    setCurrentDragData(data) {
      this.currentDragData = data
    }
  }
})

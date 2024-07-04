import { createPinia, defineStore } from 'pinia'
import api from './api'
import config from '@/config';

export const pinia = createPinia()

export const useStore = defineStore('main', {
  state: () => {
    return {
      // 用户信息
      userInfo: null,
      // 用户配置
      userConfig: null,
      // 文件数据
      fileData: null,
      // 自动保存状态，wait（有操作未保存）、ing（正在保存）、fail（保存失败）、success（保存成功）
      autoSaveStatus: 'success'
    }
  },
  actions: {
    // 设置当前自动保存状态
    setAutoSaveStatus(data) {
      this.autoSaveStatus = data
    },

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
      const { data } = await api.getUserConfig({
        configType: config.configType
      })
      this.userConfig = data ? JSON.parse(data) : {}
      return this.userConfig
    },

    // 更新用户配置
    async updateUserConfig(data) {
      const newConfig = {
        ...this.userConfig,
        ...data
      }
      await api.updateUserConfig({
        configType: config.configType,
        configContent: JSON.stringify(newConfig)
      })
      this.userConfig = newConfig
    },

    // 获取文件数据
    async getFileData(id) {
      const { data } = await api.getFileContent({
        id
      })
      this.fileData = data
      return data
    },

    // 更新文件数据
    async updateFileData(data) {
      try {
        this.setAutoSaveStatus('ing')
        this.fileData = {
          ...this.fileData,
          ...data
        }
        await api.updateFile({
          id: this.fileData.id,
          ...data
        })
        this.setAutoSaveStatus('success')
      } catch (error) {
        console.log(error)
        this.setAutoSaveStatus('fail')
      }
    }
  }
})

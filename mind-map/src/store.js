import Vue from 'vue'
import Vuex from 'vuex'
import {
  storeLocalConfig,
  getUserInfo,
  getFileContent,
  updateFile
} from '@/api'
import exampleData from 'simple-mind-map/example/exampleData'
import { simpleDeepClone } from 'simple-mind-map/src/utils/index'
import { setPageTitle } from '@/utils'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // 用户信息
    userInfo: null,
    mindMapData: null, // 思维导图数据
    localConfig: {
      // 本地配置
      isZenMode: false, // 是否是禅模式
      // 是否开启节点富文本
      openNodeRichText: true,
      // 鼠标行为
      useLeftKeySelectionRightKeyDrag: false,
      // 是否显示滚动条
      isShowScrollbar: false,
      // 是否开启手绘风格
      isUseHandDrawnLikeStyle: false,
      // 是否是暗黑模式
      isDark: false
    },
    activeSidebar: '', // 当前显示的侧边栏
    isOutlineEdit: false, // 是否是大纲编辑模式
    isReadonly: false, // 是否只读
    isSourceCodeEdit: false, // 是否是源码编辑模式
    extraTextOnExport: '', // 导出时底部添加的文字
    autoSaveStatus: 'success' // 自动保存状态，wait（有操作未保存）、ing（正在保存）、fail（保存失败）、success（保存成功）
  },
  mutations: {
    // 设置用户信息
    setUserInfo(state, data) {
      state.userInfo = data
    },

    // 设置思维导图数据
    setMindMapData(state, data) {
      state.mindMapData = data
    },

    // 设置当前自动保存状态
    setAutoSaveStatus(state, data) {
      state.autoSaveStatus = data
    },

    // 设置本地配置
    setLocalConfig(state, data) {
      state.localConfig = {
        ...state.localConfig,
        ...data
      }
      storeLocalConfig(state.localConfig)
    },

    // 设置当前显示的侧边栏
    setActiveSidebar(state, data) {
      state.activeSidebar = data
    },

    // 设置大纲编辑模式
    setIsOutlineEdit(state, data) {
      state.isOutlineEdit = data
    },

    // 设置是否只读
    setIsReadonly(state, data) {
      state.isReadonly = data
    },

    // 设置源码编辑模式
    setIsSourceCodeEdit(state, data) {
      state.isSourceCodeEdit = data
    },

    // 设置导出时底部添加的文字
    setExtraTextOnExport(state, data) {
      state.extraTextOnExport = data
    }
  },
  actions: {
    // 获取用户信息
    async getUserInfo(ctx) {
      if (ctx.state.userInfo) {
        return ctx.state.userInfo
      }
      const { data } = await getUserInfo()
      ctx.commit('setUserInfo', data.data)
      return data
    },

    // 获取思维导图数据
    async getUserMindMapData(ctx, id) {
      const { data } = await getFileContent({
        id
      })
      setPageTitle(data.name)
      if (data.content) {
        data.content = JSON.parse(data.content)
      } else {
        data.content = simpleDeepClone(exampleData)
      }
      ctx.commit('setMindMapData', data)
      return data
    },

    // 保存思维导图数据
    async storeData(ctx, data) {
      try {
        ctx.commit('setAutoSaveStatus', 'ing')
        ctx.state.mindMapData.content.root = data //copyMindMapTreeData({}, data)
        await updateFile({
          id: ctx.state.mindMapData.id,
          content: JSON.stringify(ctx.state.mindMapData.content)
        })
        ctx.commit('setAutoSaveStatus', 'success')
      } catch (error) {
        console.log(error)
        ctx.commit('setAutoSaveStatus', 'fail')
      }
    },

    // 保存思维导图配置数据
    async storeConfig(ctx, config) {
      try {
        ctx.commit('setAutoSaveStatus', 'ing')
        ctx.state.mindMapData.content = {
          ...ctx.state.mindMapData.content,
          ...config
        }
        await updateFile({
          id: ctx.state.mindMapData.id,
          content: JSON.stringify(ctx.state.mindMapData.content)
        })
        ctx.commit('setAutoSaveStatus', 'success')
      } catch (error) {
        console.log(error)
        ctx.commit('setAutoSaveStatus', 'fail')
      }
    },

    // 更新文件数据
    async storeFileInfo(ctx, data) {
      try {
        ctx.commit('setAutoSaveStatus', 'ing')
        ctx.state.mindMapData = {
          ...ctx.state.mindMapData,
          ...data
        }
        await updateFile({
          id: ctx.state.mindMapData.id,
          ...data
        })
        if (data.name) {
          setPageTitle(data.name)
        }
        ctx.commit('setAutoSaveStatus', 'success')
      } catch (error) {
        console.log(error)
        ctx.commit('setAutoSaveStatus', 'fail')
      }
    }
  }
})

export default store

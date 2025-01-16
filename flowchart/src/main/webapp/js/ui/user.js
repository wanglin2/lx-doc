;(function () {
  // 初始化应用
  const initChart = () => {
    if (
      urlParams['dev'] != '1' &&
      typeof document.createElement('canvas').getContext === 'function'
    ) {
      mxWinLoaded = true
      checkAllLoaded()
    } else {
      App.main(app => {
        window.editorApp = app
      })
    }
  }

  // vue
  const vueApp = {
    data() {
      return {
        showHeader: false,
        showMask: true,
        Back: Vue.markRaw(ElementPlusIconsVue.Back),
        id: '',
        fileName: '',
        userInfo: null,
        fileData: null,
        // 自动保存状态，wait（有操作未保存）、ing（正在保存）、fail（保存失败）、success（保存成功）
        autoSaveStatus: 'success',
        autoSaveTimer: null
      }
    },
    computed: {
      saveTipIconIsLoading() {
        return this.autoSaveStatus === 'wait'
      },
      saveTip() {
        switch (this.autoSaveStatus) {
          case 'wait':
            return '有操作尚未保存'
          case 'ing':
            return '正在保存...'
          case 'fail':
            return '保存失败'
          case 'success':
            return '保存成功'
          default:
            return ''
        }
      },
      saveTipIcon() {
        switch (this.autoSaveStatus) {
          case 'wait':
            return ElementPlusIconsVue.WarningFilled
          case 'ing':
            return ElementPlusIconsVue.Loading
          case 'fail':
            return ElementPlusIconsVue.CircleCloseFilled
          case 'success':
            return ElementPlusIconsVue.CircleCheckFilled
          default:
            return ''
        }
      }
    },
    created() {
      const res = /^\/flowchart\/([^/]+)/.exec(location.pathname)
      let id = ''
      if (res && res[1]) {
        id = res[1]
      } else if (urlParams['id']) {
        id = urlParams['id']
      }
      if (!id) {
        ElementPlus.ElMessage.warning('参数有误')
        return
      }
      this.id = id
      this.getUserInfo()
    },
    mounted() {
      this.showMask = false
    },
    methods: {
      async back() {
        if (window.top !== window.self && window.parent) {
          // 如果是 iframe 中运行，通知上层 window 后退
          if (this.autoSaveStatus !== 'success') {
            const answer = window.confirm('系统可能不会保存您所做的更改。')
            if (!answer) return false
          }
          try {
            window.parent.history.back()
          } catch (e) {
            window.parent.postMessage('history-back', '*')
          }
        } else {
          // 如果是新窗口打开，跳到工作台标签页并且关闭当前标签页
          const href = process.env.NODE_ENV === 'production' ? '/' : 'http://' + location.hostname + ':9090'
          const workspaceWindow = window.open(href, 'lx-doc')
          if (window !== workspaceWindow) {
            window.close()
          }
        }
      },
      // 设置当前自动保存状态
      setAutoSaveStatus(data) {
        this.autoSaveStatus = data
      },
      // 设置页面标题
      setPageTitle(title) {
        title = title || '流程图'
        document.title = title + '_理想文档'
      },
      // 获取用户信息
      async getUserInfo() {
        try {
          const { data } = await window.api.getUserInfo()
          this.userInfo = data
          this.getUserFileData()
          this.showHeader = true
        } catch (error) {
          console.log(error)
          ElementPlus.ElMessage.warning('获取登录信息失败')
          location.href = '/login'
        }
      },
      // 获取文件内容
      async getUserFileData() {
        try {
          const { data } = await window.api.getFileContent({
            id: this.id
          })
          this.fileData = data
          this.fileName = this.fileData.name
          this.setPageTitle(this.fileName)
          initChart()
        } catch (error) {
          console.log(error)
          ElementPlus.ElMessage.warning('获取文件信息失败')
        }
      },
      // 更新文件数据
      async updateFileData(data) {
        try {
          this.setAutoSaveStatus('ing')
          this.fileData = {
            ...this.fileData,
            ...data
          }
          await window.api.updateFile({
            id: this.fileData.id,
            ...data
          })
          if (data.name) {
            this.setPageTitle(data.name)
          }
          const file = window.editorApp.getCurrentFile()
          file.setModified(false)
          this.setAutoSaveStatus('success')
        } catch (error) {
          console.log(error)
          this.setAutoSaveStatus('fail')
        }
      },
      save() {
        const fileContent = window.editorApp.getFileData()
        this.updateFileData({
          content: fileContent
        })
      },
      autoSave() {
        this.setAutoSaveStatus('wait')
        clearTimeout(this.autoSaveTimer)
        this.autoSaveTimer = setTimeout(() => {
          this.save()
        }, 3000)
      },
      // 更新文件名
      async onFileNameBlur() {
        if (!this.fileName.trim()) {
          ElementPlus.ElMessage.warning('名称不能为空')
          return
        }
        await this.updateFileData({
          name: this.fileName.trim()
        })
        const file = window.editorApp.getCurrentFile()
        file.rename(this.fileName.trim())
      },
      // 更新封面
      async saveCover() {
        window.editorApp.editor.exportToCanvas(
          async canvas => {
            const imgData = canvas.toDataURL('image/png')
            const res = await window.api.uploadImg({
              imgData
            })
            await this.updateFileData({
              img: res.data
            })
            ElementPlus.ElMessage.success('封面生成成功')
          },
          null,
          null,
          null,
          e => {
            console.log(e)
          }
        )
      }
    }
  }
  const app = Vue.createApp(vueApp)
  app.use(ElementPlus)
  for (var obj of Object.entries(ElementPlusIconsVue)) {
    app.component(obj[0], obj[1])
  }
  window.VueVm = app.mount('#header')
})()

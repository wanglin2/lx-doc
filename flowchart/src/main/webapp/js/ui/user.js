;(function () {
  let editorApp = null

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
        editorApp = app
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
        id: urlParams['id'],
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
      if (!this.id) {
        ElementPlus.ElMessage.warning('参数有误')
        return
      }
      this.getUserInfo()
    },
    mounted() {
      this.showMask = false
    },
    methods: {
      back() {
        location.href = '/'
      },
      // 设置当前自动保存状态
      setAutoSaveStatus(data) {
        this.autoSaveStatus = data
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
          const file = editorApp.getCurrentFile()
          file.setModified(false)
          this.setAutoSaveStatus('success')
        } catch (error) {
          console.log(error)
          this.setAutoSaveStatus('fail')
        }
      },
      save() {
        const fileContent = editorApp.getFileData()
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
        const file = editorApp.getCurrentFile()
        file.rename(this.fileName.trim())
      },
      // 更新封面
      async saveCover() {
        editorApp.editor.exportToCanvas(
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

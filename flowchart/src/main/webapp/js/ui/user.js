const upload = {
  // base64转blob
  dataURLtoBlob(dataurl) {
    let arr = dataurl.split(',')
    //注意base64的最后面中括号和引号是不转译的
    let _arr = arr[1].substring(0, arr[1].length - 2)
    let mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(_arr),
      n = bstr.length,
      u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], {
      type: mime
    })
  },

  /**
   *  上传图片
   *
   * @param {*} file
   * @param {*} config
   * @returns
   */
  uploadImg(file, isDataURL = true) {
    return new Promise((resolve, reject) => {
      let blob = isDataURL ? this.dataURLtoBlob(file) : file
      oss.uploadFile(
        blob,
        () => {},
        async ev => {
          if (ev && ev.length > 0) {
            resolve(imgUrl)
          }
        },
        ev => {
          if (ev.length > 0) {
            reject('图片上传失败，请重试')
          }
        }
      )
    })
  }
}

const downloadFile = (file, fileName) => {
  let a = document.createElement('a')
  a.href = file
  a.download = fileName
  a.click()
}

const svgToPng = svgSrc => {
  return new Promise((resolve, reject) => {
    const exportPadding = 10
    const img = new Image()
    // 跨域图片需要添加这个属性，否则画布被污染了无法导出图片
    img.setAttribute('crossOrigin', 'anonymous')
    img.onload = async () => {
      try {
        let canvas = document.createElement('canvas')
        canvas.width = img.width + exportPadding * 2
        canvas.height = img.height + exportPadding * 2
        let ctx = canvas.getContext('2d')
        // 绘制背景
        // await this.drawBackgroundToCanvas(ctx, canvas.width, canvas.height)
        // 图片绘制到canvas里
        ctx.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          exportPadding,
          exportPadding,
          img.width,
          img.height
        )
        resolve(canvas.toDataURL())
      } catch (error) {
        reject(error)
      }
    }
    img.onerror = e => {
      reject(e)
    }
    img.src = svgSrc
  })
}

const imgToDataUrl = src => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    // 跨域图片需要添加这个属性，否则画布被污染了无法导出图片
    img.setAttribute('crossOrigin', 'anonymous')
    img.onload = () => {
      try {
        let canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        let ctx = canvas.getContext('2d')
        // 图片绘制到canvas里
        ctx.drawImage(img, 0, 0, img.width, img.height)
        resolve(canvas.toDataURL())
      } catch (error) {
        reject(e)
      }
    }
    img.onerror = e => {
      reject(e)
    }
    img.src = src
  })
}

const exportSvgToPng = async (str, name, down = true) => {
  // 把图片的url转换成data:url类型，否则导出会丢失图片
  let el = document.createElement('div')
  el.innerHTML = str
  let imageList = el.querySelectorAll('image')
  let task = Array.from(imageList).map(async item => {
    let imgUlr = item.getAttribute('href') || item.getAttribute('xlink:href')
    let imgData = await imgToDataUrl(imgUlr)
    item.setAttribute('href', imgData)
  })
  await Promise.all(task)
  str = el.innerHTML
  // 转换成blob数据
  let blob = new Blob([str], {
    type: 'image/svg+xml'
  })
  // 转换成data:url数据
  let svgUrl = URL.createObjectURL(blob)
  // 绘制到canvas上
  let imgDataUrl = await svgToPng(svgUrl)
  URL.revokeObjectURL(svgUrl)
  if (down) {
    downloadFile(imgDataUrl, name)
  } else {
    return imgDataUrl
  }
}

;(function () {
  let editorUi = null

  // 保存到数据库
  let saveTimer = null
  const saveToUserFile = dataStr => {
    clearTimeout(saveTimer)
    saveTimer = setTimeout(async () => {
      try {
        let data = await window.api.updateFile({
          id: vm.userFileData.id,
          content: dataStr
        })
        if (data.code === 0) {
          vm.onSaveStatusChange(true)
        } else {
          vm.onSaveStatusChange(false)
        }
      } catch (error) {
        console.log(error)
      }
    }, 500)
  }

  // 初始化应用
  const initChart = () => {
    if (
      urlParams['dev'] != '1' &&
      typeof document.createElement('canvas').getContext === 'function'
    ) {
      window.addEventListener('load', function () {
        mxWinLoaded = true
        checkAllLoaded()
      })
    } else {
      App.main()
    }
  }
  console.log(Vue)

  // vue
  var App = {
    data() {
      return {
        showMask: true,
        Back: Vue.markRaw(ElementPlusIconsVue.Back),
        fileName: '',
        successStatus: false,
        showStatus: false,
        userInfo: null,
        userFileData: null
      }
    },
    created() {
      if (!this.getUid()) {
        ElementPlus.ElMessage.warning('参数有误')
        return
      }
      this.getUserInfo()
    },
    mounted() {
      this.showMask = false
    },
    methods: {
      getUserInfo() {
        window.api
          .getUserInfo()
          .then(data => {
            if (data.code === 0) {
              this.userInfo = data.data
              this.getUserFileData()
            }
          })
          .catch(() => {
            ElementPlus.ElMessage.warning('获取登录信息失败')
          })
      },
      getUserFileData() {
        window.api
          .getFileContent({
            id: this.getUid()
          })
          .then(data => {
            if (data.code === 0) {
              this.userFileData = data.data
              this.fileName = this.userFileData.name
            } else {
              ElementPlus.ElMessage.warning('获取文件信息失败')
            }
          })
          .catch(() => {
            ElementPlus.ElMessage.warning('获取文件信息失败')
          })
      },
      setUserFileData(data) {
        this.userFileData = data
      },
      getUid() {
        return urlParams['id']
      },
      back() {
        location.href = '/'
      },
      async onFileNameBlur() {
        if (!this.fileName.trim()) {
          ElementPlus.ElMessage.warning('名称不能为空')
          return
        }
        try {
          let data = await window.api.updateFile({
            id: this.userFileData.id,
            name: this.fileName
          })
          if (data.code === 0) {
            this.onSaveStatusChange(true)
          } else {
            this.onSaveStatusChange(false)
            ElementPlus.ElMessage.error(data.msg)
          }
        } catch (error) {
          this.onSaveStatusChange(false)
          ElementPlus.ElMessage.error('保存失败')
        }
      },
      onSaveStatusChange(status) {
        this.showStatus = false
        Vue.nextTick(() => {
          this.successStatus = status
          this.showStatus = true
        })
      },
      async saveCover() {
        let imgData = await exportSvgToPng(
          mxUtils.getXml(editorUi.editor.graph.getSvg(null, 1, 0)),
          '',
          false
        )
        let res = await window.api.uploadImg(imgData)
        let data = await window.api.updateFile({
          id: this.userFileData.id,
          img: res.data
        })
        if (data.code === 0) {
          ElementPlus.ElMessage.success('封面生成并保存成功')
        } else {
          ElementPlus.ElMessage.error(data.msg)
        }
      }
    }
  }
  var app = Vue.createApp(App)
  app.use(ElementPlus)
  for (var obj of Object.entries(ElementPlusIconsVue)) {
    app.component(obj[0], obj[1])
  }
  var vm = app.mount('#header')
})()

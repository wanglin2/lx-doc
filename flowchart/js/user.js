// Extends EditorUi to update I/O action states based on availability of backend
const oss = new window.OSS_APP({
    accessKeyId: '',
    accessKeySecret: '',
    type: 'BOW',
    region: '',
    bucket: '',
    dir: 'board',
    randomName: true
});

const handleAliyunUrl = (url) => {
    return `` + url;
}

const upload = {
    // base64转blob
    dataURLtoBlob(dataurl) {
        let arr = dataurl.split(',');
        //注意base64的最后面中括号和引号是不转译的   
        let _arr = arr[1].substring(0, arr[1].length - 2);
        let mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(_arr),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {
            type: mime
        });
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
                () => { },
                async (ev) => {
                    if (ev && ev.length > 0) {
                        let imgUrl = handleAliyunUrl(ev[0].name);
                        resolve(imgUrl)
                    }
                },
                (ev) => {
                    if (ev.length > 0) {
                        reject("图片上传失败，请重试");
                    }
                }
            );
        });
    },
}

const downloadFile = (file, fileName) => {
    let a = document.createElement('a')
    a.href = file
    a.download = fileName
    a.click()
}

const svgToPng = (svgSrc) => {
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
                ctx.drawImage(img, 0, 0, img.width, img.height, exportPadding, exportPadding, img.width, img.height)
                resolve(canvas.toDataURL())
            } catch (error) {
                reject(error)
            }
        }
        img.onerror = (e) => {
            reject(e)
        }
        img.src = svgSrc
    })
}

const imgToDataUrl = (src) => {
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
        img.onerror = (e) => {
            reject(e)
        }
        img.src = src
    });
}

const exportSvgToPng = async (str, name, down = true) => {
    // 把图片的url转换成data:url类型，否则导出会丢失图片
    let el = document.createElement('div')
    el.innerHTML = str
    let imageList = el.querySelectorAll('image')
    let task = Array.from(imageList).map(async (item) => {
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
    const isDev = true
    axios.defaults.baseURL = isDev ? `http://lxqnsys.com/board/api/dev` : '../board/api/v1';
    var editorUi = null
    // 获取用户信息
    const getUserInfo = () => {
        return axios.get(`/getUserInfo.php`);
    }

    // 获取文件数据
    const getFileData = (params) => {
        return axios.get(`/get.php`, {
            params
        });
    }

    // 保存文件数据
    const saveFileData = (data = {}) => {
        let formData = new FormData()
        let _data = Object.assign({}, vm.userFileData, data)
        Object.keys(_data).forEach((prop) => {
            formData.append(prop, _data[prop])
        })
        vm.setUserFileData(_data)
        return axios.post('/update.php', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
    }

    // 保存到数据库
    let saveTimer = null
    const saveToUserFile = (dataStr) => {
        clearTimeout(saveTimer)
        saveTimer = setTimeout(async () => {
            try {
                let {
                    data
                } = await saveFileData({
                    data: dataStr
                })
                if (data.code === 0) {
                    vm.onSaveStatusChange(true)
                } else {
                    vm.onSaveStatusChange(false)
                }
            } catch (error) {
                console.log(error)
            }
        }, 500);
    }

    // vue
    var timer = null
    var App = {
        data() {
            return {
                Back: ElementPlusIconsVue.Back,
                fileName: '',
                successStatus: false,
                showStatus: false,
                userInfo: null,
                userFileData: null
            };
        },
        watch: {
            fileName(val, oldVal) {
                if (oldVal) {
                    this.updateName()
                }
            }
        },
        created() {
            if (!this.getUid()) {
                ElementPlus.ElMessage.warning('参数有误')
                return;
            }
            this.getUserInfo()
        },
        methods: {
            getUserInfo() {
                getUserInfo()
                    .then((res) => {
                        if (res.data.code === 0) {
                            this.userInfo = res.data.data
                            this.getUserFileData()
                        }
                    })
                    .catch(() => {
                        ElementPlus.ElMessage.warning('获取登录信息失败')
                    })
            },
            getUserFileData() {
                getFileData({
                    uid: this.getUid()
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.userFileData = res.data.data
                        this.fileName = this.userFileData.name
                        initGraph(this.userFileData.data)
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
                let search = location.search
                if (!search) {
                    return ''
                }
                let uid = ''
                search = search.slice(1)
                const searchArr = search.split('&')
                searchArr.forEach((searchItem) => {
                    const searchItemArr = searchItem.split('=')
                    if (searchItemArr[0] === 'uid') {
                        uid = searchItemArr[1]
                    }
                })
                return uid
            },
            back() {
                history.go(-1)
            },
            onSaveStatusChange(status) {
                this.showStatus = false
                Vue.nextTick(() => {
                    this.successStatus = status
                    this.showStatus = true
                })
            },
            updateName() {
                if (!this.fileName.trim()) {
                    ElementPlus.ElMessage.warning('名称不能为空')
                    return
                }
                clearTimeout(timer)
                timer = setTimeout(async () => {
                    try {
                        let {
                            data
                        } = await saveFileData({
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
                }, 500);
            },
            async saveCover() {
                let imgData = await exportSvgToPng(mxUtils.getXml(editorUi.editor.graph.getSvg(null,1,0)), '', false)
                let url = await upload.uploadImg(imgData)
                let {
                    data
                } = await saveFileData({
                    cover: url
                })
                if (data.code === 0) {
                    ElementPlus.ElMessage.success('封面生成并保存成功')
                } else {
                    ElementPlus.ElMessage.error(data.msg)
                }
            }
        }
    };
    var app = Vue.createApp(App);
    app.use(ElementPlus);
    for (var obj of Object.entries(ElementPlusIconsVue)) {
        app.component(obj[0], obj[1])
    }
    var vm = app.mount("#header");

    var initGraph = (initData) => {
        // 图表
        var editorUiInit = EditorUi.prototype.init;

        EditorUi.prototype.init = function () {
            editorUiInit.apply(this, arguments);
            this.actions.get('export').setEnabled(false);

            // Updates action states which require a backend
            if (!Editor.useLocalStorage) {
                mxUtils.post(OPEN_URL, '', mxUtils.bind(this, function (req) {
                    var enabled = req.getStatus() != 404;
                    this.actions.get('open').setEnabled(true);
                    this.actions.get('import').setEnabled(true);
                    this.actions.get('save').setEnabled(true);
                    this.actions.get('saveAs').setEnabled(true);
                    this.actions.get('export').setEnabled(true);
                }));
            }
        };

        // Adds required resources (disables loading of fallback properties, this can only
        // be used if we know that all keys are defined in the language specific file)
        mxResources.loadDefaultBundle = false;
        var bundle = mxResources.getDefaultBundle(RESOURCE_BASE, mxLanguage) ||
            mxResources.getSpecialBundle(RESOURCE_BASE, mxLanguage);

        // Fixes possible asynchronous requests
        mxUtils.getAll([bundle, STYLE_PATH + '/default.xml'], function (xhr) {
            // Adds bundle text to resources
            mxResources.parse(xhr[0].getText());

            // Configures the default graph theme
            var themes = new Object();
            themes[Graph.prototype.defaultThemeName] = xhr[1].getDocumentElement();
            // Main
            editorUi = new EditorUi(new Editor(urlParams['chrome'] == '0', themes), document
                .getElementById('app'));
            // 监听变化事件
            editorUi.editor.graph.model.addListener(mxEvent.CHANGE, function (sender, evt) {
                var encoder = new mxCodec();
                var result = encoder.encode(editorUi.editor.graph.getModel());
                var xml = mxUtils.getXml(result);
                saveToUserFile(xml)
            });
            // 回显数据
            var doc = mxUtils.parseXml(initData);
            var codec = new mxCodec(doc);
            codec.decode(doc.documentElement, editorUi.editor.graph.getModel());
        }, function () {
            document.body.innerHTML =
                '<center style="margin-top:10%;">Error loading resource files. Please check browser console.</center>';
        });
    }
})();
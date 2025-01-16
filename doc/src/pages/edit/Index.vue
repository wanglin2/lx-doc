<template>
  <div class="editContainer">
    <div class="header">
      <div class="left">
        <div class="backBtn" @click="onBack">
          <el-icon><ArrowLeft /></el-icon>
        </div>
      </div>
      <div class="center"></div>
      <div class="right">
        <div class="saveBox">
          <span class="saveTip">
            <el-icon
              :class="[saveTipIconIsLoading ? 'is-loading' : '']"
              color="#333"
              ><component :is="saveTipIcon"></component
            ></el-icon>
            <span class="text">{{ saveTip }}</span>
          </span>
          <el-button @click="save">保存</el-button>
          <el-button @click="print">打印</el-button>
          <el-dropdown @command="handleExportCommand" style="margin-left: 12px">
            <el-button>
              导出为<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="pdf">pdf</el-dropdown-item>
                <el-dropdown-item command="html">html</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div class="editorBox">
      <div class="toolbarBox">
        <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" />
      </div>
      <div class="editorWrap">
        <div class="editorContent" ref="editorContentRef">
          <div
            class="titleContainer"
            :contenteditable="true"
            @blur="onFileNameBlur"
            @input="onTitleInputChange"
            @paste="onTitleInputPaste"
          >
            {{ fileName }}
          </div>
          <div class="editorContainer" @click="onEditorContainerClick">
            <Editor
              v-model="content"
              :defaultConfig="editorConfig"
              @onCreated="handleEditorCreated"
              @onChange="handleEditorChange"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from '../../store'
import { useRoute, useRouter } from 'vue-router'
import { computed, ref, watch, shallowRef, onBeforeUnmount } from 'vue'
import { ElMessageBox } from 'element-plus'
import {
  ArrowLeft,
  CircleCloseFilled,
  CircleCheckFilled,
  WarningFilled,
  Loading,
  ArrowDown
} from '@element-plus/icons-vue'
import api from '@/api'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import html2pdf from 'html2pdf.js'
import { downloadFile } from '@/utils'

const store = useStore()
const route = useRoute()
const router = useRouter()

const onBack = async () => {
  if (window.top !== window.self && window.parent) {
    // 如果是 iframe 中运行，通知上层 window 后退
    if (store.autoSaveStatus !== 'success') {
      await ElMessageBox.confirm(`系统可能不会保存您所做的更改。`, '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
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
}

// 文件名
const fileName = ref('')
const onTitleInputChange = e => {
  fileName.value = e.target.textContent
}
const onTitleInputPaste = e => {
  e.preventDefault()
  const paste = (e.clipboardData || window.clipboardData).getData('text')
  const selection = window.getSelection()
  if (!selection.rangeCount) return
  selection.deleteFromDocument()
  selection.getRangeAt(0).insertNode(document.createTextNode(paste))
  selection.collapseToEnd()
  onTitleInputChange(e)
}
const onFileNameBlur = () => {
  const text = fileName.value.trim()
  if (text) {
    store.updateFileData({
      name: text
    })
  }
}
watch(
  () => {
    return store.fileData
  },
  val => {
    if (val && val.name) {
      fileName.value = val.name
    }
  },
  {
    deep: true,
    immediate: true
  }
)

// 保存
const autoSaveTimer = ref(null)
const saveTipIcon = computed(() => {
  switch (store.autoSaveStatus) {
    case 'wait':
      return WarningFilled
    case 'ing':
      return Loading
    case 'fail':
      return CircleCloseFilled
    case 'success':
      return CircleCheckFilled
    default:
      return ''
  }
})
const saveTipIconIsLoading = computed(() => {
  return store.autoSaveStatus === 'ing'
})
const saveTip = computed(() => {
  switch (store.autoSaveStatus) {
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
})
const save = () => {
  store.updateFileData({
    content: content.value
  })
}
const handleEditorChange = () => {
  store.setAutoSaveStatus('wait')
  clearTimeout(autoSaveTimer.value)
  autoSaveTimer.value = setTimeout(() => {
    save()
  }, 3000)
}

// 编辑器
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef(null)
// 内容 HTML
const content = ref('')
const toolbarConfig = {}
const editorConfig = {
  placeholder: '请输入内容...',
  scroll: false, // 禁止编辑器滚动
  MENU_CONF: {
    uploadImage: {
      async customUpload(file, insertFn) {
        try {
          const formData = new FormData()
          formData.append('file', file)
          const { data } = await api.uploadFiles(formData)
          insertFn(data[0], file.name || '')
        } catch (error) {
          console.log(error)
        }
      }
    },
    uploadVideo: {
      async customUpload(file, insertFn) {
        try {
          const formData = new FormData()
          formData.append('file', file)
          const { data } = await api.uploadFiles(formData)
          insertFn(data[0])
        } catch (error) {
          console.log(error)
        }
      }
    }
  }
}
// 点击空白处 focus 编辑器
const onEditorContainerClick = e => {
  if (e.target.classList.contains('editorContainer')) {
    editorRef.value.blur()
    editorRef.value.focus(true) // focus 到末尾
  }
}
const handleEditorCreated = editor => {
  editorRef.value = editor
}
const getFileData = async () => {
  try {
    const res = await store.getFileData(route.params.id)
    content.value = res.content || ''
  } catch (error) {
    console.log(error)
  }
}
getFileData()

// 导出
const editorContentRef = ref(null)
const handleExportCommand = command => {
  switch (command) {
    case 'pdf':
      exportToPdf()
      break
    case 'html':
      exportToHtml()
      break
    default:
      break
  }
}
const exportToPdf = () => {
  html2pdf()
    .set({
      margin: 20,
      filename: `${fileName.value}.pdf`,
      html2canvas: { scale: 2, useCORS: true },
      pagebreak: { mode: 'avoid-all' }
    })
    .from(editorContentRef.value)
    .save()
    .catch(error => {
      console.error(error)
    })
}
const exportToHtml = () => {
  const blob = new Blob([editorContentRef.value.outerHTML], {
    type: 'text/html'
  })
  downloadFile(blob, fileName.value)
}
const print = () => {
  window.print()
}

window.onbeforeunload = function () {
  if (store.autoSaveStatus !== 'success') {
    return '存在未保存的数据'
  }
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
</script>

<style lang="less" scoped>
.editContainer {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;

  .header {
    width: 100%;
    height: 50px;
    overflow: hidden;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
    border-bottom: 1px solid #e8e8e8;

    .left {
      flex: 1;

      .backBtn {
        width: 30px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 30px;
        cursor: pointer;
        border-radius: 5px;
        margin-right: 8px;

        &:hover {
          background-color: #f5f5f5;
        }
      }
    }

    .center {
      flex: 1;
      display: flex;
      justify-content: center;

      .fileNameInput {
        width: 300px;
      }
    }

    .right {
      flex: 1;
      display: flex;
      align-items: center;
      margin-top: 5px;
      justify-content: flex-end;

      .saveBox {
        display: flex;
        align-items: center;

        .saveTip {
          display: flex;
          align-items: center;
          margin-right: 4px;
          color: #333;

          .text {
            margin-left: 4px;
            font-size: 12px;
          }
        }
      }
    }
  }

  .editorBox {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background-color: rgb(245, 245, 245);

    .toolbarBox {
      width: 100%;
      flex-shrink: 0;
      display: flex;
      justify-content: center;
      border-bottom: 1px solid #e8e8e8;
      background-color: #fff;
    }

    .editorWrap {
      height: 100%;
      width: 100%;
      overflow-y: auto;
      padding: 20px 0;

      .editorContent {
        margin: 0 auto;
        width: 850px;
        background-color: #fff;
        padding: 20px 50px 50px 50px;
        border: 1px solid #e8e8e8;
        box-shadow: 0 2px 10px rgb(0 0 0 / 12%);

        .titleContainer {
          padding: 20px 0;
          border-bottom: 1px solid #e8e8e8;
          font-size: 30px;
          outline: none;
          width: 100%;
          text-align: center;
        }

        .editorContainer {
          min-height: 900px;
        }
      }
    }
  }
}
</style>
<style lang="less">
@media print {
  html {
    overflow: auto !important;
    height: auto !important;
  }
  body {
    overflow: auto !important;
    height: auto !important;
  }
  #app {
    height: auto !important;
    overflow: auto !important;
  }
  .header {
    display: none !important;
  }
  .toolbarBox {
    display: none !important;
  }
  .editContainer {
    height: auto !important;
  }
  .editorContainer {
    min-height: auto !important;
  }
  .editorContent {
    width: 100% !important;
    border: none !important;
    box-shadow: none !important;
  }
  .editorWrap {
    padding: 0 !important;
    height: auto !important;
  }
  .editorBox {
    height: auto !important;
  }
}
</style>

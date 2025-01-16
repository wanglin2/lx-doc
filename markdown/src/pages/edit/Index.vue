<template>
  <div class="editContainer">
    <div class="header">
      <div class="left">
        <div class="backBtn" @click="onBack">
          <el-icon><ArrowLeft /></el-icon>
        </div>
      </div>
      <div class="center">
        <el-input
          class="fileNameInput"
          v-model="fileName"
          placeholder="请输入文件名"
          input-style="text-align: center"
          @blur="onFileNameBlur"
        ></el-input>
      </div>
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
          <el-button @click="copyHtml">复制HTML</el-button>
          <el-tooltip content="预览主题" placement="bottom">
            <el-select
              v-model="currentPreviewTheme"
              placeholder="Select"
              style="width: 100px; margin-left: 12px"
              @change="onPreviewThemeChange"
            >
              <el-option
                v-for="item in previewThemeList"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-tooltip>
          <el-tooltip content="代码主题" placement="bottom">
            <el-select
              v-model="currentCodeTheme"
              placeholder="Select"
              style="width: 100px; margin-left: 12px"
              @change="onCodeThemeChange"
            >
              <el-option
                v-for="item in codeThemeList"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-tooltip>
        </div>
      </div>
    </div>
    <div class="editorBox">
      <MdEditor
        v-model="content"
        :previewTheme="currentPreviewTheme"
        :codeTheme="currentCodeTheme"
        :toolbars="toolbars"
        @onSave="save"
        @onUploadImg="onUploadImg"
        @onChange="onChange"
      >
        <template #defToolbars>
          <Emoji></Emoji>
          <ExportPDF :modelValue="content" />
        </template>
      </MdEditor>
    </div>
  </div>
</template>

<script setup>
import { useStore } from '../../store'
import { useRoute, useRouter } from 'vue-router'
import { computed, ref, watch } from 'vue'
import { MdEditor, config } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import {
  ArrowLeft,
  CircleCloseFilled,
  CircleCheckFilled,
  WarningFilled,
  Loading
} from '@element-plus/icons-vue'
import api from '@/api'
import { codeCss } from '@/config/md'
import { Emoji } from '@vavt/v3-extension'
import '@vavt/v3-extension/lib/asset/Emoji.css'
import { ExportPDF } from '@vavt/v3-extension'
import '@vavt/v3-extension/lib/asset/ExportPDF.css'
import { ElMessage, ElMessageBox } from 'element-plus'
import screenfull from 'screenfull'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import mermaid from 'mermaid'
import highlight from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'
import * as prettier from 'prettier'
import parserMarkdown from 'prettier/plugins/markdown'
import '@/assets/iconfont/iconfont.js'

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

config({
  editorExtensions: {
    prettier: {
      prettierInstance: prettier,
      parserMarkdownInstance: parserMarkdown
    },
    highlight: {
      instance: highlight,
      css: codeCss
    },
    screenfull: {
      instance: screenfull
    },
    katex: {
      instance: katex
    },
    cropper: {
      instance: Cropper
    },
    mermaid: {
      js: '',
      instance: mermaid
    },
    iconfont: ''
  }
})

const toolbars = [
  'bold',
  'underline',
  'italic',
  '-',
  'title',
  'strikeThrough',
  'sub',
  'sup',
  'quote',
  'unorderedList',
  'orderedList',
  'task',
  '-',
  'codeRow',
  'code',
  'link',
  'image',
  'table',
  'mermaid',
  'katex',
  0,
  '-',
  'revoke',
  'next',
  '-',

  1,
  '=',
  'pageFullscreen',
  'fullscreen',
  'preview',
  'previewOnly',
  'htmlPreview',
  'catalog'
]

// 文件名
const fileName = ref('')
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
const onChange = () => {
  store.setAutoSaveStatus('wait')
  clearTimeout(autoSaveTimer.value)
  autoSaveTimer.value = setTimeout(() => {
    save()
  }, 3000)
}

// 图片上传
const onUploadImg = async (files, callback) => {
  try {
    const formData = new FormData()
    files.forEach(item => {
      formData.append('file', item)
    })
    const { data } = await api.uploadFiles(formData)
    callback(data)
  } catch (error) {
    console.log(error)
    callback('图片上传失败')
  }
}

// 预览主题
const previewThemeList = ref([
  'default',
  'github',
  'vuepress',
  'mk-cute',
  'smart-blue',
  'cyanosis'
])
const currentPreviewTheme = ref(store.userConfig.previewTheme || 'default')
const onPreviewThemeChange = val => {
  store.updateUserConfig({
    previewTheme: val
  })
}

// 代码主题
const codeThemeList = ref([
  'atom',
  'a11y',
  'github',
  'gradient',
  'kimbie',
  'paraiso',
  'qtcreator',
  'stackoverflow'
])
const currentCodeTheme = ref(store.userConfig.previewTheme || 'atom')
const onCodeThemeChange = val => {
  store.updateUserConfig({
    codeTheme: val
  })
}

// 复制html
const copyHtml = () => {
  const range = document.createRange()
  range.selectNodeContents(document.querySelector('#md-editor-v3_1-preview'))
  const selection = window.getSelection()
  selection.removeAllRanges()
  selection.addRange(range)
  ElMessage.info('请按Ctrl+C进行复制')
}

// 文件内容
const content = ref('')
const getFileData = async () => {
  try {
    const res = await store.getFileData(route.params.id)
    content.value = res.content || ''
  } catch (error) {
    console.log(error)
  }
}
getFileData()

window.onbeforeunload = function () {
  if (store.autoSaveStatus !== 'success') {
    return '存在未保存的数据'
  }
}
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

    /deep/ .md-editor {
      height: 100%;
    }
  }
}
</style>

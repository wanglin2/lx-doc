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
        </div>
      </div>
    </div>
    <div class="editorBox" id="editorBox"></div>
  </div>
</template>

<script setup>
import { useStore } from '../../store'
import { useRoute, useRouter } from 'vue-router'
import { computed, ref, watch, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import {
  ArrowLeft,
  CircleCloseFilled,
  CircleCheckFilled,
  WarningFilled,
  Loading
} from '@element-plus/icons-vue'
import api from '@/api'
import { ElMessage } from 'element-plus'

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
  const content = luckysheet.getAllSheets()
  store.updateFileData({
    content: JSON.stringify(content)
  })
}
const onChange = () => {
  store.setAutoSaveStatus('wait')
  clearTimeout(autoSaveTimer.value)
  autoSaveTimer.value = setTimeout(() => {
    save()
  }, 3000)
}

//  实例化电子表格
const initSheet = () => {
  const options = {
    container: 'editorBox',
    showinfobar: false,
    lang: 'zh',
    showtoolbarConfig: {
      exportXlsx: false,
      print: false,
      chart: false
    },
    uploadImage: file => {
      return new Promise(async (resolve, reject) => {
        try {
          const formData = new FormData()
          formData.append('file', file)
          const { data } = await api.uploadFiles(formData)
          resolve(data)
        } catch (error) {
          console.log(error)
          reject('图片上传失败')
        }
      })
    },
    hook: {
      updated() {
        onChange()
      }
    }
  }
  if (content.value) {
    options.data = content.value
  }
  luckysheet.create(options)
}

// 文件内容
const content = ref('')
const getFileData = async () => {
  try {
    const res = await store.getFileData(route.params.id)
    content.value = res.content ? JSON.parse(res.content) : null
    initSheet()
  } catch (error) {
    console.log(error)
  }
}

window.onbeforeunload = function () {
  if (store.autoSaveStatus !== 'success') {
    return '存在未保存的数据'
  }
}

onMounted(() => {
  getFileData()
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

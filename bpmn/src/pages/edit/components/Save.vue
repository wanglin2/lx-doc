<template>
  <div class="saveToolbar">
    <el-button
      :icon="Back"
      circle
      style="margin-right: 10px"
      @click="back"
    ></el-button>
    <div class="name">
      <input
        type="text"
        v-model="fileName"
        @keydown.stop
        @keyup.stop
        @blur="onFileNameBlur"
      />
    </div>
    <el-tooltip
      effect="dark"
      content="封面图片会在文件列表页显示"
      placement="bottom"
    >
      <el-button round @click="saveCover" size="small">生成封面</el-button>
    </el-tooltip>
    <el-button round @click="save" size="small" style="margin-right: 10px"
      >保存</el-button
    >
    <span class="saveTip">
      <el-icon :class="[saveTipIconIsLoading ? 'is-loading' : '']" color="#333"
        ><component :is="saveTipIcon"></component
      ></el-icon>
      <span class="text">{{ saveTip }}</span>
    </span>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Back,
  CircleCloseFilled,
  CircleCheckFilled,
  WarningFilled,
  Loading
} from '@element-plus/icons-vue'
import bus from '@/utils/eventBus'
import { useStore } from '@/store'
import api from '@/api'
import { svgToPng } from '@/utils'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const props = defineProps({
  modeler: {
    type: Object
  }
})

// 返回工作台
const back = async () => {
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
  bus.emit('MANUAL_SAVE')
}

// 生成封面
const saveCover = async () => {
  try {
    const { err, svg } = await props.modeler.saveSVG()
    // 读取异常时抛出异常
    if (err) {
      return console.error(err)
    }
    const imgData = await svgToPng(svg)
    const { data } = await api.uploadImg({
      imgData
    })
    store.updateFileData({
      img: data
    })
  } catch (error) {
    console.log(error)
  }
}

window.onbeforeunload = function () {
  if (store.autoSaveStatus !== 'success') {
    return '存在未保存的数据'
  }
}
</script>

<style lang="less" scoped>
.saveToolbar {
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  border: 1px solid #e4e7ed;
  border-radius: 5px;
  align-items: center;
  padding: 0 10px;

  .name {
    input {
      width: 200px;
      height: 38px;
      color: #1d2129;
      font-size: 16px;
      border: none;
      outline: none;
    }
  }

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
</style>

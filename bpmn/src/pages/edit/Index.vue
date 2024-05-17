<template>
  <div class="bpmnContainer" v-if="show">
    <div class="canvas" ref="canvas"></div>
    <ToolBar v-if="modeler" :modeler="modeler"></ToolBar>
    <Save v-if="modeler" :modeler="modeler"></Save>
  </div>
</template>

<script setup>
import { nextTick, ref, shallowRef } from 'vue'
import BpmnModeler from 'bpmn-js/lib/Modeler'
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
import translate from './translate'
import defaultXmlStr from './example'
import minimapModule from 'diagram-js-minimap'
import ToolBar from './components/ToolBar.vue'
import Save from './components/Save.vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useStore } from '@/store'
import bus from '@/utils/eventBus'

const route = useRoute()
const router = useRouter()
const store = useStore()

// 编辑器
const canvas = ref(null)
const modeler = shallowRef(null)

// 保存
const autoSaveTimer = ref(null)
const save = () => {
  if (!modeler.value) return
  modeler.value.saveXML({ format: true }, (err, xml) => {
    if (!err) {
      store.updateFileData({
        content: xml
      })
    }
  })
}
const autoSave = () => {
  store.setAutoSaveStatus('wait')
  clearTimeout(autoSaveTimer.value)
  autoSaveTimer.value = setTimeout(() => {
    save()
  }, 3000)
}
bus.on('MANUAL_SAVE', save)

// 初始化编辑器
const initBpmn = data => {
  modeler.value = new BpmnModeler({
    container: canvas.value,
    additionalModules: [
      {
        translate: ['value', translate]
      },
      minimapModule
    ]
  })
  modeler.value.importXML(data || defaultXmlStr)
  modeler.value.get('minimap').open()
  modeler.value.on('commandStack.changed', autoSave)
}

// 页面初始化
const show = ref(false)
const init = async () => {
  try {
    if (!route.params.id) {
      ElMessage.warning({
        message: '页面缺少必要参数！',
        duration: 0
      })
      return
    }
    const userInfo = await store.getUserInfo()
    if (userInfo) {
      const fileData = await store.getFileData(route.params.id)
      show.value = true
      nextTick(() => {
        initBpmn(fileData.content)
      })
    } else {
      ElMessage.warning({
        message: '未登录',
        duration: 0
      })
      router.push('/login')
    }
  } catch (e) {
    console.log(e)
    ElMessage.warning({
      message: '页面初始化失败，请重试！',
      duration: 0
    })
  }
}

init()
</script>

<style lang="less" scoped>
.bpmnContainer {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;

  .canvas {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
}

/deep/ .bjs-powered-by {
  display: none;
}
</style>

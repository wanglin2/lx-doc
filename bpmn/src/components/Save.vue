<template>
  <div class="saveToolbar">
    <el-button
      :icon="Back"
      circle
      style="margin-right: 10px"
      @click="back"
    ></el-button>
    <div class="name">
      <input type="text" v-model="fileName" @keydown.stop @keyup.stop />
    </div>
    <el-tooltip
      effect="dark"
      content="封面图片会在文件列表页显示"
      placement="bottom"
    >
      <el-button
        round
        @click="saveCover"
        size="small"
        style="margin-right: 10px"
        >生成封面</el-button
      >
    </el-tooltip>
    <transition name="scalefade" mode="out-in">
      <span
        class="icon"
        :class="[successStatus ? 'success' : 'fail']"
        v-if="showStatus"
      ></span>
    </transition>
    <span class="tip" v-if="showStatus">{{
      successStatus ? '自动保存成功' : '自动保存失败'
    }}</span>
  </div>
</template>

<script setup>
import { nextTick, onUnmounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Back } from '@element-plus/icons-vue'
import bus from '@/utils/eventBus'
import { useStore } from '@/store'
import api from '@/api'
import { svgToPng } from '@/utils'
import { useRouter } from 'vue-router'

const props = defineProps({
  modeler: {
    type: Object
  }
})

const fileName = ref('')
const successStatus = ref(false)
const showStatus = ref(false)
let timer = null
const store = useStore()
fileName.value = store.userFileData ? store.userFileData.name : ''
const router = useRouter()

const back = () => {
  router.go(-1)
}

const onSaveStatusChange = status => {
  showStatus.value = false
  nextTick(() => {
    successStatus.value = status
    showStatus.value = true
  })
}

const updateName = () => {
  if (!fileName.value.trim()) {
    ElMessage.warning('名称不能为空')
    return
  }
  clearTimeout(timer)
  timer = setTimeout(async () => {
    try {
      let { data } = await saveFileData({
        name: fileName.value
      })
      if (data.code !== 0) {
        ElMessage.error(data.msg)
      }
    } catch (error) {
      ElMessage.error('保存失败')
    }
  }, 500)
}

const saveCover = async () => {
  const { err, svg } = await props.modeler.saveSVG()
  // 读取异常时抛出异常
  if (err) {
    return console.error(err)
  }
  let imgData = await svgToPng(svg)
  let url = await upload.uploadImg(imgData)
  let { data } = await saveFileData({
    cover: url
  })
  if (data.code === 0) {
    ElMessage.success('封面生成并保存成功')
  } else {
    ElMessage.error(data.msg)
  }
}

watch(fileName, (val, oldVal) => {
  if (oldVal) {
    updateName()
  }
})

bus.on('SAVE_STATUS_CHANGE', onSaveStatusChange)

onUnmounted(() => {
  bus.off('SAVE_STATUS_CHANGE', onSaveStatusChange)
})
</script>

<style lang="less">
.scalefade-enter-active,
.scalefade-leave-active {
  transition: all 0.5s;
}

.scalefade-enter,
.scalefade-leave-to {
  opacity: 0;
  transform: scale(0);
}
</style>
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
      width: 120px;
      height: 38px;
      color: #1d2129;
      font-size: 16px;
      border: none;
      outline: none;
    }
  }

  .icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    background-size: cover;
    margin-right: 5px;

    &.success {
      background-image: url('http://assets.lxqnsys.com/%E5%8B%BE.png');
    }

    &.fail {
      background-image: url('http://assets.lxqnsys.com/%E5%A4%B1%E8%B4%A5.png');
    }
  }
}
</style>

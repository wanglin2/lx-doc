<template>
  <span
    class="collectBtn iconfont"
    :class="[data.collected ? 'collected icon-shoucang1' : 'icon-shoucang']"
    v-if="data"
    @click.stop="toggleCollect"
  ></span>
</template>

<script setup>
import api from '@/api'
import { ElMessage } from 'element-plus'
import emitter from '@/utils/eventBus'

const props = defineProps({
  data: {
    type: Object,
    default() {
      return null
    }
  }
})

// 切换收藏状态
const toggleCollect = async () => {
  try {
    const { collected, id } = props.data
    const newCollected = !collected
    if (collected) {
      // 取消收藏
      await api.cancelCollect({
        id
      })
    } else {
      // 收藏
      await api.collect({
        id
      })
    }
    props.data.collected = newCollected
    ElMessage.success((newCollected ? '' : '取消') + `收藏成功`)
    emitter.emit('toggle_collect_success')
  } catch (error) {
    console.log(error)
  }
}
</script>

<style lang="less" scoped>
.collectBtn {
  font-size: 16px !important;
  color: #a6b9cd;
  margin-left: 6px;

  &:hover {
    color: #f93;
  }

  &.collected {
    color: #ff9933;
  }
}
</style>

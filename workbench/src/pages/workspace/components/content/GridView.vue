<template>
  <div class="gridViewContainer" ref="gridViewRef">
    <component
      v-for="item in list"
      :is="comp"
      :key="item.id"
      :data="item"
      :width="cardWidth"
      :style="{
        margin: margin + 'px',
        marginBottom: margin + 'px'
      }"
      :showCheckbox="showCheckbox"
      :enableDrag="enableDrag"
      :fileAdditionalMenuList="fileAdditionalMenuList"
      :showCollectBtn="showCollectBtn"
      v-bind="$attrs"
      @click="onClick(item)"
      @actionClick="onActionClick($event, item)"
    ></component>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import FileCard from './FileCard.vue'
import FolderCard from './FolderCard.vue'

const props = defineProps({
  // 是否显示多选框
  showCheckbox: {
    type: Boolean,
    default: true
  },
  // 是否允许拖拽
  enableDrag: {
    type: Boolean,
    default: true
  },
  // 类型，文件夹还是文件
  type: {
    type: String,
    default: ''
  },
  list: {
    type: Array,
    default() {
      return []
    }
  },
  // 文件附加的菜单列表
  fileAdditionalMenuList: {
    type: Array,
    default() {
      return []
    }
  },
  // 是否显示收藏按钮
  showCollectBtn: {
    type: Boolean,
    default: true
  }
})
const emits = defineEmits(['click', 'actionClick'])

const comp = computed(() => {
  return props.type === 'folder' ? FolderCard : FileCard
})
// 计算尺寸
const gridViewRef = ref(null)
const cardWidth = ref(0)
const margin = ref(10)
const minWidth = 120
const maxWidth = 200

// 更新尺寸信息
const updateSize = () => {
  if (!gridViewRef.value) return
  const width = gridViewRef.value.getBoundingClientRect().width - 4 // 4是滚动条宽度
  let num = 2
  let _cardWidth = 0
  while (num <= 10) {
    _cardWidth = Math.floor((width - num * 2 * margin.value) / num)
    if (_cardWidth >= minWidth && _cardWidth <= maxWidth) {
      break
    }
    num++
  }
  cardWidth.value = Math.max(_cardWidth, minWidth)
}

// 监听窗口大小改变事件
const onResize = () => {
  updateSize()
}
window.addEventListener('resize', onResize)

// 点击事件
const onClick = item => {
  emits('click', item)
}

// 操作点击事件
const onActionClick = (action, data) => {
  emits('actionClick', {
    action,
    data
  })
}

onMounted(() => {
  updateSize()
})
onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})
</script>

<style lang="less" scoped>
.gridViewContainer {
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
}
</style>

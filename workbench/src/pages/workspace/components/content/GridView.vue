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
      v-bind="$attrs"
      @click="onClick(item)"
      @renamed="onRenamed(item)"
      @moved="onMoved(item)"
      @deleted="onDeleted(item)"
    ></component>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import FileCard from './FileCard.vue'
import FolderCard from './FolderCard.vue'

const props = defineProps({
  type: {
    type: String,
    default: ''
  },
  list: {
    type: Array,
    default() {
      return []
    }
  }
})
const emits = defineEmits(['click', 'renamed', 'moved', 'deleted'])

const comp = computed(() => {
  return props.type === 'folder' ? FolderCard : FileCard
})
const gridViewRef = ref(null)
const cardWidth = ref(0)
const margin = ref(10)
const minWidth = 120
const maxWidth = 200

const updateSize = () => {
  if (!gridViewRef.value) return
  const width = gridViewRef.value.getBoundingClientRect().width - 4// 4是滚动条宽度
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

const onResize = () => {
  updateSize()
}

window.addEventListener('resize', onResize)

const onClick = (...args) => {
  emits('click', ...args)
}

const onRenamed = (...args) => {
  emits('renamed', ...args)
}

const onMoved = (...args) => {
  emits('moved', ...args)
}

const onDeleted = (...args) => {
  emits('deleted', ...args)
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

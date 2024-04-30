<template>
  <div
    class="folderCardContainer"
    :style="{ width: width + 'px' }"
    :class="{ isOnDragOver: isOnDragOver }"
    @click.stop="onClick"
    @contextmenu.stop
    :draggable="true"
    @dragover.prevent
    @drop.stop="onDrop"
    @dragenter.stop="onDragenter"
    @dragleave.stop="onDragleave"
    @dragstart.stop="onDragstart"
    @dragend.prevent="onDragend"
  >
    <span class="icon iconfont icon-wenjianjia"></span>
    <span class="text" :title="data.name">{{ data.name }}</span>
    <el-popover
      placement="bottom"
      :width="160"
      trigger="click"
      popper-style="padding: 4px;"
    >
      <template #reference>
        <span class="btn iconfont icon-icmore" @click.stop></span>
      </template>
      <Menu :list="menuList" @click="onMenuClick"></Menu>
    </el-popover>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import Menu from '../common/Menu.vue'
import { ElMessage } from 'element-plus'
import api from '@/api'
import { useStore } from '@/store'

const props = defineProps({
  data: {
    type: Object,
    default() {
      return null
    }
  },
  width: {
    type: Number,
    default: 0
  }
})
const emits = defineEmits(['click', 'actionClick', 'moved'])
const store = useStore()

const menuList = reactive([
  {
    name: '重命名',
    value: 'rename',
    icon: 'icon-zhongmingming'
  },
  {
    name: '复制/移动',
    value: 'copyOrMove',
    icon: 'icon-a-yidong2'
  },
  {
    name: '删除',
    value: 'delete',
    icon: 'icon-shanchu'
  }
])

const onClick = () => {
  emits('click')
}

const onMenuClick = item => {
  emits('actionClick', item.value)
}

// 移动文件或文件夹
const isOnDragOver = ref(false)
const onDrop = async () => {
  onDragleave()
  try {
    if (store.currentDragData) {
      const { type, data } = store.currentDragData
      if (type === 'file') {
        await api.moveFile({
          ids: [data.id],
          newFolderId: props.data.id
        })
        ElMessage.success('移动成功')
        emits('moved')
      } else {
        if (data.id !== props.data.id) {
          await api.moveFolder({
            id: data.id,
            newFolderId: props.data.id
          })
          ElMessage.success('移动成功')
          emits('moved')
        }
      }
    }
  } catch (error) {
    console.log(error)
  }
}
const onDragenter = e => {
  isOnDragOver.value = true
}
const onDragleave = e => {
  isOnDragOver.value = false
}
// 开始拖拽
const onDragstart = () => {
  store.setCurrentDragData({
    type: 'folder',
    data: props.data
  })
}
const onDragend = () => {
  store.setCurrentDragData(null)
}
</script>

<style lang="less" scoped>
.folderCardContainer {
  height: 40px;
  border-radius: 4px;
  border: 1px solid transparent;
  box-sizing: border-box;
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.16);
  display: flex;
  align-items: center;
  padding: 0 10px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: var(--theme-color);
    transform: translateY(-2px);
  }

  &.isOnDragOver {
    transform: translateY(-2px);
    border-color: var(--theme-color);

    .icon,
    .text,
    .btn {
      pointer-events: none;
    }
  }

  .icon {
    color: var(--folder-color);
    font-size: 24px;
  }

  .text {
    margin-left: 4px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #212930;
    font-size: 14px;
  }

  .btn {
    margin-left: auto;
    color: #6c7d8f;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>

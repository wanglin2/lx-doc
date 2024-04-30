<template>
  <Teleport to="body">
    <div
      class="contextmenuContainer"
      ref="contextmenuContainerRef"
      v-if="isShow"
      :style="{ left: position.left + 'px', top: position.top + 'px' }"
      @click.stop
    >
      <template v-for="item in menuList">
        <div class="devider" v-if="item.value === 'devider'"></div>
        <div
          class="menuItem"
          v-else
          :key="item.value"
          @click="onClick(item.value)"
        >
          <span
            class="iconfont"
            :class="[item.icon]"
            :style="{ color: item.color }"
          ></span>
          <span class="name">{{ item.name }}</span>
        </div>
      </template>
    </div>
  </Teleport>
</template>

<script setup>
import { reactive, ref, nextTick, onUnmounted } from 'vue'
import config from '@/config'
import useFileHandle from '@/hooks/useFileHandle'
import { RESOURCE_TYPES } from '@/constant'

const emits = defineEmits(['createFolder'])

// 创建新文件
const { createAndOpenNewFile } = useFileHandle()

const menuList = reactive([
  {
    name: '文件夹',
    value: RESOURCE_TYPES.FOLDER,
    icon: 'icon-wenjianjia',
    color: 'var(--folder-color)'
  },
  {
    value: 'devider'
  },
  ...config.createTypeList
])
const isShow = ref(false)
const contextmenuContainerRef = ref(null)
const position = reactive({
  left: 0,
  top: 0
})

// 计算右键菜单元素的显示位置
const getShowPosition = (x, y) => {
  const rect = contextmenuContainerRef.value.getBoundingClientRect()
  if (x + rect.width > window.innerWidth) {
    x = x - rect.width - 20
  }
  if (y + rect.height > window.innerHeight) {
    y = window.innerHeight - rect.height - 10
  }
  return { x, y }
}

const show = e => {
  e.preventDefault()
  isShow.value = true
  nextTick(() => {
    const { x, y } = getShowPosition(e.clientX + 10, e.clientY + 10)
    position.left = x
    position.top = y
  })
}

const hide = () => {
  isShow.value = false
  position.left = 0
  position.top = 0
}

const onClick = type => {
  hide()
  if (type === RESOURCE_TYPES.FOLDER) {
    emits('createFolder')
  } else {
    createAndOpenNewFile(type)
  }
}

const onBodyClick = () => {
  hide()
}
document.body.addEventListener('click', onBodyClick)

onUnmounted(() => {
  document.body.removeEventListener('click', onBodyClick)
})

defineExpose({
  show,
  hide
})
</script>

<style lang="less" scoped>
.contextmenuContainer {
  position: fixed;
  z-index: 3000;
  position: fixed;
  width: 160px;
  background: #fff;
  border: #e9edf2;
  box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  color: #212930;
  font-size: 13px;
  padding: 4px;

  .devider {
    width: 140px;
    height: 1px;
    background-color: #e9edf2;
    margin: 2px auto;
  }

  .menuItem {
    display: flex;
    padding: 0 10px;
    align-items: center;
    cursor: pointer;
    border-radius: 4px;
    height: 32px;

    &:hover {
      background: #f3f5f9;
    }

    .iconfont {
      font-size: 20px;
    }

    .name {
      font-size: 13px;
      color: #212930;
      margin-left: 4px;
    }
  }
}
</style>

<template>
  <div
    class="fileCardContainer"
    :style="{ width: width + 'px' }"
    :class="{ isSelectMode: isSelectMode }"
    @click.stop="onClick"
    @contextmenu.stop
    :draggable="true"
    @dragstart.stop="onDragstart"
    @dragover.prevent
    @dragend.prevent="onDragend"
  >
    <div class="imgBox" :style="{ height: width + 'px' }">
      <img v-if="data.img" :src="data.img" alt="" />
      <span
        v-else
        class="iconfont"
        :class="[getFileTypeIcon(data.type)]"
      ></span>
    </div>
    <div class="checkBox" @click.stop>
      <el-checkbox v-model="data.checked" :label="''" size="large" />
    </div>
    <el-popover
      placement="bottom"
      :width="160"
      trigger="click"
      popper-style="padding: 4px;"
    >
      <template #reference>
        <div class="menuBtn" @click.stop>
          <span class="iconfont icon-gengduo"></span>
        </div>
      </template>
      <Menu :list="menuList" @click="onMenuClick"></Menu>
    </el-popover>
    <div class="infoBox">
      <span
        class="iconfont"
        :class="[getFileTypeIcon(data.type)]"
        :style="{ color: getFileTypeConfig(data.type).color }"
      ></span>
      <span class="text" :title="data.name">{{ data.name }}</span>
    </div>
  </div>
</template>

<script setup>
import { getFileTypeIcon, getFileTypeConfig } from '@/utils'
import Menu from '../common/Menu.vue'
import { reactive } from 'vue'
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
  },
  isSelectMode: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['click', 'actionClick'])
const store = useStore()

const menuList = reactive([
  // {
  //   name: '预览',
  //   value: 'preview',
  //   icon: 'icon-zitiyulan'
  // },
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
  if (props.isSelectMode) {
    // 切换选中
    props.data.checked = !props.data.checked
  } else {
    emits('click')
  }
}

const onMenuClick = item => {
  emits('actionClick', item.value)
}

// 开始拖拽
const onDragstart = () => {
  store.setCurrentDragData({
    type: 'file',
    data: props.data
  })
}
const onDragend = () => {
  store.setCurrentDragData(null)
}
</script>

<style lang="less" scoped>
.fileCardContainer {
  box-sizing: border-box;
  position: relative;
  border-radius: 3px;
  transition: transform 0.4s;
  cursor: pointer;
  position: relative;

  &:hover {
    .imgBox {
      border-color: var(--theme-color);
    }
    .checkBox {
      visibility: visible;
    }
    .menuBtn {
      visibility: visible;
    }
    transform: translateY(-2px);
  }

  &.isSelectMode {
    .checkBox {
      visibility: visible;
    }
  }

  .imgBox {
    border: 1px solid transparent;
    width: 100%;
    position: relative;
    border-radius: 4px;
    border: 1px solid #eaecee;
    box-sizing: border-box;
    overflow: hidden;
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.16);
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .iconfont {
      font-size: 80px;
      color: #999;
    }
  }

  .checkBox {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    visibility: hidden;

    /deep/ .el-checkbox__label {
      display: none;
    }
  }

  .menuBtn {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(0, 0, 0, 0.4);
    height: 18px;
    display: flex;
    align-items: center;
    padding: 0 6px;
    border-radius: 4px;
    visibility: hidden;

    .iconfont {
      color: #fff;
    }
  }

  .infoBox {
    height: 30px;
    display: flex;
    align-items: center;

    .iconfont {
      font-size: 20px;
      flex-shrink: 0;
    }

    .text {
      margin-left: 4px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: #212930;
      font-size: 14px;
    }
  }
}
</style>

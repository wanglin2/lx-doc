<template>
  <div
    class="fileCardContainer"
    :style="{ width: width + 'px' }"
    :class="{ isSelectMode: isSelectMode }"
    @click.stop="onClick"
    @contextmenu.stop.prevent="onContextmenu"
    :draggable="enableDrag"
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
    <div class="checkBox" v-if="showCheckbox" @click.stop>
      <el-checkbox v-model="data.checked" :label="''" size="large" />
    </div>
    <el-popover
      placement="bottom"
      :width="160"
      trigger="click"
      popper-style="padding: 4px;"
      v-model:visible="menuListVisible"
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
      <span
        class="collectBtn iconfont"
        :class="[data.collected ? 'collected icon-shoucang1' : 'icon-shoucang']"
        v-if="showCollectBtn"
        @click.stop="toggleCollect"
      ></span>
    </div>
  </div>
</template>

<script setup>
import { getFileTypeIcon, getFileTypeConfig } from '@/utils'
import Menu from '../common/Menu.vue'
import { computed, onUnmounted } from 'vue'
import { useStore } from '@/store'
import api from '@/api'
import { ElMessage } from 'element-plus'
import emitter from '@/utils/eventBus'
import { useCardContextMenu } from '@/hooks/useContextMenuEvent'
import { RESOURCE_TYPES } from '@/constant'

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
  // 是否是多选模式
  isSelectMode: {
    type: Boolean,
    default: false
  },
  // 文件附加的菜单列表
  fileAdditionalMenuList: {
    type: Array,
    default() {
      return []
    }
  },
  // 覆盖原有菜单列表
  coverFileMenuList: {
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
const store = useStore()

const menuList = computed(() => {
  return props.coverFileMenuList.length > 0
    ? [...props.coverFileMenuList]
    : [
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
        },
        ...props.fileAdditionalMenuList
      ]
})

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
  if (typeof item.onClick === 'function') {
    item.onClick(props.data, RESOURCE_TYPES.FILE)
  }
}

// 开始拖拽
const onDragstart = () => {
  store.setCurrentDragData({
    type: RESOURCE_TYPES.FILE,
    data: props.data
  })
}
const onDragend = () => {
  store.setCurrentDragData(null)
}

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

// 右键显示菜单
const { onContextmenu, menuListVisible, unBindContextmenuEvent } =
  useCardContextMenu()

onUnmounted(() => {
  unBindContextmenuEvent()
})
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
    .infoBox {
      .collectBtn {
        visibility: visible;
      }
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
    overflow: hidden;

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

    .collectBtn {
      font-size: 16px;
      color: #a6b9cd;
      margin-left: 6px;
      visibility: hidden;

      &:hover {
        color: #f93;
      }

      &.collected {
        visibility: visible;
        color: #ff9933;
      }
    }
  }
}
</style>

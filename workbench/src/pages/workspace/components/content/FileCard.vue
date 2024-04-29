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
import Menu from './Menu.vue'
import { reactive } from 'vue'
import useFileHandle from '@/hooks/useFileHandle'
import emitter from '@/utils/eventBus'
import { ElMessage, ElMessageBox } from 'element-plus'
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
  },
  isSelectMode: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits([])
const fileHandle = useFileHandle()
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
    // 打开编辑页面
    fileHandle.openEditPage(props.data.type, props.data.id)
  }
}

const onMenuClick = item => {
  if (item.value === 'rename') {
    // 重命名
    emitter.emit('show_name_edit_dialog', {
      type: 'file',
      id: props.data.id,
      name: props.data.name,
      callback: () => {
        emits('renamed')
      }
    })
  } else if (item.value === 'copyOrMove') {
    // 复制/移动
    emitter.emit('show_move_dialog', {
      type: 'file',
      name: props.data.name,
      ids: [props.data.id],
      callback: () => {
        emits('moved')
      }
    })
  } else if (item.value === 'delete') {
    // 删除
    deleteFile()
  }
}

// 删除文件夹
const deleteFile = async () => {
  ElMessageBox.confirm(`是否确认删除【${props.data.name}】`, '删除文件', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const id = props.data.id
      await api.deleteFile({
        ids: [id]
      })
      emits('deleted')
      ElMessage({
        type: 'success',
        message: '删除成功'
      })
    } catch (error) {
      console.log(error)
    }
  })
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

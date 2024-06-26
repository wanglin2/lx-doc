<template>
  <div class="viewContainer">
    <template v-if="view === 'grid'">
      <!-- 文件夹列表 -->
      <div
        class="listHeader"
        v-if="showTitle && !isLoading && folderList.length > 0"
      >
        <div class="title">文件夹</div>
      </div>
      <GridView
        :type="RESOURCE_TYPES.FOLDER"
        :list="folderList"
        :enableDrag="enableDrag"
        :coverFolderMenuList="coverFolderMenuList"
        @moved="onMoved"
        @click="onFolderClick"
        @actionClick="onActionClick($event, RESOURCE_TYPES.FOLDER)"
      ></GridView>
      <!-- 文件列表 -->
      <div
        class="listHeader"
        v-if="showTitle && !isLoading && fileList.length > 0"
      >
        <div class="title">文件</div>
      </div>
      <GridView
        :type="RESOURCE_TYPES.FILE"
        :list="fileList"
        :isSelectMode="isSelectMode"
        :showCheckbox="showCheckbox"
        :enableDrag="enableDrag"
        :fileAdditionalMenuList="fileAdditionalMenuList"
        :showCollectBtn="showCollectBtn"
        :coverFileMenuList="coverFileMenuList"
        @click="onFileClick"
        @actionClick="onActionClick($event, RESOURCE_TYPES.FILE)"
      ></GridView>
    </template>
    <ListView
      v-else-if="!isLoading && (folderList.length > 0 || fileList.length > 0)"
      style="padding: 0 12px"
      :folderList="folderList"
      :fileList="fileList"
      :showCheckbox="showCheckbox"
      :coverFolderMenuList="coverFolderMenuList"
      :coverFileMenuList="coverFileMenuList"
      :fileAdditionalMenuList="fileAdditionalMenuList"
      :showCollectBtn="showCollectBtn"
      @folderClick="onFolderClick"
      @fileClick="onFileClick"
      @actionClick="onActionClick"
    ></ListView>
  </div>
</template>

<script setup>
import GridView from './GridView.vue'
import ListView from './ListView.vue'
import useFileHandle from '@/hooks/useFileHandle'
import emitter from '@/utils/eventBus'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '@/api'
import { RESOURCE_TYPES } from '@/constant'

const props = defineProps({
  // 是否显示标题
  showTitle: {
    type: Boolean,
    default: true
  },
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
  // 视图类型
  view: {
    type: String,
    default: 'grid' // list
  },
  // 是否正在加载中
  isLoading: {
    type: Boolean,
    default: false
  },
  // 文件夹列表
  folderList: {
    type: Array,
    default() {
      return []
    }
  },
  // 文件列表
  fileList: {
    type: Array,
    default() {
      return []
    }
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
  // 覆盖原有的菜单列表
  coverFileMenuList: {
    type: Array,
    default() {
      return []
    }
  },
  coverFolderMenuList: {
    type: Array,
    default() {
      return []
    }
  },
  // 是否显示收藏按钮
  showCollectBtn: {
    type: Boolean,
    default: true
  },
  // 禁用文件编辑，即跳转到编辑页面
  disabledFileEdit: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['renamed', 'moved', 'deleted', 'folderClick'])
const fileHandle = useFileHandle()

// 文件夹点击
const onFolderClick = (...args) => {
  emits('folderClick', ...args)
}

// 文件点击
const onFileClick = item => {
  if (props.disabledFileEdit) return
  fileHandle.openEditPage(item.type, item.id)
}

// 操作点击
const onActionClick = (payload, type) => {
  const action = payload.action
  const { id, name } = payload.data
  if (action === 'rename') {
    // 重命名
    emitter.emit('show_name_edit_dialog', {
      type,
      id,
      name,
      callback: () => {
        emits('renamed')
      }
    })
  } else if (action === 'copyOrMove') {
    // 复制或移动
    emitter.emit('show_move_dialog', {
      type,
      name,
      ids: [id],
      callback: () => {
        onMoved()
      }
    })
  } else if (action === 'delete') {
    // 删除
    if (type === RESOURCE_TYPES.FOLDER) {
      deleteFolder(id, name)
    } else {
      deleteFile(id, name)
    }
  }
}

// 移动了文件或文件夹
const onMoved = () => {
  emits('moved')
}

// 删除文件夹
const deleteFolder = async (id, name) => {
  ElMessageBox.confirm(`是否确认删除【${name}】？`, '删除文件夹', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await api.deleteFolder({
        id
      })
      emits('deleted')
      emitter.emit('delete_folder_success', id)
      ElMessage.success('删除成功')
    } catch (error) {
      console.log(error)
    }
  })
}

// 删除文件夹
const deleteFile = async (id, name) => {
  ElMessageBox.confirm(`是否确认删除【${name}】？`, '删除文件', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await api.deleteFile({
        ids: [id]
      })
      emits('deleted')
      ElMessage.success('删除成功')
    } catch (error) {
      console.log(error)
    }
  })
}
</script>

<style lang="less" scoped>
.viewContainer {
  .listHeader {
    display: flex;
    align-items: center;
    height: 40px;

    .title {
      font-size: 12px;
      color: #9aa5b8;
      height: 20px;
      line-height: 20px;
      padding: 0 10px;
    }
  }
}
</style>

<template>
  <div class="viewContainer">
    <template v-if="view === 'grid'">
      <!-- 文件夹列表 -->
      <div class="listHeader" v-if="!isLoading && folderList.length > 0">
        <div class="title">文件夹</div>
      </div>
      <GridView
        type="folder"
        :list="folderList"
        @moved="onMoved"
        @click="onFolderClick"
        @actionClick="onActionClick($event, 'folder')"
      ></GridView>
      <!-- 文件列表 -->
      <div class="listHeader" v-if="!isLoading && fileList.length > 0">
        <div class="title">文件</div>
      </div>
      <GridView
        type="file"
        :list="fileList"
        :isSelectMode="isSelectMode"
        @click="onFileClick"
        @actionClick="onActionClick($event, 'file')"
      ></GridView>
    </template>
    <ListView
      v-else-if="!isLoading && (folderList.length > 0 || fileList.length > 0)"
      style="padding: 0 12px"
      :folderList="folderList"
      :fileList="fileList"
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

const props = defineProps({
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
  fileHandle.openEditPage(item.type, item.id)
}

// 操作点击
const onActionClick = (payload, type) => {
  const action = payload.action
  const { id, name } = payload.data
  console.log(action, id, name)
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
    if (type === 'folder') {
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
  ElMessageBox.confirm(`是否确认删除【${name}】`, '删除文件夹', {
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
  ElMessageBox.confirm(`是否确认删除【${name}】`, '删除文件', {
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

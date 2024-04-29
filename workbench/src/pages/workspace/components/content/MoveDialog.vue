<template>
  <el-dialog
    append-to-body
    :width="350"
    v-model="dialogVisible"
    :title="title"
    align-center
    @close="onClose"
  >
    <div class="treeBox">
      <FolderTree @currentChange="onCurrentChange"></FolderTree>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="onConfirmCopy">复制</el-button>
        <el-button type="primary" @click="onConfirmMove">移动</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import emitter from '@/utils/eventBus'
import api from '@/api'
import { useStore } from '@/store'
import FolderTree from '../common/FolderTree.vue'

const store = useStore()

const editData = ref(null)
const isEditFile = computed(() => {
  return editData.value && editData.value.type === 'file'
})
const title = computed(() => {
  if (editData.value) {
    let name = editData.value.name || ''
    if (name.length >= 5) {
      name = name.slice(0, 5) + '...'
    }
    return `将【${name}】${isEditFile.value ? '复制或移动' : '移动'}至`
  } else {
    return ''
  }
})
const dialogVisible = ref(false)
const currentNodeData = ref(null)

// 树选择
const onCurrentChange = data => {
  currentNodeData.value = data
}

const onShow = data => {
  /*
      {
          type,// folder（文件夹）、file（文件）
          id,
          name,
          callback
      }
      */
  editData.value = data
  dialogVisible.value = true
}
emitter.on('show_move_dialog', onShow)

const onClose = () => {
  dialogVisible.value = false
  editData.value = null
}

// 确认复制
const onConfirmCopy = () => {
  if (!currentNodeData.value) {
    ElMessage.warning('请选择要复制到的文件夹')
    return
  }
  if (editData.value.type === 'folder') {
    copyFolder()
  } else {
    copyFile()
  }
}

// 确认移动
const onConfirmMove = () => {
  if (!currentNodeData.value) {
    ElMessage.warning('请选择要移动到的文件夹')
    return
  }
  if (editData.value.type === 'folder') {
    moveFolder()
  } else {
    moveFile()
  }
}

// 复制文件
const copyFile = async () => {
  try {
    await api.copyFile({
      ids: editData.value.ids,
      folderId: currentNodeData.value.id
    })
    if (editData.value.callback) editData.value.callback()
    onClose()
    ElMessage.success('复制成功')
  } catch (error) {
    console.log(error)
  }
}

// 移动文件
const moveFile = async () => {
  try {
    await api.moveFile({
      ids: editData.value.ids,
      newFolderId: currentNodeData.value.id
    })
    if (editData.value.callback) editData.value.callback()
    onClose()
    ElMessage.success('移动成功')
  } catch (error) {
    console.log(error)
  }
}

// 复制文件夹
const copyFolder = async () => {
  try {
    await api.copyFolder({
      id: editData.value.ids[0],
      folderId: currentNodeData.value.id
    })
    if (editData.value.callback) editData.value.callback()
    onClose()
    emitter.emit('copy_folder_success')
    ElMessage.success('复制成功')
  } catch (error) {
    console.log(error)
  }
}

// 移动文件夹
const moveFolder = async () => {
  try {
    await api.moveFolder({
      id: editData.value.ids[0],
      newFolderId: currentNodeData.value.id
    })
    if (editData.value.callback) editData.value.callback()
    onClose()
    emitter.emit('move_folder_success')
    ElMessage.success('移动成功')
  } catch (error) {
    console.log(error)
  }
}
</script>

<style lang="less" scoped>
.treeBox {
  width: 100%;
  height: 350px;
}
</style>

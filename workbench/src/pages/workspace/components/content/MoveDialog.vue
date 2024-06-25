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
      <FolderTree
        v-if="loadTree"
        @currentChange="onCurrentChange"
        :disabledIds="editData.ids"
      ></FolderTree>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="onConfirmCopy">复制</el-button>
        <el-button
          type="primary"
          @click="onConfirmMove"
          :disabled="disabledMove"
          >移动</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, shallowRef } from 'vue'
import { ElMessage } from 'element-plus'
import emitter from '@/utils/eventBus'
import api from '@/api'
import FolderTree from '../common/FolderTree.vue'
import { RESOURCE_TYPES } from '@/constant'

const editData = ref(null)
const loadTree = ref(false)
const title = computed(() => {
  if (editData.value) {
    let name = editData.value.name || ''
    if (name.length >= 5) {
      name = name.slice(0, 5) + '...'
    }
    return `将【${name}】复制或移动至`
  } else {
    return ''
  }
})
const dialogVisible = ref(false)
let currentNodeData = null
const currentNode = shallowRef(null)
const disabledMove = computed(() => {
  if (!currentNode.value) return true
  let disabled = false
  let par = currentNode.value
  while (par) {
    if (editData.value.ids.includes(par.data.id)) {
      disabled = true
    }
    par = par.parent
  }
  return disabled
})

// 树选择
const onCurrentChange = (data, node) => {
  currentNodeData = data
  currentNode.value = node
}

const onShow = data => {
  /*
      {
          type,// folder（文件夹）、file（文件）
          ids,
          name,
          callback
      }
      */
  editData.value = data
  dialogVisible.value = true
  loadTree.value = true
}
emitter.on('show_move_dialog', onShow)

const onClose = () => {
  dialogVisible.value = false
  editData.value = null
  loadTree.value = false
  currentNodeData = null
  currentNode.value = null
}

// 确认复制
const onConfirmCopy = () => {
  if (!currentNodeData) {
    ElMessage.warning('请选择要复制到的文件夹')
    return
  }
  if (editData.value.type === RESOURCE_TYPES.FOLDER) {
    copyFolder()
  } else {
    copyFile()
  }
}

// 确认移动
const onConfirmMove = () => {
  if (!currentNodeData) {
    ElMessage.warning('请选择要移动到的文件夹')
    return
  }
  if (editData.value.type === RESOURCE_TYPES.FOLDER) {
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
      newFolderId: currentNodeData.id
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
      newFolderId: currentNodeData.id
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
      folderId: currentNodeData.id
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
      newFolderId: currentNodeData.id
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

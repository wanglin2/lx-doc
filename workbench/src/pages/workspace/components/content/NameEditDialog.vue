<template>
  <el-dialog
    append-to-body
    :width="350"
    v-model="dialogVisible"
    :title="title"
    align-center
    @close="onClose"
  >
    <el-form
      ref="ruleFormRef"
      :model="editForm"
      :rules="editFormRule"
      label-width="120px"
      label-position="top"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="editForm.name" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="onConfirmClick">确定</el-button>
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
import { RESOURCE_TYPES } from '@/constant'

const store = useStore()

const ruleFormRef = ref(null)
const editData = ref(null)
const title = computed(() => {
  if (editData.value) {
    if (editData.value.id) {
      return '重命名'
    } else if (editData.value.type === RESOURCE_TYPES.FOLDER) {
      return '新建文件夹'
    }
  } else {
    return ''
  }
})
const dialogVisible = ref(false)
const editForm = reactive({
  name: ''
})
const editFormRule = reactive({
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    { min: 1, max: 100, message: '长度需在 1 到 100', trigger: 'blur' }
  ]
})

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
  editForm.name = data.name || ''
  dialogVisible.value = true
}
emitter.on('show_name_edit_dialog', onShow)

const onClose = () => {
  dialogVisible.value = false
  editData.value = null
  editForm.name = ''
}

const onConfirmClick = () => {
  ruleFormRef.value.validate(async valid => {
    if (valid) {
      try {
        let tip = ''
        let data = null
        if (editData.value.type === RESOURCE_TYPES.FOLDER) {
          if (editData.value.id) {
            // 重命名文件夹
            tip = '重命名成功'
            data = await updateFolder()
          } else {
            // 新建文件夹
            tip = '新建成功'
            data = await crateFolder()
          }
        } else {
          if (editData.value.id) {
            // 重命名文件
            tip = '重命名成功'
            data = await updateFile()
          }
        }
        if (editData.value.callback) editData.value.callback(data)
        onClose()
        ElMessage.success(tip)
      } catch (error) {
        console.log(error)
      }
    }
  })
}

// 新建文件夹
const crateFolder = async () => {
  if (!store.currentFolder) {
    ElMessage.warning('获取当前文件夹信息失败')
    return
  }
  const id = store.currentFolder.id
  const { data } = await api.crateFolder({
    name: editForm.name.trim(),
    parentFolderId: id
  })
  emitter.emit('create_folder_success', id)
  return data
}

// 重命名文件夹
const updateFolder = async () => {
  const id = editData.value.id
  const { data } = await api.updateFolder({
    id,
    name: editForm.name.trim()
  })
  emitter.emit('update_folder_success', id)
  return data
}

// 重命名文件
const updateFile = async () => {
  const id = editData.value.id
  const { data } = await api.updateFile({
    id,
    name: editForm.name.trim()
  })
  return data
}
</script>

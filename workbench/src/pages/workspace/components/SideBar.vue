<template>
  <div class="sidebarContainer w-[260px] h-full fixed left-0 top-0 flex flex-col overflow-hidden">
    <div class="logo h-[64px] flex justify-center items-center text-[30px] flex-shrink-0">
      <img
        src="http://assets.lxqnsys.com/%E7%94%BB%E6%9E%B6%28easel%29_%E7%88%B1%E7%BB%99%E7%BD%91_aigei_com.png"
        class="w-[35px] h-[35px] mr-[10px]"
      />
      理想文档
    </div>
    <div class="grow flex flex-col overflow-hidden">
      <!-- 头部 -->
      <div class="flex justify-between h-[36px] items-center flex-shrink-0 mb-[5px]">
        <div class="flex items-center">
          <span class="iconfont icon-wenjianjia text-[18px] text-[#b3b5b9] mr-[8px]"></span>
          <span class="text-[14px] text-[#565d64]">文件夹</span>
        </div>
        <div class="addBtn w-[30px] h-[30px] flex justify-center items-center cursor-pointer">
          <span
            class="iconfont icon-tianjia text-[18px] text-[#565d64]"
            @click="showCreateFolderDialog"
          ></span>
        </div>
      </div>
      <!-- 文件夹列表 -->
      <div class="grow overflow-auto">
        <FolderItem
          name="默认文件夹"
          value="default"
          :active="activeFolder.id === 'default'"
          @click="onFolderClick({
            name: '默认文件夹',
            id: 'default'
          })"
        ></FolderItem>
        <FolderItem
          v-for="item in folderList"
          :key="item.id"
          :name="item.name"
          :value="item.id"
          :active="activeFolder.id === item.id"
          @click="onFolderClick(item)"
          @rename="onFolderRename(item)"
          @delete="onFolderDelete(item)"
        ></FolderItem>
      </div>
    </div>
    <NameEditDialog
      :title="folderEditType === 'create' ? '新建文件夹' : '重命名文件夹'"
      label="文件夹名称"
      :text="editingFolder ? editingFolder.name : ''"
      :show="folderEditDialogVisible"
      @close="onNameEditDialogClose"
      @cancel="onNameEditDialogCancel"
      @confirm="onNameEditDialogConfirm"
    ></NameEditDialog>
  </div>
</template>

<script lang="ts" setup>
import {
  reactive,
  ref
} from "vue";
import FolderItem from './FolderItem.vue';
import api from '../../../api';
import { ElMessage, ElMessageBox } from 'element-plus'
import NameEditDialog from './NameEditDialog.vue';

const props = defineProps<{
  activeFolder: {
    name: string,
    id: string | number
  }
}>()

const emits = defineEmits(['changeFolder'])

// 文件夹显示
const useFolderShow = () => {
  const folderList = ref([])

  // 刷新文件夹列表
  const refreshFolderList = async () => {
    try {
      let { data } = await api.getFolderList()
      if (data.code === 0) {
        folderList.value = data.data
      }
    } catch (e) {
      console.log(e);
    }
  }
  refreshFolderList()

  // 切换文件夹
  const onFolderClick = (item) => {
    emits('changeFolder', item)
  }

  return {
    folderList,
    refreshFolderList,
    onFolderClick
  };
}

// 新建、修改文件夹
const useFolderEdit = () => {
  const folderEditType = ref('')
  const editingFolder = ref(null)
  const folderEditDialogVisible = ref(false)
  const folderEditFormRule = reactive({
    name: [
      { required: true, message: '请输入文件夹名称', trigger: 'blur' },
      { min: 1, max: 15, message: '长度需在 1 到 15', trigger: 'blur' },
    ],
  })

  // 关闭弹窗
  const onNameEditDialogClose = () => {
    folderEditDialogVisible.value = false
    folderEditType.value = ''
    editingFolder.value = null
  }

  // 取消
  const onNameEditDialogCancel = () => {
    onNameEditDialogClose()
  }

  // 显示新建弹窗
  const showCreateFolderDialog = () => {
    folderEditType.value = 'create'
    folderEditDialogVisible.value = true
  }

  // 新建文件夹
  const createFolder = async (form) => {
    let { data } = await api.createFolder({
      name: form.name.trim()
    })
    if (data.code !== 0) {
      throw new Error('创建失败')
    }
  }

  // 显示修改弹窗
  const onFolderRename = (item) => {
    editingFolder.value = item
    folderEditType.value = 'update'
    folderEditDialogVisible.value = true
  }

  // 更新文件夹
  const updateFolder = async (form) => {
    let { data } = await api.updateFolder({
      id: editingFolder.value.id,
      name: form.name.trim()
    })
    if (data.code !== 0) {
      throw new Error('创建失败')
    }
  }

  // 确定
  const onNameEditDialogConfirm = async (form) => {
    try {
      switch (folderEditType.value) {
        case 'create':
          await createFolder(form)
          ElMessage.success('创建成功')
          break;
        case 'update':
          await updateFolder(form)
          ElMessage.success('重命名成功')
          break;
        default:
          break;
      }
      onNameEditDialogClose()
      refreshFolderList()
    } catch (e) {
      ElMessage.error('创建失败')
    }
  }

  // 删除文件夹
  const onFolderDelete = (item) => {
    ElMessageBox.confirm(
      `是否确认删除【${item.name}】?`,
      '警告',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
      .then(async () => {
        try {
          let { data } = await api.deleteFolder({
            id: item.id
          })
          if (data.code !== 0) {
            throw new Error(data.msg)
          }
          if (item.id === props.activeFolder.id) {
            onFolderClick({
              name: '默认文件夹',
              id: 'default'
            })
          }
          refreshFolderList()
          ElMessage({
            type: 'success',
            message: '删除成功',
          })
        } catch (e) {
          ElMessage({
            type: 'error',
            message: '删除失败',
          })
        }
      })
      .catch(() => { })
  }

  return {
    folderEditType,
    folderEditDialogVisible,
    showCreateFolderDialog,
    folderEditFormRule,
    onNameEditDialogConfirm,
    onNameEditDialogCancel,
    onFolderRename,
    onFolderDelete,
    editingFolder,
    onNameEditDialogClose
  };
}

const { folderList, refreshFolderList, onFolderClick } = useFolderShow()
const {
  folderEditType,
  folderEditDialogVisible,
  showCreateFolderDialog,
  folderEditFormRule,
  onNameEditDialogConfirm,
  onNameEditDialogCancel,
  onFolderRename,
  onFolderDelete,
  editingFolder,
  onNameEditDialogClose
} = useFolderEdit()
</script>

<style lang="less" scoped>
.sidebarContainer {
  padding: 4px 12px 4px 16px;

  .logo {
    border-bottom: 1px solid #f0f0f0;
  }

  .addBtn {
    &:hover {
      background-color: #f0f0f0;
      border-radius: 6px;
    }
  }
}
</style>

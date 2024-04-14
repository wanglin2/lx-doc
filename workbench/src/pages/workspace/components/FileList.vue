<template>
  <div class="w-full pb-[20px]">
    <div class="flex justify-between items-center mb-[20px] pr-[50px]">
      <div class="flex items-center">
        <div class="text-[18px] text-[#1d2129] font-[500]">{{ name }}</div>
        <el-tooltip effect="dark" content="刷新" placement="bottom">
          <div class="ml-[10px] w-[30px] h-[30px] flex justify-center items-center cursor-pointer"
            @click="refreshFileList">
            <span class="iconfont icon-icon text-[20px] text-[rgb(29, 33, 41)]"></span>
          </div>
        </el-tooltip>
      </div>
      <div class="flex items-center">
        <el-input v-model="searchText" clearable placeholder="搜索白板" :prefix-icon="Search" />
        <el-tooltip effect="dark" content="列表展示" placement="bottom-end">
          <div class="layoutBtn ml-[10px] w-[30px] h-[30px] flex justify-center items-center cursor-pointer"
            :class="{ active: currentLayoutType === 'table' }" @click="changeLayoutType('table')">
            <span class="iconfont icon-danlieliebiao text-[20px]"></span>
          </div>
        </el-tooltip>
        <el-tooltip effect="dark" content="缩略图展示" placement="bottom-end">
          <div class="layoutBtn ml-[10px] w-[30px] h-[30px] flex justify-center items-center cursor-pointer"
            :class="{ active: currentLayoutType === 'grid' }" @click="changeLayoutType('grid')">
            <span class="iconfont icon-shuanglieliebiao text-[20px]"></span>
          </div>
        </el-tooltip>
      </div>
    </div>
    <div class="flex flex-wrap" v-loading="loading">
      <template v-if="currentLayoutType === 'grid'">
        <FileItem v-for="item in list" :key="item.id" :name="item.name" :img="item.cover"
          :time="item.updateAt || item.createAt" style="margin-right: 20px; margin-bottom: 20px;" :type="item.type"
          @click="onItemClick(item)" @rename="onRenameFile(item)" @delete="onDeleteFile(item)"
          @clone="onCloneFile(item)" @move="onMoveFile(item)"></FileItem>
      </template>
      <template v-else-if="currentLayoutType === 'table'">
        <el-table :data="list" style="width: 100%" empty-text="暂无数据" :row-style="{ cursor: 'pointer' }"
          @row-click="onTableRowClick">
          <el-table-column label="名称" prop="name">
            <template #default="scope">
              <span class="iconfont mr-[5px] text-[16px]" :class="[TYPE_ICON_MAP[scope.row.type]]"></span>
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="类型" prop="type">
            <template #default="scope">
              <span>{{ TYPE_MAP[scope.row.type] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createAt" />
          <el-table-column label="更新时间" prop="updateAt" />
          <el-table-column label="操作" width="80">
            <template #default="scope">
              <div class="h-full flex items-center" @click.stop>
                <el-dropdown @command="handleCommand($event, scope.row)">
                  <div
                    class="iconBox rounded-[4px] bg-[rgba(0,0,0,.3)] w-[22px] h-[16px] flex justify-center items-center cursor-pointer">
                    <span class="text-[18px] text-[#fff] iconfont icon-shenglvehao"></span>
                  </div>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="rename">重命名</el-dropdown-item>
                      <el-dropdown-item command="clone">克隆</el-dropdown-item>
                      <el-dropdown-item command="move">移动</el-dropdown-item>
                      <el-dropdown-item command="delete" :divided="true">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <NoData v-if="list.length <= 0 && !loading"></NoData>
    </div>
    <div class="h-[100px] flex items-center" v-if="totalPage > 0">
      <el-pagination background layout="prev, pager, next" :page-size="pageSize" :page-count="totalPage"
        :current-page="pageNo" @current-change="onCurrentChange" />
    </div>
    <NameEditDialog title="重命名文件" label="文件名称" :text="editFileData ? editFileData.name : ''" :show="showNameEditDialog"
      @close="onNameEditDialogClose" @cancel="onNameEditDialogCancel" @confirm="onNameEditDialogConfirm">
    </NameEditDialog>
    <MoveFileDialog :data="editFileData" :show="showMoveFileDialog" @close="onMoveFileDialogClose"
      @cancel="onMoveFileDialogCancel" @confirm="onMoveFileDialogConfirm"></MoveFileDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import FileItem from './FileItem.vue';
import api from '../../../api';
import { openEditPage } from '../../../utils';
import NoData from './NoData.vue';
import NameEditDialog from './NameEditDialog.vue';
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { TYPE_MAP, TYPE_ICON_MAP } from '../constants';
import emitter from '../../../utils/eventBus';
import MoveFileDialog from './MoveFileDialog.vue';

const props = defineProps<{
  name: string,
  id: string | number
}>()

// 文件列表
const useFileList = () => {
  const pageNo = ref(1)
  const pageSize = ref(10)
  const totalPage = ref(0)
  const searchText = ref("")
  let searchTimer = null
  const list = ref<any[]>([])
  const loading = ref(false)
  const currentLayoutType = ref('table')

  // 获取文件列表
  const getFileList = async () => {
    try {
      loading.value = true
      let { data } = await api.getFileList({
        pageNo: pageNo.value,
        pageSize: pageSize.value,
        belongId: props.id,
        searchText: searchText.value.trim()
      })
      loading.value = false
      if (data.code === 0) {
        totalPage.value = data.data.totalPage
        list.value = data.data.list || []
      }
    } catch (e) {
      console.log(e)
      loading.value = false
    }
  }

  // 刷新文件列表
  const refreshFileList = () => {
    pageNo.value = 1;
    list.value = []
    getFileList()
  }

  const onCurrentChange = (currentPage) => {
    pageNo.value = currentPage
    getFileList()
  }

  getFileList()

  // 切换文件夹
  watch(() => {
    return props.id;
  }, (val) => {
    refreshFileList()
  })

  // 搜索
  watch(searchText, () => {
    clearTimeout(searchTimer)
    searchTimer = setTimeout(() => {
      refreshFileList()
    }, 300);
  })

  // 点击
  const onItemClick = (item: { type: string, uid: string }) => {
    openEditPage(item.type, item.uid)
  }

  // 切换显示方式
  const changeLayoutType = (type) => {
    if (currentLayoutType.value === type) {
      return;
    }
    currentLayoutType.value = type
  }

  return {
    pageNo,
    pageSize,
    totalPage,
    searchText,
    list,
    loading,
    currentLayoutType,
    getFileList,
    refreshFileList,
    onItemClick,
    onCurrentChange,
    changeLayoutType,
  };
}

// 当前操作中的文件数据
const editFileData = ref(null)

// 更新文件
const useFileEdit = () => {
  // 重命名
  const showNameEditDialog = ref(false)
  const onRenameFile = (item) => {
    editFileData.value = item
    showNameEditDialog.value = true
  }

  const onNameEditDialogClose = () => {
    editFileData.value = null
    showNameEditDialog.value = false
  }

  const onNameEditDialogCancel = () => {
    onNameEditDialogClose()
  }

  const onNameEditDialogConfirm = async (form) => {
    try {
      let { data } = await api.updateFile({
        ...editFileData.value,
        name: form.name.trim()
      })
      if (data.code === 0) {
        ElMessage.success('重命名成功')
        onNameEditDialogClose()
        getFileList()
      } else {
        ElMessage.error(data.msg)
      }
    } catch (e) {
      console.log(e);
      ElMessage.error('重命名失败')
    }
  }

  // 删除
  const onDeleteFile = (item) => {
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
          let { data } = await api.deleteFile({
            id: item.id
          })
          if (data.code !== 0) {
            throw new Error(data.msg)
          }
          getFileList()
          ElMessage({
            type: 'success',
            message: '删除成功',
          })
        } catch (e) {
          console.log(e);
          ElMessage({
            type: 'error',
            message: '删除失败',
          })
        }
      })
      .catch(() => { })
  }

  // 克隆
  const onCloneFile = (item) => {
    emitter.emit('CLONE_FILE', item)
  }

  // 移动
  const showMoveFileDialog = ref(false)
  const onMoveFile = (item) => {
    editFileData.value = item
    showMoveFileDialog.value = true
  }

  const onMoveFileDialogClose = () => {
    editFileData.value = null
    showMoveFileDialog.value = false
  }

  const onMoveFileDialogCancel = () => {
    onMoveFileDialogClose()
  }

  const onMoveFileDialogConfirm = async (id) => {
    try {
      if (editFileData.value.belongId === id) {
        onMoveFileDialogClose()
        return;
      }
      let { data } = await api.updateFile({
        ...editFileData.value,
        belongId: id
      })
      if (data.code === 0) {
        ElMessage.success('移动成功')

        onMoveFileDialogClose()
        getFileList()
      } else {
        ElMessage.error(data.msg)
      }
    } catch (e) {
      ElMessage.error('移动失败')
    }
  }

  // 表格模式
  const handleCommand = (command: "rename" | "clone" | "move" | "delete", item: any) => {
    switch (command) {
      case 'rename':
        onRenameFile(item)
        break;
      case "clone":
        onCloneFile(item)
        break;
      case "delete":
        onDeleteFile(item)
        break;
      case "move":
        onMoveFile(item)
        break;
      default:
        break;
    }
  };

  // 表格行点击
  const onTableRowClick = (row) => {
    onItemClick(row)
  }

  return {
    showNameEditDialog,
    onRenameFile,
    onNameEditDialogClose,
    onNameEditDialogCancel,
    onNameEditDialogConfirm,
    onDeleteFile,
    onCloneFile,
    handleCommand,
    onTableRowClick,
    showMoveFileDialog,
    onMoveFileDialogClose,
    onMoveFileDialogCancel,
    onMoveFileDialogConfirm,
    onMoveFile
  };
}

const {
  pageNo,
  pageSize,
  totalPage,
  searchText,
  list,
  loading,
  currentLayoutType,
  getFileList,
  refreshFileList,
  onItemClick,
  onCurrentChange,
  changeLayoutType
} = useFileList()
const { showNameEditDialog, onRenameFile, onNameEditDialogClose, onNameEditDialogCancel, onNameEditDialogConfirm, onDeleteFile, onCloneFile, handleCommand, onTableRowClick, showMoveFileDialog, onMoveFileDialogClose, onMoveFileDialogCancel, onMoveFileDialogConfirm, onMoveFile } = useFileEdit()
</script>

<style lang="less" scoped>
.layoutBtn {
  color: rgb(179, 181, 185);

  &.active {
    color: rgb(29, 33, 41);
  }
}
</style>
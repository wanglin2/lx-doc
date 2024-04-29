<template>
  <div class="contentContainer">
    <div class="header">
      <div class="headerLeft">
        <el-input
          v-model="searchText"
          style="width: 300px; --el-border-radius-base: 16px"
          placeholder="搜索文件/文件夹"
          :prefix-icon="Search"
        />
      </div>
      <div class="headerRight">
        <Avatar></Avatar>
      </div>
    </div>
    <div class="content">
      <div class="contentHeader">
        <div class="left">
          <div class="folderPath">
            <div
              class="folderItem"
              v-for="item in currentFolderPath"
              :key="item.id"
              :class="{
                isCurrent: currentFolder && currentFolder.id === item.id
              }"
              @click="onFolderPathClick(item)"
            >
              {{ item.name }}
              <el-icon class="icon"><ArrowRight /></el-icon>
            </div>
          </div>
        </div>
        <div class="right">
          <el-button style="margin-right: 12px" @click="createFolder"
            >新建文件夹</el-button
          >
          <el-tooltip
            effect="light"
            :content="currentLayoutType === 'grid' ? '网格视图' : '列表视图'"
            placement="bottom"
          >
            <div class="layoutBtn" @click="toggleLayoutType">
              <span
                class="iconfont"
                :class="[
                  currentLayoutType === 'grid'
                    ? 'icon-shuanglieliebiao'
                    : 'icon-danlieliebiao'
                ]"
              ></span>
            </div>
          </el-tooltip>
        </div>
      </div>
      <div class="contentBody" @contextmenu="onContextMenu">
        <!-- 文件夹列表 -->
        <div class="listHeader" v-if="!isLoading && folderList.length > 0">
          <div class="title">文件夹</div>
        </div>
        <GridView
          type="folder"
          :list="folderList"
          @click="onFolderClick"
          @renamed="getFolderAndFileList"
          @moved="getFolderAndFileList"
          @deleted="getFolderAndFileList"
        ></GridView>
        <!-- 文件列表 -->
        <div class="listHeader" v-if="!isLoading && fileList.length > 0">
          <div class="title">文件</div>
          <div class="selectActionBox" v-if="checkedFileList.length > 0">
            <el-checkbox
              v-model="isCheckAll"
              :indeterminate="isIndeterminate"
              label="全选"
              size="large"
              @change="onCheckAllChange"
            />
            <div class="actionBtn" @click="copyOrMoveFiles">
              <span class="iconfont icon-a-yidong2"></span>
              <span class="text">移动/复制</span>
            </div>
            <div class="actionBtn delete" @click="deleteFiles">
              <span class="iconfont icon-shanchu"></span>
              <span class="text">删除</span>
            </div>
            <div class="actionBtn" @click="exitSelect">
              <span class="iconfont icon-guanbi"></span>
              <span class="text">取消批量操作</span>
            </div>
          </div>
        </div>
        <GridView
          type="file"
          :list="fileList"
          :isSelectMode="checkedFileList.length > 0"
          @renamed="getFolderAndFileList"
          @moved="getFolderAndFileList"
          @deleted="getFolderAndFileList"
        ></GridView>
        <!-- 无数据 -->
        <NoData
          v-if="!isLoading && folderList.length <= 0 && fileList.length <= 0"
        ></NoData>
        <!-- 右键菜单 -->
        <ContextMenu
          ref="ContextMenuRef"
          @createFolder="createFolder"
        ></ContextMenu>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Search, ArrowRight } from '@element-plus/icons-vue'
import Avatar from './Avatar.vue'
import GridView from './GridView.vue'
import { useStore } from '@/store'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '@/api'
import NoData from './NoData.vue'
import ContextMenu from './ContextMenu.vue'
import emitter from '@/utils/eventBus'

const store = useStore()

// 1.搜索
const searchText = ref('')

// 2.获取文件列表
const currentFolder = computed(() => {
  return store.currentFolder
})
const currentFolderPath = computed(() => {
  return store.currentFolderPath
})
const folderList = ref([])
const fileList = ref([])
const isLoading = ref(true)
// 监听当前所在文件夹，改变了刷新列表数据
watch(
  () => {
    return currentFolder.value
  },
  () => {
    getFolderAndFileList()
  }
)

// 获取文件夹和文件列表
const getFolderAndFileList = async () => {
  try {
    folderList.value = []
    fileList.value = []
    isLoading.value = true
    const { data } = await api.getFolderAndFileList({
      folderId: currentFolder.value ? currentFolder.value.id : ''
    })
    if (currentFolder.value === null) {
      const folder = data.folderList[0]
      store.setCurrentFolder(folder)
      store.setCurrentFolderPath([folder])
      return
    }
    folderList.value = data.folderList || []
    fileList.value = (data.fileList || []).map(item => {
      return {
        ...item,
        checked: false
      }
    })
    isLoading.value = false
  } catch (error) {
    console.log(error)
    isLoading.value = false
  }
}
emitter.on('refresh_list', getFolderAndFileList)

// 文件夹路径点击
const onFolderPathClick = path => {
  store.setCurrentFolder(path)
  const index = currentFolderPath.value.findIndex(item => {
    return item.id === path.id
  })
  store.setCurrentFolderPath(currentFolderPath.value.slice(0, index + 1))
}

// 文件夹点击
const onFolderClick = data => {
  store.setCurrentFolder(data)
  store.setCurrentFolderPath([...currentFolderPath.value, data])
}

// 3.文件多选
const isCheckAll = ref(false)
const checkedFileList = computed(() => {
  return fileList.value
    .filter(item => {
      return item.checked
    })
    .map(item => {
      return {
        ...item
      }
    })
})
watch(
  () => {
    return checkedFileList.value.length
  },
  val => {
    const allLength = fileList.value.length
    isCheckAll.value = allLength > 0 && val >= allLength
  }
)
const isIndeterminate = computed(() => {
  const checkedLength = checkedFileList.value.length
  const allLength = fileList.value.length
  return allLength > 0 && checkedLength > 0 && checkedLength < allLength
})
const onCheckAllChange = val => {
  fileList.value.forEach(item => {
    item.checked = val
  })
}
const exitSelect = () => {
  onCheckAllChange(false)
}
// 移动或复制多个文件
const copyOrMoveFiles = async () => {
  try {
    emitter.emit('show_move_dialog', {
      type: 'file',
      name: '所选文件',
      ids: checkedFileList.value.map(item => {
        return item.id
      }),
      callback: () => {
        getFolderAndFileList()
      }
    })
  } catch (error) {
    console.log(error)
  }
}
// 删除多个文件
const deleteFiles = async () => {
  try {
    ElMessageBox.confirm(`是否确认删除【所选文件】`, '删除文件', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      try {
        await api.deleteFile({
          ids: checkedFileList.value.map(item => {
            return item.id
          })
        })
        ElMessage({
          type: 'success',
          message: '删除成功'
        })
        getFolderAndFileList()
      } catch (error) {
        console.log(error)
      }
    })
  } catch (error) {
    console.log(error)
  }
}

// 4.右键菜单
const ContextMenuRef = ref(null)
const onContextMenu = e => {
  if (ContextMenuRef.value) {
    ContextMenuRef.value.show(e)
  }
}

// 5.创建文件夹
const createFolder = () => {
  emitter.emit('show_name_edit_dialog', {
    type: 'folder',
    callback: data => {
      onFolderClick(data)
    }
  })
}

// 6.展示类型
const currentLayoutType = computed(() => {
  return store.userConfig?.layoutType
})
const toggleLayoutType = async () => {
  try {
    await store.updateUserConfig({
      layoutType: currentLayoutType.value === 'grid' ? 'list' : 'grid'
    })
  } catch (error) {
    ElMessage.error('切换失败，请重试')
  }
}
</script>

<style lang="less" scoped>
.contentContainer {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .header {
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    padding: 0 24px;

    .headerRight {
      display: flex;
      align-items: center;
    }
  }

  .content {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding-bottom: 20px;

    .contentHeader {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
      margin-bottom: 8px;
      padding: 0 24px;

      .left {
        .folderPath {
          display: flex;

          .folderItem {
            color: #9aa5b8;
            font-weight: 400;
            cursor: pointer;
            display: flex;
            align-items: center;
            user-select: none;

            &:hover {
              color: #212930;
            }

            .icon {
              margin-top: 2px;
            }

            &.isCurrent {
              color: #212930;
              cursor: default;

              .icon {
                display: none;
              }
            }
          }
        }
      }

      .right {
        display: flex;
        align-items: center;

        .layoutBtn {
          width: 32px;
          height: 32px;
          border: var(--el-border);
          border-color: var(--el-border-color);
          border-radius: var(--el-border-radius-base);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
          cursor: pointer;
          background-color: #fff;

          &:hover {
            background-color: var(--el-color-primary-light-9);
            border-color: var(--el-color-primary-light-7);
            outline: none;

            .iconfont {
              color: var(--el-color-primary);
            }
          }

          .iconfont {
            font-size: 20px;
            color: var(--el-text-color-regular);
          }
        }
      }
    }

    .contentBody {
      width: 100%;
      height: 100%;
      overflow-y: auto;
      padding: 0 14px;

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

        .selectActionBox {
          display: flex;
          align-items: center;

          .actionBtn {
            display: flex;
            align-items: center;
            color: var(--theme-color);
            margin-left: 15px;
            cursor: pointer;
            user-select: none;

            &:first-of-type {
              margin-left: 20px;
            }

            &:hover {
              &.delete {
                color: #f56c6c;
              }
            }

            .iconfont {
            }

            .text {
              font-size: 14px;
            }
          }
        }
      }
    }
  }
}
</style>

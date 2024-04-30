<template>
  <div class="contentContainer">
    <div class="header">
      <div class="headerLeft">
        <el-input
          v-model="searchText"
          style="width: 300px; --el-border-radius-base: 16px"
          placeholder="搜索文件/文件夹"
          clearable
          :prefix-icon="Search"
          @keyup.enter="onSearch"
        />
      </div>
      <div class="headerRight">
        <Avatar></Avatar>
      </div>
    </div>
    <div class="content">
      <div class="contentHeader">
        <div class="left">
          <!-- 多选操作 -->
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
          <!-- 搜索提示 -->
          <div class="searchTip" v-else-if="isSearch">
            “{{ currentSearchText }}”的搜索结果：
          </div>
          <!-- 文件夹路径 -->
          <div class="folderPath" v-else>
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
          <!-- 操作按钮 -->
          <el-button class="marginRight" @click="createFolder" v-if="!isSearch"
            >新建文件夹</el-button
          >
          <TypeFilter
            class="marginRight"
            :filterType="currentFilterType"
            @change="onFilterTypeChange"
          ></TypeFilter>
          <Sort
            v-if="!isSearch"
            class="marginRight"
            :sortField="currentSortField"
            :sortType="currentSortType"
            @changeType="onsortTypeChange"
            @changeField="onSortFieldChange"
          ></Sort>
          <el-tooltip
            effect="light"
            :content="currentLayoutType === 'grid' ? '网格视图' : '列表视图'"
            placement="bottom"
          >
            <IconBtn
              :icon="
                currentLayoutType === 'grid'
                  ? 'icon-shuanglieliebiao'
                  : 'icon-danlieliebiao'
              "
              @click="toggleLayoutType"
            ></IconBtn>
          </el-tooltip>
        </div>
      </div>
      <div class="contentBody" @contextmenu.stop.prevent="onContextMenu">
        <!-- 视图 -->
        <View
          :view="currentLayoutType"
          :fileList="fileList"
          :folderList="folderList"
          :isLoading="isLoading"
          :isSelectMode="checkedFileList.length > 0"
          @folderClick="onFolderClick"
          @renamed="reloadList"
          @moved="reloadList"
          @deleted="reloadList"
        ></View>
        <!-- 无数据 -->
        <NoData
          :tip="isSearch ? '搜索无结果' : '点击左上角「创建」吧'"
          :showAddIcon="!isSearch"
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
import { ref, computed, watch, onUnmounted } from 'vue'
import { Search, ArrowRight } from '@element-plus/icons-vue'
import Avatar from '../common/Avatar.vue'
import { useStore } from '@/store'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '@/api'
import NoData from '../common/NoData.vue'
import ContextMenu from './ContextMenu.vue'
import emitter from '@/utils/eventBus'
import IconBtn from '../common/IconBtn.vue'
import TypeFilter from './TypeFilter.vue'
import Sort from './Sort.vue'
import View from './View.vue'
import useLayoutChange from '@/hooks/useLayoutChange'
import { emitContextmenuEvent } from '@/hooks/useContextMenuEvent'

const store = useStore()

// 刷新当前列表列表
const reloadList = () => {
  if (isSearch.value) {
    searchFolderAndFileList()
  } else {
    getFolderAndFileList()
  }
}

// 1.搜索
const isSearch = ref(false)
const searchText = ref('')
const currentSearchText = ref('')
const onSearch = () => {
  const text = searchText.value.trim()
  if (text) {
    isSearch.value = true
    currentSearchText.value = text
    searchFolderAndFileList()
  }
}
const resetSearch = () => {
  isSearch.value = false
  searchText.value = ''
  currentSearchText.value = ''
}
const searchFolderAndFileList = async () => {
  try {
    folderList.value = []
    fileList.value = []
    isLoading.value = true
    const { data } = await api.searchFolderAndFile({
      name: currentSearchText.value,
      type: currentFilterType.value === 'all' ? '' : currentFilterType.value
    })
    folderList.value = data.folderList || []
    fileList.value = data.fileList || []
    isLoading.value = false
  } catch (error) {
    console.log(error)
    isLoading.value = false
  }
}

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
const currentFilterType = ref('all')
const currentSortField = ref('createAt')
const currentSortType = ref('desc')

// 获取文件夹和文件列表
const getFolderAndFileList = async () => {
  try {
    if (isSearch.value) return
    folderList.value = []
    fileList.value = []
    isLoading.value = true
    const { data } = await api.getFolderAndFileList({
      folderId: currentFolder.value ? currentFolder.value.id : '',
      type: currentFilterType.value === 'all' ? '' : currentFilterType.value,
      sortField: currentSortField.value,
      sortType: currentSortType.value
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
// 监听当前所在文件夹，改变了刷新列表数据
watch(
  () => {
    return currentFolder.value
  },
  () => {
    // 如果当前处于搜索状态
    if (isSearch.value) {
      resetSearch()
    }
    if (currentFolder.value) {
      getFolderAndFileList()
    }
  },
  {
    immediate: true
  }
)

// 修改过滤类型
const onFilterTypeChange = val => {
  currentFilterType.value = val
  reloadList()
}
// 排序改变
const onSortFieldChange = val => {
  currentSortField.value = val
  getFolderAndFileList()
}
const onsortTypeChange = val => {
  currentSortType.value = val
  getFolderAndFileList()
}

// 文件夹路径点击
const onFolderPathClick = folder => {
  store.setCurrentFolder(folder)
  const index = currentFolderPath.value.findIndex(item => {
    return item.id === folder.id
  })
  store.setCurrentFolderPath(currentFolderPath.value.slice(0, index + 1))
}

// 文件夹点击
const onFolderClick = folder => {
  store.setCurrentFolder(folder)
  store.setCurrentFolderPath([
    ...(isSearch.value ? folder.path : currentFolderPath.value),
    folder
  ])
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
        reloadList()
      }
    })
  } catch (error) {
    console.log(error)
  }
}
// 删除多个文件
const deleteFiles = async () => {
  ElMessageBox.confirm(`是否确认删除【所选文件】？`, '删除文件', {
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
      reloadList()
    } catch (error) {
      console.log(error)
    }
  })
}

// 4.右键菜单
const ContextMenuRef = ref(null)
const onContextMenu = e => {
  emitContextmenuEvent()
  if (ContextMenuRef.value && !isSearch.value) {
    ContextMenuRef.value.show(e)
  }
}
const hideContextMenu = () => {
  if (ContextMenuRef.value) {
    ContextMenuRef.value.hide()
  }
}
emitter.on('contextmenu', hideContextMenu)

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
const { currentLayoutType, toggleLayoutType } = useLayoutChange()

onUnmounted(() => {
  emitter.off('refresh_list', getFolderAndFileList)
  emitter.off('contextmenu', hideContextMenu)
})
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
        .searchTip {
          color: #212930;
          height: 40px;
          display: flex;
          align-items: center;
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

        .folderPath {
          display: flex;
          height: 40px;
          display: flex;
          align-items: center;

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

        .marginRight {
          margin-right: 12px;
        }
      }
    }

    .contentBody {
      width: 100%;
      height: 100%;
      overflow-y: auto;
      padding: 0 14px;
    }
  }
}
</style>

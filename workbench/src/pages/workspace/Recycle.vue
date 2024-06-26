<template>
  <div class="collectContainer">
    <div class="header">
      <div class="headerLeft">
        <el-input
          v-model="searchText"
          style="width: 300px; --el-border-radius-base: 16px"
          placeholder="搜索回收站的文件/文件夹"
          clearable
          :prefix-icon="Search"
          @keyup.enter="onSearch"
          @clear="onSearch"
        />
      </div>
      <div class="headerRight">
        <Avatar></Avatar>
      </div>
    </div>
    <div class="content">
      <div class="contentHeader">
        <div class="left">
          <!-- 搜索提示 -->
          <div class="searchTip" v-if="isSearch">
            “{{ currentSearchText }}”的搜索结果：
          </div>
          <div class="titleInfo" v-else>
            <div class="title">回收站</div>
            <div class="emptyBtn" @click="emptyRecycle">清空回收站</div>
          </div>
        </div>
        <div class="right"></div>
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
      <div class="contentBody">
        <!-- 视图 -->
        <View
          :view="currentLayoutType"
          :folderList="folderList"
          :fileList="fileList"
          :isLoading="isLoading"
          :showCheckbox="false"
          :enableDrag="false"
          :coverFileMenuList="menuList"
          :coverFolderMenuList="menuList"
          :showCollectBtn="false"
          :disabledFileEdit="true"
        ></View>
        <!-- 无数据 -->
        <NoData
          :tip="isSearch ? '搜索无结果' : '回收站空空如也'"
          :showAddIcon="false"
          v-if="!isLoading && fileList.length <= 0 && folderList.length <= 0"
        ></NoData>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, reactive, onUnmounted } from 'vue'
import { Search, ArrowRight } from '@element-plus/icons-vue'
import Avatar from './components/common/Avatar.vue'
import { useStore } from '@/store'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '@/api'
import NoData from './components/common/NoData.vue'
import emitter from '@/utils/eventBus'
import IconBtn from './components/common/IconBtn.vue'
import View from './components/content/View.vue'
import useLayoutChange from '@/hooks/useLayoutChange'

// 搜索
const isSearch = ref(false)
const searchText = ref('')
const currentSearchText = ref('')
const onSearch = () => {
  const text = searchText.value.trim()
  if (text) {
    isSearch.value = true
    currentSearchText.value = text
    getRecycleFolderAndFileList()
  } else {
    resetSearch()
    getRecycleFolderAndFileList()
  }
}
const resetSearch = () => {
  isSearch.value = false
  searchText.value = ''
  currentSearchText.value = ''
}

// 视图切换
const { currentLayoutType, toggleLayoutType } = useLayoutChange()

// 列表
const folderList = ref([])
const fileList = ref([])
const isLoading = ref(true)
// 获取收藏文件列表
const getRecycleFolderAndFileList = async () => {
  try {
    folderList.value = []
    fileList.value = []
    isLoading.value = true
    const { data } = await api.getRecycleFolderAndFileList({
      name: currentSearchText.value
    })
    folderList.value = data.folderList || []
    fileList.value = data.fileList || []
    isLoading.value = false
  } catch (error) {
    console.log(error)
    isLoading.value = false
  }
}
getRecycleFolderAndFileList()

// 恢复
const menuList = reactive([
  {
    name: '恢复',
    value: 'restore',
    icon: 'icon-recover',
    onClick: (item, type) => {
      restore(item, type)
    }
  },
  {
    name: '彻底删除',
    value: 'completelyDelete',
    icon: 'icon-chedishanchu',
    onClick: (item, type) => {
      completelyDelete(item, type)
    }
  }
])

// 恢复
const restore = async (item, type) => {
  ElMessageBox.confirm(`是否确认恢复【${item.name}】？`, '恢复', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await api.restore({
        id: item.id,
        type
      })
      ElMessage({
        type: 'success',
        message: '恢复成功'
      })
      getRecycleFolderAndFileList()
      emitter.emit('reload_sidebar_tree')
    } catch (error) {
      console.log(error)
    }
  })
}

// 彻底删除
const completelyDelete = (item, type) => {
  ElMessageBox.confirm(`是否彻底删除【${item.name}】？`, '彻底删除', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await api.completelyDelete({
        id: item.id,
        type
      })
      ElMessage({
        type: 'success',
        message: '彻底删除成功'
      })
      getRecycleFolderAndFileList()
    } catch (error) {
      console.log(error)
    }
  })
}

// 清空回收站
const emptyRecycle = () => {
  ElMessageBox.confirm(`是否确认清空回收站？`, '彻底删除', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await api.emptyRecycle()
      ElMessage({
        type: 'success',
        message: '清空回收站成功'
      })
      getRecycleFolderAndFileList()
    } catch (error) {
      console.log(error)
    }
  })
}

onUnmounted(() => {})
</script>

<style lang="less" scoped>
.collectContainer {
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
        .titleInfo {
          display: flex;
          align-items: center;

          .emptyBtn {
            margin-left: 12px;
            color: #f56c6c;
            font-size: 13px;
            cursor: pointer;
            user-select: none;
            opacity: 0.8;

            &:hover {
              opacity: 1;
            }
          }
        }
      }

      .right {
        display: flex;
        align-items: center;
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

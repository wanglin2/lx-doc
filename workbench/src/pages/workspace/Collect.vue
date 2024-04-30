<template>
  <div class="collectContainer">
    <div class="header">
      <div class="headerLeft">
        <el-input
          v-model="searchText"
          style="width: 300px; --el-border-radius-base: 16px"
          placeholder="搜索收藏的文件"
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
          <div class="title" v-else>文件</div>
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
          :fileList="fileList"
          :isLoading="isLoading"
          :showCheckbox="false"
          :enableDrag="false"
          :showTitle="false"
          :fileAdditionalMenuList="menuList"
          @renamed="getCollectFileList"
          @moved="getCollectFileList"
          @deleted="getCollectFileList"
        ></View>
        <!-- 无数据 -->
        <NoData
          :tip="isSearch ? '搜索无结果' : '收藏夹空空如也'"
          :showAddIcon="false"
          v-if="!isLoading && fileList.length <= 0"
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
    getCollectFileList()
  } else {
    resetSearch()
    getCollectFileList()
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
const fileList = ref([])
const isLoading = ref(true)
// 获取收藏文件列表
const getCollectFileList = async () => {
  try {
    fileList.value = []
    isLoading.value = true
    const { data } = await api.getCollectFileList({
      name: currentSearchText.value
    })
    fileList.value = data || []
    isLoading.value = false
  } catch (error) {
    console.log(error)
    isLoading.value = false
  }
}
getCollectFileList()

emitter.on('toggle_collect_success', getCollectFileList)

// 取消收藏
const menuList = reactive([
  {
    name: '取消收藏',
    value: 'cancelCollect',
    icon: 'icon-quxiaoshoucang',
    onClick: item => {
      cancelCollect(item)
    }
  }
])

const cancelCollect = async item => {
  ElMessageBox.confirm(`是否确认取消收藏【${item.name}】`, '取消收藏', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await api.cancelCollect({
        id: item.id
      })
      ElMessage({
        type: 'success',
        message: '取消收藏成功'
      })
      getCollectFileList()
    } catch (error) {
      console.log(error)
    }
  })
}

onUnmounted(() => {
  emitter.off('toggle_collect_success', getCollectFileList)
})
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

<template>
  <div class="sidebarContainer">
    <div class="header">
      <span class="logo">
        <img :src="config.logo" alt="" />
      </span>
      <span class="title">{{ config.name }}</span>
    </div>
    <div class="createBox" @click.stop>
      <div
        class="createBtn"
        @click="createTypeListVisible = !createTypeListVisible"
      >
        <span class="iconfont icon-jia"></span>
        <span class="text">创建</span>
      </div>
      <div class="createTypeList" v-show="createTypeListVisible">
        <div
          class="createTypeItem"
          v-for="item in config.createTypeList"
          :key="item.value"
          @click="createAndOpenNewFile(item.value)"
        >
          <span
            class="iconfont"
            :class="[item.icon]"
            :style="{ color: item.color }"
          ></span>
          <span class="text">{{ item.name }}</span>
        </div>
      </div>
    </div>
    <div class="menuList">
      <div
        class="menuItem"
        :class="{ isActive: route.name === 'Collect' }"
        @click="toCollect"
      >
        <span class="iconfont icon-shoucang"></span>
        <span class="text">我的收藏</span>
      </div>
      <div
        class="menuItem"
        :class="{ isActive: route.name === 'Recycle' }"
        @click="toRecycle"
      >
        <span class="iconfont icon-shanchu"></span>
        <span class="text">回收站</span>
      </div>
      <div class="folderTree">
        <FolderTree
          v-if="isLoadTree"
          ref="FolderTreeRef"
          :isNotSetCurrentNode="isNotSetCurrentNode"
          :currentNodeKey="currentFolder ? currentFolder.id : ''"
          @currentChange="onCurrentChange"
        ></FolderTree>
      </div>
      <div
        class="menuItem"
        :class="{ isActive: route.name === 'Panorama' }"
        @click="toPanorama"
      >
        <span class="iconfont icon-siweidaotu1"></span>
        <span class="text">文件全景图</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { nextTick, ref, watch, computed, onUnmounted } from 'vue'
import config from '@/config'
import api from '@/api'
import useFileHandle from '@/hooks/useFileHandle'
import { useStore } from '@/store'
import FolderTree from '../common/FolderTree.vue'
import emitter from '@/utils/eventBus'
import { useRouter, useRoute } from 'vue-router'

const store = useStore()
const route = useRoute()
const router = useRouter()

// 创建列表的显示
const createTypeListVisible = ref(false)
const hideCreateTypeList = () => {
  createTypeListVisible.value = false
}
window.addEventListener('click', hideCreateTypeList)

// 创建新文件
const { createAndOpenNewFile } = useFileHandle()

// 进入收藏页面
const toCollect = () => {
  clearCurrentNode()
  router.push({
    name: 'Collect'
  })
}

// 进入回收站页面
const toRecycle = () => {
  clearCurrentNode()
  router.push({
    name: 'Recycle'
  })
}

// 进入文件全景图页面
const toPanorama = () => {
  clearCurrentNode()
  router.push({
    name: 'Panorama'
  })
}

// 文件夹树
const isLoadTree = ref(true)
const isNotSetCurrentNode = ref(route.name !== 'List')
const FolderTreeRef = ref(null)
// 监听当前所在文件夹，改变了刷新列表数据
const currentFolder = computed(() => {
  return store.currentFolder
})
watch(
  () => {
    return currentFolder.value
  },
  () => {
    FolderTreeRef.value.setCurrentKey(
      currentFolder.value ? currentFolder.value.id : null
    )
  }
)

// 修改当前文件夹、路径
const onCurrentChange = (data, node) => {
  if (!data || !node) return
  if (route.name !== 'List') {
    router.push({
      name: 'List'
    })
  }
  const pathList = [{ ...data }]
  let parent = node.parent
  while (parent && parent.level > 0) {
    pathList.unshift({ ...parent.data })
    parent = parent.parent
  }
  store.setCurrentFolderPath(pathList)
  store.setCurrentFolder({ ...data })
}

// 清空当前所在的文件夹信息
const clearCurrentNode = () => {
  store.setCurrentFolderPath([])
  store.setCurrentFolder(null)
}

// 重新加载树
const reloadTree = () => {
  isNotSetCurrentNode.value = true
  isLoadTree.value = false
  nextTick(() => {
    isLoadTree.value = true
  })
}
emitter.on('reload_sidebar_tree', reloadTree)
emitter.on('move_folder_success', reloadTree)
emitter.on('copy_folder_success', reloadTree)

// 刷新指定节点的父节点数据
const refreshParentNode = id => {
  const tree = FolderTreeRef.value.getTree()
  const node = tree.getNode(id)
  if (node) {
    const parent = node.parent
    if (parent.loaded) {
      FolderTreeRef.value.updateNodeById(parent.data.id)
    }
  }
}
emitter.on('delete_folder_success', refreshParentNode)
emitter.on('update_folder_success', refreshParentNode)

// 刷新指定节点数据
const refreshNode = id => {
  const tree = FolderTreeRef.value.getTree()
  const node = tree.getNode(id)
  if (node) {
    // 如果之前没有子节点，那么需要修改是否是叶子节点状态
    if (node.isLeaf) {
      node.isLeaf = false
      node.isLeafByUser = false
      node.data.leaf = false
    }
    // 如果该节点还没有加载过，那么直接返回
    if (!node.loaded) return
    // 如果已经加载过了，那么就更新子节点
    FolderTreeRef.value.updateNodeById(id, () => {
      nextTick(() => {
        if (!node.expanded) {
          node.expanded = true
        }
        nextTick(() => {
          FolderTreeRef.value.setCurrentKey(
            currentFolder.value ? currentFolder.value.id : null
          )
        })
      })
    })
  }
}
emitter.on('create_folder_success', refreshNode)

onUnmounted(() => {
  emitter.off('reload_sidebar_tree', reloadTree)
  emitter.off('move_folder_success', reloadTree)
  emitter.off('copy_folder_success', reloadTree)
  emitter.off('delete_folder_success', refreshParentNode)
  emitter.off('update_folder_success', refreshParentNode)
  emitter.off('create_folder_success', refreshNode)
})
</script>

<style lang="less" scoped>
.sidebarContainer {
  width: 250px;
  height: 100%;
  background-color: #fff;
  border-right: 1px solid #e9edf2;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  padding-bottom: 12px;

  .header {
    display: flex;
    align-items: center;
    height: 100px;
    justify-content: center;
    flex-shrink: 0;

    .logo {
      width: 50px;
      height: 50px;
      margin-right: 10px;

      img {
        width: 100%;
      }
    }

    .title {
      font-size: 30px;
      font-weight: bold;
      color: var(--theme-color);
    }
  }

  .createBox {
    padding: 0 12px;
    position: relative;
    z-index: 2;
    flex-shrink: 0;

    .createBtn {
      height: 35px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--theme-color);
      border-radius: 4px;
      color: #fff;
      cursor: pointer;
      user-select: none;

      &:hover {
        opacity: 0.8;
      }

      &:active {
        opacity: 0.6;
      }

      .text {
        margin-left: 12px;
      }
    }

    .createTypeList {
      position: absolute;
      left: 12px;
      top: 38px;
      width: 272px;
      padding: 16px 20px 0;
      background: #fff;
      box-shadow: 0 6px 16px 1px rgba(0, 0, 0, 0.08),
        0 9px 28px 8px rgba(0, 0, 0, 0.05);
      border-radius: 8px;
      border: 1px solid #e9edf2;
      display: flex;
      flex-wrap: wrap;

      .createTypeItem {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 70px;
        height: 65px;
        border-radius: 4px;
        cursor: pointer;
        margin-bottom: 16px;
        margin-right: 10px;
        font-weight: bold;

        &:nth-of-type(3n) {
          margin-right: 0;
        }

        &:hover {
          background: #f3f5f9;
        }

        .iconfont {
          font-size: 24px;
        }

        .text {
          color: #6c7d8f;
          font-size: 12px;
          margin-top: 4px;
        }
      }
    }
  }

  .menuList {
    margin-top: 20px;
    height: 100%;
    overflow-y: auto;

    .menuItem {
      height: 32px;
      display: flex;
      align-items: center;
      font-size: 16px;
      color: #212930;
      padding-left: 24px;
      cursor: pointer;
      user-select: none;

      &:hover {
        background-color: var(--el-fill-color-light);
      }

      &.isActive {
        background-color: var(--el-color-primary-light-9);
      }

      .iconfont {
        font-size: 18px;
      }

      .text {
        margin-left: 6px;
      }
    }

    .folderTree {
      .customFolderTreeNode {
        display: flex;
        align-items: center;
        font-size: 16px;
        color: #212930;

        .iconfont {
          font-size: 18px;
        }

        .text {
          margin-left: 6px;
        }
      }
    }
  }
}
</style>

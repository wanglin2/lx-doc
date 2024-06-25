<template>
  <div class="folderTreeContainer">
    <el-tree
      ref="treeRef"
      empty-text="这里空空如也"
      node-key="id"
      lazy
      :load="loadFolderTreeNode"
      :props="folderTreeProps"
      :expand-on-click-node="false"
      :highlight-current="true"
      style="--el-tree-node-content-height: 35px"
      @current-change="onFolderCurrentChange"
    >
      <template #default="{ node, data }">
        <span class="customFolderTreeNode">
          <span class="iconfont icon-wenjianjia1"></span>
          <span class="text">{{ node.label }}</span>
        </span>
      </template>
    </el-tree>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import api from '@/api'

const props = defineProps({
  isNotSetCurrentNode: {
    type: Boolean,
    default: false
  },
  currentNodeKey: {
    type: String,
    default: ''
  }
})
const emits = defineEmits(['currentChange'])

const treeRef = ref(null)
const folderTreeProps = ref({
  label: 'name',
  children: 'children',
  isLeaf: 'leaf'
})

// 加载树节点
const loadFolderTreeNode = async (node, resolve) => {
  try {
    let { data } = await api.getFolderTree({
      folderId: node.level === 0 ? '' : node.data.id
    })
    // 初始选中根节点
    if (!props.isNotSetCurrentNode && node.level === 0 && data.length > 0) {
      nextTick(() => {
        treeRef.value.setCurrentKey(data[0].id)
      })
    } else if (props.currentNodeKey) {
      nextTick(() => {
        treeRef.value.setCurrentKey(props.currentNodeKey)
      })
    }
    resolve(data)
  } catch (error) {
    console.log(error)
  }
}

// 选中节点
const onFolderCurrentChange = (data, node) => {
  emits('currentChange', data, node)
}

// 获取树组件实例
const getTree = () => {
  return treeRef.value
}

// 设置当前选中节点
const setCurrentKey = id => {
  const node = treeRef.value.getNode(id)
  treeRef.value.setCurrentKey(node ? id : null)
}

// 更新指定id的节点
const updateNodeById = async (id, callback) => {
  try {
    const { data } = await api.getFolderTree({
      folderId: id
    })
    treeRef.value.updateKeyChildren(
      id,
      data.map(item => {
        return {
          ...item
        }
      })
    )
    callback && callback()
  } catch (error) {
    console.log(error)
  }
}

defineExpose({
  getTree,
  setCurrentKey,
  updateNodeById
})
</script>

<style lang="less" scoped>
.folderTreeContainer {
  width: 100%;
  height: 100%;
  overflow-y: auto;

  .customFolderTreeNode {
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #212930;
    width: 100%;
    overflow: hidden;

    .iconfont {
      font-size: 18px;
      flex-shrink: 0;
    }

    .text {
      margin-left: 6px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
    }
  }
}
</style>

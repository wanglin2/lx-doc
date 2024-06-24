<template>
  <div class="panoramaContainer">
    <div class="header">
      <div class="headerLeft"></div>
      <div class="headerRight">
        <Avatar></Avatar>
      </div>
    </div>
    <div class="content">
      <div class="contentBody" ref="contentBodyRef"></div>
      <div class="toolsBtn">
        <div class="btn" @click="reset">
          <el-icon><Aim /></el-icon>
        </div>
        <div class="btn" @click="zoomOut">
          <el-icon color="#212930"><ZoomOut /></el-icon>
        </div>
        <div class="btn" @click="zoomIn">
          <el-icon color="#212930"><ZoomIn /></el-icon>
        </div>
        <el-popover placement="top" :width="200" trigger="click">
          <template #reference>
            <div class="btn">
              <el-icon color="#212930"><QuestionFilled /></el-icon>
            </div>
          </template>
          <div class="helpList">
            <div
              class="helpItem"
              v-for="(item, index) in panoramaHelpList"
              :key="index"
            >
              <div class="title">{{ index + 1 }}.{{ item.title }}</div>
              <div class="desc">{{ item.desc }}</div>
            </div>
          </div>
        </el-popover>
      </div>
    </div>
    <ImgPreview ref="ImgPreviewRef"></ImgPreview>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Aim, ZoomOut, ZoomIn, QuestionFilled } from '@element-plus/icons-vue'
import Avatar from './components/common/Avatar.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '@/api'
import MindMap from 'simple-mind-map'
import { getFileTypeIcon, getFileTypeConfig } from '@/utils'
import ImgPreview from './components/common/ImgPreview.vue'
import useFileHandle from '@/hooks/useFileHandle'
import Drag from 'simple-mind-map/src/plugins/Drag.js'
import Select from 'simple-mind-map/src/plugins/Select.js'
import { panoramaHelpList } from '@/constant'
import emitter from '@/utils/eventBus'

MindMap.usePlugin(Drag)
MindMap.usePlugin(Select)

const fileHandle = useFileHandle()

const getAllFolderTree = async () => {
  try {
    const { data } = await api.getAllFolderTree()
    initChart(data)
  } catch (error) {
    console.log(error)
  }
}

const reloadSidebarTree = () => {
  emitter.emit('reload_sidebar_tree')
}

const contentBodyRef = ref(null)
let mindMap = null
const ImgPreviewRef = ref(null)
let beingDragNode = null
const initChart = data => {
  data = transformData(data)
  mindMap = new MindMap({
    el: contentBodyRef.value,
    data: data[0],
    tagsColorMap: {
      文件夹: '#1ea59a'
    },
    initRootNodePosition: ['20%', 'center'],
    resetScaleOnMoveNodeToCenter: true,
    beforeTextEdit: node => {
      if (node.isRoot) {
        return false
      }
      return true
    },
    createNodePrefixContent: node => {
      const data = node.getData('_data')
      if (!data || data.folder) {
        return null
      }
      const el = document.createElement('div')
      const icon = document.createElement('span')
      icon.className = `iconfont ${getFileTypeIcon(data.type)}`
      icon.style.color = getFileTypeConfig(data.type).color
      icon.style.fontSize = '20px'
      el.style.cssText = `
        width: 25px;
        height: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        `
      el.appendChild(icon)
      return {
        el,
        width: 25,
        height: 25
      }
    },
    createNodePostfixContent: node => {
      const data = node.getData('_data')
      if (!data || data.folder) {
        return null
      }
      const el = document.createElement('div')
      // 编辑按钮
      const toEditIcon = document.createElement('span')
      toEditIcon.className = `iconfont icon-zhongmingming`
      toEditIcon.style.color = '#1ea59a'
      toEditIcon.style.fontSize = '16px'
      toEditIcon.addEventListener('click', () => {
        fileHandle.openEditPage(data.type, data.id)
      })
      el.style.cssText = `
        width: 25px;
        height: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        `
      el.appendChild(toEditIcon)
      return {
        el,
        width: 25,
        height: 25
      }
    },
    enableCtrlKeyNodeSelection: false,
    beforeDragEnd: async ({ overlapNodeUid, prevNodeUid, nextNodeUid }) => {
      try {
        if (beingDragNode && (overlapNodeUid || prevNodeUid || nextNodeUid)) {
          let parentId = ''
          if (overlapNodeUid) {
            // 作为子节点
            const targetNode = mindMap.renderer.findNodeByUid(overlapNodeUid)
            const targetNodeData = targetNode.getData('_data')
            if (targetNodeData.folder) {
              parentId = targetNodeData.id
            } else {
              ElMessage.warning('无法移动到文件下')
              return true
            }
          } else if (prevNodeUid || nextNodeUid) {
            // 作为兄弟节点
            const targetNode = mindMap.renderer.findNodeByUid(
              prevNodeUid || nextNodeUid
            )
            const parentNode = targetNode.parent
            if (parentNode) {
              parentId = parentNode.getData('_data').id
            }
          }
          if (parentId) {
            const beingDragNodeData = beingDragNode.getData('_data')
            let tip = ''
            if (beingDragNodeData.folder) {
              // 移动文件夹
              await api.moveFolder({
                id: beingDragNodeData.id,
                newFolderId: parentId
              })
              tip = '文件夹移动成功'
            } else {
              // 移动文件
              await api.moveFile({
                ids: [beingDragNodeData.id],
                newFolderId: parentId
              })
              tip = '文件移动成功'
            }
            ElMessage.success(tip)
            reloadSidebarTree()
          }
        }
      } catch (error) {
        console.log(error)
        return true
      }
    },
    beforeShortcutRun: (key, activeNodes) => {
      if (key === 'Control+v') {
        const node = activeNodes[0]
        if (node) {
          const { folder } = node.getData('_data')
          if (!folder) {
            return true
          }
        }
      }
    },
    disabledPasteUserClipboardData: true
  })
  mindMap.select.unBindEvent()
  mindMap.keyCommand.removeShortcut('Tab')
  mindMap.keyCommand.removeShortcut('Enter')
  mindMap.keyCommand.removeShortcut('Del|Backspace')
  mindMap.keyCommand.addShortcut('Del|Backspace', () => {
    const activeNodes = mindMap.renderer.activeNodeList
    if (activeNodes.length > 0) {
      const node = activeNodes[0]
      const { id, name, folder } = node.getData('_data')
      ElMessageBox.confirm(
        `是否确认删除【${name}】？`,
        `删除文件${folder ? '夹' : ''}`,
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async () => {
        try {
          if (folder) {
            await api.deleteFolder({
              id
            })
          } else {
            await api.deleteFile({
              ids: [id]
            })
          }
          mindMap.execCommand('REMOVE_NODE')
          reloadSidebarTree()
          ElMessage.success('删除成功')
        } catch (error) {
          console.log(error)
        }
      })
    }
  })
  mindMap.on('node_dragging', node => {
    if (!beingDragNode) {
      beingDragNode = node
    }
  })
  mindMap.on('node_dragend', node => {
    beingDragNode = null
  })
  mindMap.on('data_change_detail', arr => {
    const moveOrCreateList = []
    const createUidList = []
    arr.forEach(async item => {
      if (item.action === 'update') {
        // 修改名称
        if (item.oldData.data.text !== item.data.data.text) {
          const name = item.data.data.text.trim()
          const { id, folder } = item.data.data._data
          let tip = ''
          if (folder) {
            tip = '文件夹名称修改成功'
            await api.updateFolder({
              id,
              name
            })
          } else {
            tip = '文件名称修改成功'
            await api.updateFile({
              id,
              name
            })
          }
          ElMessage.success(tip)
          reloadSidebarTree()
        }
        // 复制
        const newChildrenLength = item.data.children.length
        const lengthOffset = newChildrenLength - item.oldData.children.length
        if (lengthOffset > 0) {
          const newNodeData = item.data.children[newChildrenLength - 1]
          const { id, folder } = newNodeData.data._data
          moveOrCreateList.push({
            uid: newNodeData.data.uid,
            folderId: item.data.data._data.id,
            info: {
              id,
              folder
            }
          })
        }
      } else if (item.action === 'create') {
        createUidList.push(item.data.data.uid)
      }
    })
    if (createUidList.length <= 0) return
    moveOrCreateList.forEach(async item => {
      if (!createUidList.includes(item.uid)) {
        return
      }
      try {
        const { id, folder } = item.info
        if (folder) {
          await api.copyFolder({
            id,
            folderId: item.folderId
          })
        } else {
          await api.copyFile({
            ids: [id],
            newFolderId: item.folderId
          })
        }
        ElMessage.success('复制成功')
        reloadSidebarTree()
      } catch (error) {
        console.log(error)
      }
    })
  })
  mindMap.on('node_img_dblclick', (node, e) => {
    e.stopPropagation()
    e.preventDefault()
    ImgPreviewRef.value.show(node.nodeData.data.image)
  })
}

const reset = () => {
  if (mindMap) {
    mindMap.renderer.setRootNodeCenter()
  }
}
const zoomIn = () => {
  if (mindMap) {
    mindMap.view.enlarge()
  }
}
const zoomOut = () => {
  if (mindMap) {
    mindMap.view.narrow()
  }
}

const transformData = data => {
  const copyTree = (arr, isRoot) => {
    const newArr = []
    arr.forEach((item, index) => {
      const { children, ...rest } = item
      const newItem = {
        data: {
          _data: rest,
          text: rest.name
        }
      }
      if (rest.img) {
        newItem.data.image = rest.img
        newItem.data.imageSize = {
          width: 200,
          height: 100
        }
      }
      if (item.folder) {
        newItem.data.tag = ['文件夹']
        if (!isRoot) {
          newItem.data.borderWidth = 1
          newItem.data.borderColor = '#549688'
          newItem.data.fillColor = '#fff'
        }
      }
      if (item.children && item.children.length > 0) {
        newItem.children = copyTree(item.children)
      }
      newArr[index] = newItem
    })
    return newArr
  }
  return copyTree(data, true)
}

onMounted(() => {
  getAllFolderTree()
})

onBeforeUnmount(() => {
  if (mindMap) {
    mindMap.destroy()
  }
})
</script>

<style lang="less" scoped>
.panoramaContainer {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .header {
    height: 60px;
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
    padding: 20px;
    padding-top: 0;
    position: relative;

    .contentBody {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .toolsBtn {
      position: absolute;
      right: 40px;
      bottom: 40px;
      display: flex;
      align-items: center;
      height: 40px;
      background-color: #fff;
      box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.06);
      border: 1px solid rgba(0, 0, 0, 0.06);
      border-radius: 4px;
      padding: 0 12px;

      .btn {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        &:hover {
          background: #f3f5f9;
        }
      }
    }
  }
}

.helpList {
  .helpItem {
    margin-bottom: 12px;

    .title {
      font-weight: bold;
      margin-bottom: 8px;
    }

    .desc {
    }
  }
}
</style>

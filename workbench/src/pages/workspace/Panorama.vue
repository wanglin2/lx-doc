<template>
  <div class="panoramaContainer">
    <div class="header">
      <div class="headerLeft"></div>
      <div class="headerRight">
        <Avatar></Avatar>
      </div>
    </div>
    <div class="content">
      <div class="contentHeader"></div>
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
      </div>
    </div>
    <ImgPreview ref="ImgPreviewRef"></ImgPreview>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  watch,
  reactive,
  onUnmounted,
  onMounted,
  onBeforeUnmount
} from 'vue'
import { Search, Aim, ZoomOut, ZoomIn } from '@element-plus/icons-vue'
import Avatar from './components/common/Avatar.vue'
import { useStore } from '@/store'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '@/api'
import MindMap from 'simple-mind-map'
import { getFileTypeIcon, getFileTypeConfig } from '@/utils'
import ImgPreview from './components/common/ImgPreview.vue'

const getAllFolderTree = async () => {
  try {
    const { data } = await api.getAllFolderTree()
    initChart(data)
  } catch (error) {
    console.log(error)
  }
}

const contentBodyRef = ref(null)
let mindMap = null
const ImgPreviewRef = ref(null)
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
    createNodePrefixContent: node => {
      const data = node.getData('_data')
      console.log(data)
      if (!data || data.isFolder) {
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
    }
  })
  mindMap.keyCommand.removeShortcut('Tab')
  mindMap.keyCommand.removeShortcut('Enter')
  mindMap.keyCommand.removeShortcut('Del|Backspace')
  mindMap.on('data_change_detail', arr => {
    arr.forEach(async item => {
      if (item.action === 'update') {
        if (item.oldData.data.text !== item.data.data.text) {
          // 修改了名称
          const name = item.data.data.text.trim()
          const { id, isFolder } = item.data.data._data
          let tip = ''
          if (isFolder) {
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
        }
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
      if (item.isFolder) {
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
    padding: 20px;
    position: relative;

    .contentHeader {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }

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
</style>

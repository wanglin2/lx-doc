import api from '@/api'
import { useStore } from '@/store'
import { ElMessage } from 'element-plus'
import emitter from '@/utils/eventBus'

const useFileHandle = () => {
  const store = useStore()
  const isDev = process.env.NODE_ENV === 'development'
  const ip = '192.168.3.143'

  // 创建并打开新文件
  const createAndOpenNewFile = async type => {
    try {
      if (!store.currentFolder) {
        ElMessage.warning('获取文件夹信息失败')
        return
      }
      const { data } = await api.createFile({
        name: '未命名文件',
        folderId: store.currentFolder.id,
        type
      })
      emitter.emit('refresh_list')
      openEditPage(type, data.id)
    } catch (error) {
      console.log(error)
    }
  }

  // 打开编辑页面
  const openEditPage = (type, uid) => {
    let url = ''
    switch (type) {
      case 'whiteboard':
        localStorage.removeItem('excalidraw-state')
        localStorage.removeItem('excalidraw')
        url = (isDev ? `http://${ip}:3000/` : '../whiteboard/') + '?uid=' + uid
        break
      case 'mindMap':
        localStorage.removeItem('SIMPLE_MIND_MAP_DATA')
        url = (isDev ? `http://${ip}:8080/#/` : '../mind-map/#/') + uid
        break
      case 'process':
        url =
          (isDev ? `http://${ip}:8086/index.html` : '../flowchart/') +
          '?uid=' +
          uid
        break
      case 'markdown':
        url =
          (isDev ? `http://${ip}:3000/` : '../markdown-nice/') + '?uid=' + uid
        break
      case 'doc':
        url = (isDev ? `http://${ip}:8085/` : '../docs/') + '?uid=' + uid
        break
      case 'sheet':
        url = (isDev ? `http://${ip}:8083/` : '../sheet/') + '?uid=' + uid
        break
      case 'ppt':
        url = (isDev ? `http://${ip}:8084/` : '../PPTist/') + '?uid=' + uid
        break
      case 'bpmn':
        url = (isDev ? `http://${ip}:8082/#/bpmn/` : '../process/#/bpmn/') + uid
        break
      case 'resume':
        url = (isDev ? `http://${ip}:8088/` : '../resume/') + '?uid=' + uid
        break
      default:
        break
    }
    window.open(url)
  }

  return {
    createAndOpenNewFile,
    openEditPage
  }
}

export default useFileHandle

import { useRouter } from 'vue-router'
import api from '@/api'
import { useStore } from '@/store'
import { ElMessage } from 'element-plus'
import emitter from '@/utils/eventBus'
// import { openUrl } from '@/utils'

const useFileHandle = () => {
  const router = useRouter()
  const store = useStore()
  const isDev = process.env.NODE_ENV !== 'production'
  const ip = location.hostname

  // 获取编辑页面 URL
  const getEditPageUrl = (type, uid) => {
    let url = ''
    switch (type) {
      case 'mindMap':
        localStorage.removeItem('SIMPLE_MIND_MAP_DATA')
        url = (isDev ? `http://${ip}:9091/mind-map/` : '/mind-map/') + uid
        break
      case 'markdown':
        url = (isDev ? `http://${ip}:9092/markdown/` : '/markdown/') + uid
        break
      case 'doc':
        url = (isDev ? `http://${ip}:9093/doc/` : '/doc/') + uid
        break
      case 'sheet':
        url = (isDev ? `http://${ip}:9094/sheet/` : '/sheet/') + uid
        break
      case 'whiteboard':
        url = (isDev ? `http://${ip}:9095/whiteboard/` : '/whiteboard/') + uid
        break
      case 'ppt':
        url = (isDev ? `http://${ip}:9096/ppt/` : '/ppt/') + uid
        break
      case 'process':
        url = (isDev ? `http://${ip}:9097/index.html` : '/flowchart/') + uid
        break
      case 'bpmn':
        url = (isDev ? `http://${ip}:9098/bpmn/` : '/bpmn/') + uid
        break
      case 'note':
        url = (isDev ? `http://${ip}:9099/note/` : '/note/') + uid
        break
      // case 'resume':
      //   url = (isDev ? `http://${ip}:8088/` : '../resume/') + '?uid=' + uid
      //   break
      default:
        break
    }

    return url || null
  }

  // 创建并打开新文件
  const createAndOpenNewFile = async type => {
    try {
      if (!store.currentFolder) {
        ElMessage.warning('请先选择文件夹')
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
    let url = getEditPageUrl(type, uid)
    if (url) {
      // openUrl(url)
      router.push({ name: 'Preview', params: { type, uid } })
    }
  }

  return {
    getEditPageUrl,
    createAndOpenNewFile,
    openEditPage
  }
}

export default useFileHandle

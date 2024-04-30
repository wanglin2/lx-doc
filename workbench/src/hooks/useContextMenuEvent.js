import emitter from '@/utils/eventBus'
import { ref } from 'vue'

// 派发事件
export const emitContextmenuEvent = () => {
    emitter.emit('contextmenu')
}

// 文件夹、文件卡片的右键菜单
export const useCardContextMenu = () => {
  const menuListVisible = ref(false)

  const onContextmenu = () => {
    emitContextmenuEvent()
    menuListVisible.value = true
  }

  const hideContextmenu = () => {
    menuListVisible.value = false
  }
  emitter.on('contextmenu', hideContextmenu)

  const unBindContextmenuEvent = () => {
    emitter.off('contextmenu', hideContextmenu)
  }

  return {
    onContextmenu,
    menuListVisible,
    hideContextmenu,
    unBindContextmenuEvent
  }
}

// body右键菜单
export const useBodyContextmenu = () => {
  const onContextmenu = (e) => {
    e.preventDefault()
    emitContextmenuEvent()
  }
  document.body.addEventListener('contextmenu', onContextmenu)

  const unBindContextmenuEvent = () => {
    document.body.removeEventListener('contextmenu', onContextmenu)
  }

  return {
    unBindContextmenuEvent
  }
}

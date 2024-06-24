import React, { useEffect, useState, useRef, useCallback } from 'react'
import {
  exportToCanvas,
  exportToSvg,
  exportToBlob,
  exportToClipboard,
  Excalidraw,
  useHandleLibrary,
  MIME_TYPES,
  sceneCoordsToViewportCoords,
  viewportCoordsToSceneCoords,
  restoreElements,
  LiveCollaborationTrigger,
  MainMenu,
  Footer,
  Sidebar
} from '@excalidraw/excalidraw'
import './App.less'
import Header from '../header/Header'
import store from '@/store'
import { message } from 'antd'
import eventBus from '@/utils/eventBus'

function App() {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null)

  useHandleLibrary({ excalidrawAPI })

  // 数据回显
  const initialData = store.data.fileData.content
    ? { ...store.data.fileData.content, scrollToContent: true }
    : null

  // 数据改变
  let autoSaveTimer = null
  const onDataChange = (elements, state) => {
    store.methods.setAutoSaveStatus('wait')
    clearTimeout(autoSaveTimer)
    autoSaveTimer = setTimeout(() => {
      eventBus.emit('data_change')
    }, 3000)
  }

  // 左侧操作菜单侧边栏
  const renderMenu = () => {
    return (
      <MainMenu>
        <MainMenu.DefaultItems.LoadScene />
        <MainMenu.DefaultItems.SaveAsImage />
        <MainMenu.DefaultItems.Export />
        <MainMenu.DefaultItems.ClearCanvas />
        <MainMenu.Separator />
        <MainMenu.DefaultItems.ToggleTheme />
        <MainMenu.DefaultItems.ChangeCanvasBackground />
      </MainMenu>
    )
  }
  return (
    <div className="container">
      <Header excalidrawAPI={excalidrawAPI}></Header>
      <div className="content">
        <Excalidraw
          initialData={initialData}
          excalidrawAPI={api => setExcalidrawAPI(api)}
          langCode="zh-CN"
          onChange={onDataChange}
        >
          {renderMenu()}
        </Excalidraw>
      </div>
    </div>
  )
}

export default App

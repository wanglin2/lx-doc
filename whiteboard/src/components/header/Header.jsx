import { useEffect, useState, useRef, useCallback } from 'react'
import {
  LeftOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons'
import { Input, Button, message } from 'antd'
import './Header.less'
import store from '@/store'
import eventBus from '@/utils/eventBus'
import {
  exportToCanvas,
  exportToSvg,
  exportToBlob
} from '@excalidraw/excalidraw'
import api from '@/api'

const uploadFilesMap = {}
let isSaving = false
let hasWaitSaveTask = false

function Header({ excalidrawAPI }) {
  // 返回工作台
  const onBack = () => {
    router.push('/')
  }

  // 文件名
  const [fileName, setFileName] = useState(store.data.fileData.name)
  const onFileNameChange = e => {
    setFileName(e.target.value)
  }
  const onFileNameBlur = () => {
    const text = fileName.trim()
    if (text) {
      store.methods.updateFileData({
        name: text
      })
    }
  }

  // 文件内容
  const save = async () => {
    if (isSaving) {
      hasWaitSaveTask = true
      return
    }
    isSaving = true
    const files = excalidrawAPI?.getFiles()
    const tasks = []
    Object.keys(files).forEach(id => {
      const url = files[id].dataURL
      if (/^data:/.test(url)) {
        if (uploadFilesMap[id]) {
          files[id].dataURL = uploadFilesMap[id]
        } else {
          const task = new Promise(async resolve => {
            try {
              const { data } = await api.uploadImg(url)
              uploadFilesMap[id] = data
              files[id].dataURL = data
              resolve()
            } catch (err) {
              console.log(err)
              resolve()
            }
          })
          tasks.push(task)
        }
      }
    })
    await Promise.all(tasks)
    await store.methods.updateFileData({
      content: JSON.stringify({
        elements: excalidrawAPI?.getSceneElements(),
        files
      })
    })
    isSaving = false
    if (hasWaitSaveTask) {
      hasWaitSaveTask = false
      save()
    }
  }

  // 生成封面
  const createCover = async () => {
    try {
      const params = {
        elements: excalidrawAPI?.getSceneElements(),
        mimeType: 'image/png',
        appState: {
          ...excalidrawAPI?.getAppState()
        },
        files: excalidrawAPI?.getFiles()
      }
      const canvas = await exportToCanvas(params)
      const imgData = canvas.toDataURL()
      const { data } = await api.uploadImg({
        imgData
      })
      await store.methods.updateFileData({
        img: data
      })
      message.success('封面生成成功')
      // const img = new Image()
      // img.src = imgData
      // document.body.appendChild(img)
    } catch (error) {
      console.log(error)
    }
  }

  // 保存提示
  const getSaveTip = status => {
    switch (status) {
      case 'wait':
        return '有操作尚未保存'
      case 'ing':
        return '正在保存...'
      case 'fail':
        return '保存失败'
      case 'success':
        return '保存成功'
      default:
        return ''
    }
  }
  const [saveTip, setSaveTip] = useState(getSaveTip(store.data.autoSaveStatus))
  const [currentStatus, setCurrentStatus] = useState(store.data.autoSaveStatus)
  // 监听保存状态改变
  const onAutoSaveStatusChange = status => {
    setCurrentStatus(status)
    setSaveTip(getSaveTip(status))
  }
  const getTipIcon = () => {
    switch (currentStatus) {
      case 'wait':
        return <ExclamationCircleOutlined />
      case 'ing':
        return <LoadingOutlined />
      case 'fail':
        return <CloseCircleOutlined />
      case 'success':
        return <CheckCircleOutlined />
      default:
        return null
    }
  }

  useEffect(() => {
    eventBus.on('autoSaveStatusChange', onAutoSaveStatusChange)
    eventBus.on('data_change', save)
    return () => {
      eventBus.off('autoSaveStatusChange', onAutoSaveStatusChange)
      eventBus.off('data_change', save)
    }
  })

  return (
    <div className="header">
      <div className="left">
        <div className="backBtn" onClick={onBack}>
          <LeftOutlined />
        </div>
      </div>
      <div className="center">
        <Input
          placeholder="请输入文件名"
          style={{ width: '300px', textAlign: 'center' }}
          value={fileName}
          onChange={onFileNameChange}
          onBlur={onFileNameBlur}
        />
      </div>
      <div className="right">
        <div className="saveBox">
          <span className="saveTip">
            {getTipIcon()}
            <span className="text">{saveTip}</span>
          </span>
          <Button onClick={save}>保存</Button>
          <Button onClick={createCover} style={{ marginLeft: '12px' }}>
            生成封面
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Header

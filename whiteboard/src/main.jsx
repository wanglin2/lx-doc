import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/app/App'
import './index.less'
import store from '@/store'
import { message } from 'antd'

const render = () => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}

const init = async () => {
  const match = location.pathname.match(/^\/([^/]+)$/)
  console.log(match)
  if (!match) {
    message.error('页面参数有误')
    return
  }
  const id = match[1]
  try {
    const userInfo = await store.methods.getUserInfo()
    if (!userInfo) {
      location.href = '/login'
    }
  } catch (error) {
    console.log(error)
    location.href = '/login'
  }
  try {
    const fileData = await store.methods.getFileData(id)
    if (!fileData) {
      message.error('文件内容获取失败，请刷新重试')
    } else {
      render()
    }
  } catch (error) {
    console.log(error)
    message.error('文件内容获取失败，请刷新重试')
  }
}

init()

export const downloadFile = (data, fileName) => {
  // 创建下载链接
  const downloadUrl = URL.createObjectURL(data)
  // 创建 <a> 元素并设置属性
  const link = document.createElement('a')
  link.href = downloadUrl
  link.download = fileName
  // 模拟点击下载
  link.click()
}

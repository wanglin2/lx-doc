export const imgToDataURL = src => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    //如果图片设置需要跨域
    img.setAttribute('crossOrigin', 'anonymous')
    img.onload = () => {
      try {
        let canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        let ctx = canvas.getContext('2d')
        //图片绘制到canvas
        ctx.drawImage(img, 0, 0, img.width, img.height)
        resolve(canvas.toDataURL())
      } catch {
        reject(e)
      }
    }
    img.onerror = e => {
      reject(e)
    }
    img.src = src
  })
}

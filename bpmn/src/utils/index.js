// 文件下载方法
export const downloadFunc = (href, filename) => {
    if (href && filename) {
        let a = document.createElement("a");
        a.download = filename; //指定下载的文件名
        a.href = href; //  URL对象
        a.click(); // 模拟点击
        URL.revokeObjectURL(a.href); // 释放URL 对象
    }
}

// 根据所需类型进行转码并返回下载地址
export const setEncoded = (type, filename = "diagram", data) => {
    const encodedData = encodeURIComponent(data);
    return {
        filename: `${filename}.${type}`,
        href: `data:application/${type === "svg" ? "text/xml" : "bpmn20-xml"};charset=UTF-8,${encodedData}`,
        data: data
    };
}

/** 
     * @Author: 王林 
     * @Date: 2021-07-04 15:25:19 
     * @Desc:  svg转png
     */
export const svgToPng = (str, exportPadding = 0) => {
    return new Promise((resolve, reject) => {
        // 转换成blob数据
        let blob = new Blob([str], {
            type: 'image/svg+xml'
        })
        // 转换成data:url数据
        let svgUrl = URL.createObjectURL(blob)
        // 绘制到canvas上
        const img = new Image()
        // 跨域图片需要添加这个属性，否则画布被污染了无法导出图片
        img.setAttribute('crossOrigin', 'anonymous')
        img.onload = async () => {
            try {
                let canvas = document.createElement('canvas')
                canvas.width = img.width + exportPadding * 2
                canvas.height = img.height + exportPadding * 2
                let ctx = canvas.getContext('2d')
                // 图片绘制到canvas里
                ctx.drawImage(img, 0, 0, img.width, img.height, exportPadding, exportPadding, img.width, img.height)
                resolve(canvas.toDataURL())
            } catch (error) {
                reject(error)
            }
        }
        img.onerror = (e) => {
            reject(e)
        }
        img.src = svgUrl
    })
}

// 设置页面标题
export const setPageTitle = (title) => {
    title = title || 'Bpmn'
    document.title = title + '_理想文档'
  }
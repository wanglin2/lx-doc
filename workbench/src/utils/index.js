import config from '@/config'

// 平级数组转树
export const arrayToTree = (
  array,
  idProp = 'id',
  parentIdProp = 'parentId'
) => {
  const map = {}
  array.forEach(item => {
    const id = item[idProp]
    const parentId = item[parentIdProp]
    if (!map[id]) {
      map[id] = item
    }
    if (parentId) {
      if (!map[parentId]) {
        const par = array.find(item2 => {
          return item2[idProp] === parentId
        })
        map[parentId] = par
      }
      map[parentId].children = map[parentId].children || []
      map[parentId].children.push(item)
    }
  })
  return Object.keys(map)
    .filter(item => {
      return !map[item].parentId
    })
    .map(item => {
      return map[item]
    })
}

// 获取指定文件类型的图标
export const getFileTypeIcon = type => {
  const res = config.createTypeList.find(item => {
    return item.value === type
  })
  return res ? res.icon : ''
}

// 获取指定文件类型的类型名称
export const getFileTypeName = type => {
  const res = config.createTypeList.find(item => {
    return item.value === type
  })
  return res ? res.name : ''
}

// 获取指定文件类型的配置数据
export const getFileTypeConfig = type => {
  return config.createTypeList.find(item => {
    return item.value === type
  })
}

// 格式化时间
export const formatShowTime = t => {
  if (!t) return t
  let now = Date.now()
  let time = new Date(t).getTime()
  let hour = Math.floor((now - time) / 1000 / 60 / 60)
  let min = Math.floor((now - time) / 1000 / 60)
  let day = Math.floor(hour / 24)
  if (min <= 0) {
    return '刚刚'
  } else if (hour < 1) {
    return min + '分钟前'
  } else if (hour <= 24) {
    return hour + '小时前'
  } else if (hour <= 24 * 5) {
    return day + '天前'
  } else {
    return t
  }
}
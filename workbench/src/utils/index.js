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

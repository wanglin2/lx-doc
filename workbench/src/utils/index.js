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

// 校验用户名
export const validateAccount = (rule, value, callback) => {
  value = value.trim()
  if (value === '') {
    callback(new Error('请输入用户名'))
  } else if (!/^[a-zA-Z0-9]{2,20}/.test(value)) {
    callback(new Error('用户名长度2-20位，只能包含数字和字母'))
  } else {
    callback()
  }
}

// 校验输入的密码
export const validatePassword = (rule, value, callback) => {
  value = value.trim()
  if (value === '') {
    callback(new Error('请输入密码'))
  } else if (
    !/^(?![\da-z]+$)(?![\dA-Z]+$)(?![\d.!#$%^&*]+$)(?![a-zA-Z]+$)(?![a-z.!#$%^&*]+$)(?![A-Z.!#$%^&*]+$)[\da-zA-z.!#$%^&*]{8,16}/.test(
      value
    )
  ) {
    callback(
      new Error(
        '密码长度8-16位，必须包含数字、大写字母、小写字母、特殊字符（!#$%^&*）其中3种'
      )
    )
  } else {
    callback()
  }
}

// 校验再次输入的密码
export const getValidatePassword2Fn = getPassword => {
  return (rule, value, callback) => {
    value = value.trim()
    if (value === '') {
      callback(new Error('请再次输入密码'))
    } else if (value !== getPassword()) {
      callback(new Error('两次密码不一致'))
    } else {
      callback()
    }
  }
}

export const openUrl = (url) => {
  const a = document.createElement('a')
  a.href = url
  a.target = '_blank'
  a.click()
}
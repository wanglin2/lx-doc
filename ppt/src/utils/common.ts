import { padStart } from 'lodash'

/**
 * 补足数字位数
 * @param digit 数字
 * @param len 位数
 */
export const fillDigit = (digit: number, len: number) => {
  return padStart('' + digit, len, '0')
}

/**
 * 判断设备
 */
export const isPC = () => {
  return !navigator.userAgent.match(/(iPhone|iPod|iPad|Android|Mobile|BlackBerry|Symbian|Windows Phone)/i)
}

// 设置页面标题
export const setPageTitle = (title: string) => {
  title = title || '幻灯片'
  document.title = title + '_理想文档'
}
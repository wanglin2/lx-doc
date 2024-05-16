import axios from 'axios';
import { useStore } from '../store';
import bus from '../bus';

const isDev = process.env.NODE_ENV === 'development'
axios.defaults.baseURL = isDev ? `http://lxqnsys.com/board/api/dev` : '../board/api/v1';

/** 
 * @Author: 王林 
 * @Date: 2022-03-27 13:37:14 
 * @Desc: 获取用户信息 
 */
export const getUserInfo = () => {
    return axios.get(`/getUserInfo.php`);
}

/** 
 * @Author: 王林 
 * @Date: 2022-03-27 13:57:50 
 * @Desc: 获取文件数据 
 */
export const getFileData = (params) => {
    return axios.get(`/get.php`, {
        params
    });
}

/** 
 * @Author: 王林 
 * @Date: 2022-03-27 14:26:23 
 * @Desc: 保存文件数据 
 */
export const saveFileData = (data = {}) => {
    const store = useStore()
    let formData = new FormData()
    let _data = Object.assign({}, store.userFileData, data)
    Object.keys(_data).forEach((prop) => {
        formData.append(prop, _data[prop])
    })
    store.setUserFileData(_data)
    return axios.post('/update.php', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
}

// 保存到数据库
let timer = null
export const saveToUserFile = (dataStr) => {
    clearTimeout(timer)
    timer = setTimeout(async () => {
        try {
            let { data } = await saveFileData({
                data: dataStr
            })
            if (data.code === 0) {
                bus.emit('SAVE_STATUS_CHANGE', true)
            } else {
                bus.emit('SAVE_STATUS_CHANGE', false)
            }
        } catch (error) {
            console.log(error)
        }
    }, 500);
}
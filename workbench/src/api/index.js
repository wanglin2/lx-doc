import axios from 'axios';

const isDev = process.env.NODE_ENV === 'development'
axios.defaults.baseURL = isDev ? `http://lxqnsys.com/board/api/dev` : './api/v1';

const crateFormData = (data = {}) => {
    let formData = new FormData()
    Object.keys(data).forEach((key) => {
        formData.append(key, data[key])
    })
    return formData;
}

export default {
    // 退出登录
    logout() {
        return axios.get('/logout.php')
    },

    // 获取用户信息
    getUserInfo() {
        return axios.get(`/getUserInfo.php`);
    },

    // 创建文件
    createFile(data) {
        return axios.post('/create.php', crateFormData(data), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
    },

    // 更新文件
    updateFile(data) {
        return axios.post('/update.php', crateFormData(data), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
    },

    // 删除文件
    deleteFile(data) {
        return axios.post('/delete.php', crateFormData(data), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
    },

    // 获取文件数据
    getFile() {
        return axios.get(`/get.php`);
    },

    // 获取文件列表
    getFileList(params) {
        return axios.get(`/getList.php`, {
            params
        });
    },

    // 创建文件夹
    createFolder(data) {
        return axios.post('/createFolder.php', crateFormData(data), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
    },

    // 更新文件夹
    updateFolder(data) {
        return axios.post('/updateFolder.php', crateFormData(data), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
    },

    // 删除文件夹
    deleteFolder(data) {
        return axios.post('/deleteFolder.php', crateFormData(data), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
    },

    // 获取文件夹列表
    getFolderList(params) {
        return axios.get(`/getFolderList.php`, {
            params
        });
    },
}
import { createPinia, defineStore } from 'pinia'
import { getUserInfo, getFileData } from './api';

export const pinia = createPinia()

export const useStore = defineStore('main', {
    state: () => {
        return {
            userInfo: null,
            userFileData: null
        };
    },
    actions: {
        async getUserInfo() {
            try {
                if (this.userInfo) {
                    return this.userInfo;
                }
                let { data } = await getUserInfo()
                if (data.code === 0) {
                    this.userInfo = data.data
                    return data.data;
                }
            } catch (e) {
                console.log(e)
            }
        },

        async getUserFileData(uid) {
            try {
                let { data } = await getFileData({
                    uid
                })
                if (data.code === 0) {
                    this.setUserFileData(data.data)
                    return data.data;
                }
            } catch (e) {
                console.log(e)
            }
        },

        setUserFileData(data) {
            this.userFileData = data
        }
    }
})
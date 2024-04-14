import { createPinia, defineStore } from 'pinia'
import api from './api';

export const pinia = createPinia()

export const useStore = defineStore('main', {
    state: () => {
        return {
            userInfo: null
        };
    },
    actions: {
        async getUserInfo() {
            try {
                if (this.userInfo) {
                    return this.userInfo;
                }
                let { data } = await api.getUserInfo()
                if (data.code === 0) {
                    this.userInfo = data.data
                    return data.data;
                }
            } catch (e) {
                console.log(e)
            }
        }
    }
})
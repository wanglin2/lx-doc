<template>
  <div class="workspaceContainer">
    <Sidebar></Sidebar>
    <router-view></router-view>
    <NameEditDialog></NameEditDialog>
    <MoveDialog></MoveDialog>
  </div>
</template>

<script setup>
import { useStore } from '../../store'
import { useRouter } from 'vue-router'
import Sidebar from './components/sidebar/Sidebar.vue'
import NameEditDialog from './components/content/NameEditDialog.vue'
import MoveDialog from './components/content/MoveDialog.vue'
import { onUnmounted } from 'vue'
import { useBodyContextmenu } from '@/hooks/useContextMenuEvent'

const store = useStore()
const router = useRouter()

const init = async () => {
  try {
    // 没有获取到用户信息视为未登陆，跳转到登录页面
    const userInfo = await store.getUserInfo()
    if (!userInfo) {
      router.replace({
        name: 'Login'
      })
      return
    }
    try {
      await store.getUserConfig()
    } catch (error) {
      console.log(error)
    }
  } catch (error) {
    console.log(error)
    router.replace({
      name: 'Login'
    })
  }
}

init()

// 派发右键菜单事件
const { unBindContextmenuEvent } = useBodyContextmenu()
onUnmounted(() => {
  unBindContextmenuEvent()
})
</script>

<style lang="less" scoped>
.workspaceContainer {
  width: 100%;
  height: 100%;
  background-color: #f6f7f8;
  display: flex;
  overflow: hidden;
}
</style>

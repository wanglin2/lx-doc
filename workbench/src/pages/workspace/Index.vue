<template>
  <div class="workspaceContainer">
    <Sidebar></Sidebar>
    <Content></Content>
    <NameEditDialog></NameEditDialog>
    <MoveDialog></MoveDialog>
  </div>
</template>

<script setup>
import { useStore } from '../../store'
import { useRouter } from 'vue-router'
import Sidebar from './components/sidebar/Sidebar.vue'
import Content from './components/content/Content.vue'
import NameEditDialog from './components/content/NameEditDialog.vue'
import MoveDialog from './components/content/MoveDialog.vue'

const store = useStore()
const router = useRouter()

const init = () => {
  if (!store.userInfo) {
    router.replace({
      name: 'Login'
    })
  }
}

init()
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

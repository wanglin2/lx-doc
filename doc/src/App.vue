<template>
  <router-view></router-view>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useStore } from './store'

const store = useStore()
const router = useRouter()

const init = async () => {
  try {
    const taskList = [store.getUserInfo(), store.getUserConfig()]
    await Promise.all(taskList)
  } catch (error) {
    router.push('/error')
  }
}

init()
</script>

<style lang="less">
::-webkit-scrollbar {
  width: 4px;
  height: 5px;
}
::-webkit-scrollbar-thumb {
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 6px;
}
</style>

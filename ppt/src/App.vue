<template>
  <router-view></router-view>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useMainStore } from '@/store'

const store = useMainStore()
const router = useRouter()

const init = async () => {
  try {
    const taskList = [store.getUserInfo(), store.getUserConfig()]
    await Promise.all(taskList)
  } catch (error) {
    router.push('/login')
  }
}

init()
</script>

<style lang="scss"></style>

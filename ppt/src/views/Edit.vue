<template>
  <template v-if="load">
    <Screen v-if="screening" />
    <Editor v-else-if="_isPC" />
    <Mobile v-else />
  </template>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useScreenStore, useMainStore, useSlidesStore } from '@/store'
import { isPC } from '../utils/common'
import { useRoute } from 'vue-router'

import Editor from './Editor/index.vue'
import Screen from './Screen/index.vue'
import Mobile from './Mobile/index.vue'

const _isPC = isPC()

const route = useRoute()
const mainStore = useMainStore()
const slidesStore = useSlidesStore()
const { screening } = storeToRefs(useScreenStore())

onMounted(async () => {
  mainStore.setAvailableFonts()
})

// 文件内容
const getFileData = async () => {
  try {
    const res = await mainStore.getFileData(route.params.id)
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  getFileData()
})
</script>

<style lang="scss">
#app {
  height: 100%;
}
</style>
../utils/common

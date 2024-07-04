<template>
  <template v-if="load">
    <Screen v-if="screening" />
    <Editor v-else-if="_isPC" />
    <Mobile v-else />
  </template>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useScreenStore, useMainStore, useSlidesStore } from '@/store'
import { isPC } from '../utils/common'
import { useRoute } from 'vue-router'
import { slides as mockSlides } from '@/mocks/slides'
import { theme as mockTheme } from '@/mocks/theme'

import Editor from './Editor/index.vue'
import Screen from './Screen/index.vue'
import Mobile from './Mobile/index.vue'

const _isPC = isPC()

const route = useRoute()
const mainStore = useMainStore()
const slidesStore = useSlidesStore()
const { screening } = storeToRefs(useScreenStore())
const load = ref(false)

onMounted(async () => {
  mainStore.setAvailableFonts()
})

// 文件内容
const getFileData = async () => {
  try {
    const res = await mainStore.getFileData(route.params.id)
    if (res.content) {
      const data = JSON.parse(res.content)
      const { theme, slides } = data
      slidesStore.setTheme(theme)
      slidesStore.setSlides(slides)
    } else {
      slidesStore.setTheme(mockTheme)
      slidesStore.setSlides(mockSlides)
    }
    load.value = true
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

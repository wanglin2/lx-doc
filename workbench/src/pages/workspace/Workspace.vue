<template>
  <div>
    <SideBar :activeFolder="activeFolder" @changeFolder="onChangeFolder"></SideBar>
    <Content :activeFolder="activeFolder"></Content>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SideBar from './components/SideBar.vue';
import Content from './components/Content.vue';
import { useStore } from '../../store';
import { useRouter } from 'vue-router';

const store = useStore()
const router = useRouter()

const activeFolder = ref({
  id: 'default',
  name: '默认文件夹'
})

const init = async () => {
  await store.getUserInfo()
  if (!store.userInfo) {
    router.replace({
      name: 'Index'
    })
  }
}

const onChangeFolder= (item) => {
  activeFolder.value = item
}

init()
</script>

<style lang="less">
</style>

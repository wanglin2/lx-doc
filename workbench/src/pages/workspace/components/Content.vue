<template>
  <div class="ml-[280px] pt-[80px]">
    <Header></Header>
    <CreateTypeList :belong-id="activeFolder.id"></CreateTypeList>
    <FileList :name="activeFolder.name" :id="activeFolder.id"></FileList>
  </div>
</template>

<script setup lang="ts">
import Header from "./Header.vue";
import CreateTypeList from "./CreateTypeList.vue";
import FileList from "./FileList.vue";

defineProps<{
  activeFolder: {
    name: string,
    id: string | number
  }
}>()
</script>

<style lang="less" scoped>
</style>

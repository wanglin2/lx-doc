<template>
  <div class="typeFilterContainer">
    <el-popover
      v-model:visible="menuShow"
      placement="bottom-end"
      :width="160"
      trigger="click"
      popper-style="padding: 4px;"
    >
      <template #reference>
        <IconBtn icon="icon-guolv" :active="filterType !== 'all'"></IconBtn>
      </template>
      <Menu
        :showIcon="false"
        :showSelect="true"
        :selectValues="[filterType]"
        :list="menuList"
        @click="onMenuClick"
      ></Menu>
    </el-popover>
  </div>
</template>

<script setup>
import { reactive, computed, ref } from 'vue'
import IconBtn from '../common/IconBtn.vue'
import Menu from '../common/Menu.vue'
import config from '@/config'

const props = defineProps({
  filterType: {
    type: String,
    default: ''
  }
})
const emits = defineEmits(['change'])

const menuShow = ref(false)
const menuList = reactive([
  {
    name: '全部',
    value: 'all'
  },
  ...config.createTypeList
])

const onMenuClick = item => {
  emits('change', item.value)
  menuShow.value = false
}
</script>

<style lang="less" scoped></style>

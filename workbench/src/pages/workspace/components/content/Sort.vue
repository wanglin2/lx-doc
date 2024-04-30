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
        <IconBtn icon="icon-paixu" :active="isChanged"></IconBtn>
      </template>
      <Menu
        :showIcon="false"
        :showSelect="true"
        :selectValues="[sortField, sortType]"
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

const props = defineProps({
  sortField: {
    type: String,
    default: ''
  },
  sortType: {
    type: String,
    default: ''
  }
})
const emits = defineEmits(['changeField', 'changeType'])

const menuShow = ref(false)
const menuList = reactive([
  {
    name: '创建时间',
    value: 'createAt'
  },
  {
    name: '更新时间',
    value: 'updateAt'
  },
  {
    name: '名称',
    value: 'name'
  },
  {
    value: 'devider'
  },
  {
    name: '正序',
    value: 'asc'
  },
  {
    name: '倒序',
    value: 'desc'
  }
])
const isChanged = computed(() => {
  return props.sortField !== 'createAt' || props.sortType !== 'desc'
})

const onMenuClick = item => {
  if (['asc', 'desc'].includes(item.value)) {
    emits('changeType', item.value)
  } else {
    emits('changeField', item.value)
  }
  menuShow.value = false
}
</script>

<style lang="less" scoped></style>

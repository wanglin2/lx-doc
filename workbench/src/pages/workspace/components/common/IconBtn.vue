<template>
  <div class="iconBtnContainer" @click="onClick">
    <span class="iconfont" :class="[icon]"></span>
  </div>
</template>

<script setup>
const props = defineProps({
  icon: {
    type: String,
    default: ''
  }
})
const emits = defineEmits(['click'])

const onClick = () => {
    emits('click')
}
</script>

<style lang="less" scoped>
.iconBtnContainer {
  width: 32px;
  height: 32px;
  border: var(--el-border);
  border-color: var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: #fff;

  &:hover {
    background-color: var(--el-color-primary-light-9);
    border-color: var(--el-color-primary-light-7);
    outline: none;

    .iconfont {
      color: var(--el-color-primary);
    }
  }

  .iconfont {
    font-size: 20px;
    color: var(--el-text-color-regular);
  }
}
</style>

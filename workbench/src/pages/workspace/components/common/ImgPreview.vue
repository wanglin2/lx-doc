<template>
  <Teleport to="body">
    <div class="imgPreviewContainer" v-if="visible">
      <div class="mask"></div>
      <img :src="imgUrl" alt="" />
      <div class="closeBtn" @click="hide">
        <el-icon size="30" color="#fff"><CloseBold /></el-icon>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { CloseBold } from '@element-plus/icons-vue'

const visible = ref(false)
const imgUrl = ref('')

const show = img => {
  imgUrl.value = img
  visible.value = true
}
const hide = () => {
  visible.value = false
  imgUrl.value = ''
}

defineExpose({
  show,
  hide
})
</script>

<style lang="less" scoped>
.imgPreviewContainer {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;

  .mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
  }

  img {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .closeBtn {
    position: absolute;
    right: 20px;
    top: 20px;
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background-color: var(--theme-color);
    }
  }
}
</style>

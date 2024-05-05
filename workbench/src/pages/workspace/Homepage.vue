<template>
  <div class="homepageContainer">
    <div class="header">
      <div class="headerLeft"></div>
      <div class="headerRight">
        <Avatar></Avatar>
      </div>
    </div>
    <div class="content"></div>
  </div>
</template>

<script setup>
import { ref, computed, watch, reactive, onUnmounted } from 'vue'
import { Search, ArrowRight } from '@element-plus/icons-vue'
import Avatar from './components/common/Avatar.vue'
import { useStore } from '@/store'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '@/api'
import NoData from './components/common/NoData.vue'
import emitter from '@/utils/eventBus'
import IconBtn from './components/common/IconBtn.vue'
import View from './components/content/View.vue'
import useLayoutChange from '@/hooks/useLayoutChange'
</script>

<style lang="less" scoped>
.homepageContainer {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .header {
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    padding: 0 24px;

    .headerRight {
      display: flex;
      align-items: center;
    }
  }

  .content {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding-bottom: 20px;
  }
}
</style>

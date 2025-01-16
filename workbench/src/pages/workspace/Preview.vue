<template>
  <iframe class="iframe" :name="iframeName" :src="iframeUrl" frameborder="0" allow="*" loading="lazy" />
</template>

<script lang="js" setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import useFileHandle from '@/hooks/useFileHandle'

const { getEditPageUrl } = useFileHandle()
const router = useRouter()
const route = useRoute()

const iframeUrl = ref('')
const iframeName = computed(() => `${route.params.type}_${route.params.uid}`)

// 监听路由变化，更新 iframe 的 URL
watch(route, () => {
  iframeUrl.value = getEditPageUrl(route.params.type, route.params.uid)
}, { immediate: true })


// 处理消息
const handleMessage = (event) => {
  if (!iframeUrl.value.startsWith(event.origin)) return
  if (event.data === 'history-back') {
    router.back()
  }
}

// 初始化 iframe URL
onMounted(() => {
  // 监听来自 iframe 的消息
  window.addEventListener('message', handleMessage)
})


// 清理工作
onUnmounted(() => {
  window.removeEventListener('message', handleMessage)
})


// onBeforeRouteLeave(async (to, from) => {
//   return ElMessageBox.confirm(`系统可能不会保存您所做的更改。`, '警告', {
//     confirmButtonText: '确认',
//     cancelButtonText: '取消',
//     type: 'warning'
//   }).then(async () => {
//     return true
//   }, () => {
//     return false
//   })
// })
</script>

<style scoped>
/* 添加一些样式以改善 iframe 的外观 */
.iframe {
  display: block;
  border: none;
  width: 100%;
  height: 100%;
}
</style>

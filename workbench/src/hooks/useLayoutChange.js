import { computed } from 'vue'
import { useStore } from '@/store'
import api from '@/api'
import { ElMessage } from 'element-plus'

const useLayoutChange = () => {
  const store = useStore()

  const currentLayoutType = computed(() => {
    return store.userConfig?.layoutType
  })

  const toggleLayoutType = async () => {
    try {
      await store.updateUserConfig({
        layoutType: currentLayoutType.value === 'grid' ? 'list' : 'grid'
      })
    } catch (error) {
      ElMessage.error('切换失败，请重试')
    }
  }

  return {
    currentLayoutType,
    toggleLayoutType
  }
}

export default useLayoutChange

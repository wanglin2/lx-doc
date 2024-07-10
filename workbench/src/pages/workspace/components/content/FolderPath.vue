<template>
  <div class="folderPathContainer">
    <div class="folderPath">
      <template v-for="item in showPathList" :key="item.id">
        <div v-if="item.isFold" class="foldBox">
          <el-popover placement="bottom-start" :width="300" trigger="click">
            <template #reference>
              <div class="foldBtn">
                <el-icon><MoreFilled /></el-icon>
                <el-icon class="icon"><ArrowRight /></el-icon>
              </div>
            </template>
            <div class="foldList">
              <div
                class="foldItem"
                v-for="subItem in item.list"
                :key="subItem.id"
                @click="onClick(subItem)"
              >
                {{ subItem.name }}
              </div>
            </div>
          </el-popover>
        </div>
        <div
          v-else
          class="folderItem"
          :class="{
            isCurrent: current && current.id === item.id
          }"
          @click="onClick(item)"
        >
          <span class="name">{{ item.name }}</span>
          <el-icon class="icon"><ArrowRight /></el-icon>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { useStore } from '@/store'
import { MoreFilled, ArrowRight } from '@element-plus/icons-vue'

const store = useStore()

const props = defineProps({
  pathList: {
    type: Array,
    default() {
      return []
    }
  },
  current: {
    type: Object,
    default: null
  }
})
const emits = defineEmits(['click'])

const showPathList = computed(() => {
  if (props.pathList.length <= 4) return props.pathList
  const res = [props.pathList[0]]
  res.push({
    isFold: true,
    list: props.pathList.slice(1, -2)
  })
  res.push(...props.pathList.slice(-2))
  return res
})

// 文件夹路径点击
const onClick = folder => {
  emits('click', folder)
}
</script>

<style lang="less" scoped>
.folderPathContainer {
  .folderPath {
    display: flex;
    height: 40px;
    display: flex;
    align-items: center;

    .foldBox {
      .foldBtn {
        width: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666;
        cursor: pointer;

        .icon {
          color: #9aa5b8;
        }
      }
    }

    .folderItem {
      color: #9aa5b8;
      font-weight: 400;
      cursor: pointer;
      display: flex;
      align-items: center;
      user-select: none;

      &:hover {
        color: #212930;
      }

      .name {
        white-space: nowrap;
        max-width: 180px;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .icon {
        margin-top: 2px;
      }

      &.isCurrent {
        color: #212930;
        cursor: default;

        .icon {
          display: none;
        }
      }
    }
  }
}

.foldList {
  .foldItem {
    height: 30px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 30px;
    padding: 0 12px;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      background-color: #f5f7fa;
    }
  }
}
</style>

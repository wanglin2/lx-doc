<template>
  <div
    class="listViewContainer"
    @contextmenu.stop.prevent="emitContextmenuEvent"
  >
    <el-table
      :data="list"
      style="width: 100%"
      empty-text="暂无数据"
      :row-style="{ cursor: 'pointer' }"
      @row-click="onTableRowClick"
    >
      <el-table-column label="文件名称" prop="name" min-width="200">
        <template #default="scope">
          <div class="fileNameBox">
            <div
              class="checkBox"
              v-if="showCheckbox && scope.row.type !== RESOURCE_TYPES.FOLDER"
              @click.stop
            >
              <el-checkbox
                v-model="scope.row.checked"
                :label="''"
                size="large"
              />
            </div>
            <span
              class="icon iconfont"
              :class="[
                scope.row.type === RESOURCE_TYPES.FOLDER
                  ? 'icon-wenjianjia'
                  : getFileTypeIcon(scope.row.type)
              ]"
              :style="{
                color:
                  scope.row.type === RESOURCE_TYPES.FOLDER
                    ? 'var(--folder-color)'
                    : getFileTypeConfig(scope.row.type)?.color
              }"
            ></span>
            <span class="name" :title="scope.row.name">{{
              scope.row.name
            }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80">
        <template #default="scope">
          <el-popover
            placement="bottom"
            :width="160"
            trigger="click"
            popper-style="padding: 4px;"
          >
            <template #reference>
              <div class="actionTriggerBtn" @click.stop>
                <span class="iconfont icon-icmore"></span>
              </div>
            </template>
            <Menu
              :list="getMenuList(scope.row)"
              @click="onMenuClick($event, scope.row)"
            ></Menu>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="type" width="120">
        <template #default="scope">
          <span>{{ getFileTypeName(scope.row.type) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createAt" width="200">
        <template #default="scope">
          <span>{{ formatShowTime(scope.row.createAt) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="updateAt" width="200">
        <template #default="scope">
          <span>{{ formatShowTime(scope.row.updateAt) }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import {
  getFileTypeIcon,
  getFileTypeName,
  getFileTypeConfig,
  formatShowTime
} from '@/utils'
import Menu from '../common/Menu.vue'
import { emitContextmenuEvent } from '@/hooks/useContextMenuEvent'
import { RESOURCE_TYPES } from '@/constant'

const props = defineProps({
  // 是否显示多选框
  showCheckbox: {
    type: Boolean,
    default: true
  },
  folderList: {
    type: Array,
    default() {
      return []
    }
  },
  fileList: {
    type: Array,
    default() {
      return []
    }
  },
  // 覆盖原有的菜单列表
  coverFileMenuList: {
    type: Array,
    default() {
      return []
    }
  },
  coverFolderMenuList: {
    type: Array,
    default() {
      return []
    }
  }
})
const emits = defineEmits(['folderClick', 'fileClick', 'actionClick'])

const list = computed(() => {
  return [
    ...props.folderList.map(item => {
      return {
        ...item,
        type: RESOURCE_TYPES.FOLDER
      }
    }),
    ...props.fileList
  ]
})
const menuList = [
  {
    name: '重命名',
    value: 'rename',
    icon: 'icon-zhongmingming'
  },
  {
    name: '复制/移动',
    value: 'copyOrMove',
    icon: 'icon-a-yidong2'
  },
  {
    name: '删除',
    value: 'delete',
    icon: 'icon-shanchu'
  }
]
const getMenuList = row => {
  if (row.type === RESOURCE_TYPES.FOLDER) {
    return props.coverFolderMenuList.length > 0
      ? [...props.coverFolderMenuList]
      : [...menuList]
  } else {
    return props.coverFileMenuList.length > 0
      ? [...props.coverFileMenuList]
      : [...menuList]
  }
}

// 表格行点击
const onTableRowClick = row => {
  if (row.type === RESOURCE_TYPES.FOLDER) {
    emits('folderClick', row)
  } else {
    emits('fileClick', row)
  }
}

// 操作点击
const onMenuClick = (action, data) => {
  const resourceType = data.type === RESOURCE_TYPES.FOLDER ? RESOURCE_TYPES.FOLDER : RESOURCE_TYPES.FILE
  emits(
    'actionClick',
    {
      action: action.value,
      data
    },
    resourceType
  )
  if (typeof action.onClick === 'function') {
    action.onClick(data, resourceType)
  }
}
</script>

<style lang="less" scoped>
.listViewContainer {
  width: 100%;

  .fileNameBox {
    width: 100%;
    display: flex;
    align-items: center;
    position: relative;

    .checkBox {
    }

    .icon {
      margin-right: 5px;
      font-size: 20px;
      flex-shrink: 0;
    }

    .name {
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .actionTriggerBtn {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>

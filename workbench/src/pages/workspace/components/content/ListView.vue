<template>
  <div class="listViewContainer">
    <el-table
      :data="list"
      style="width: 100%"
      empty-text="暂无数据"
      :row-style="{ cursor: 'pointer' }"
      @row-click="onTableRowClick"
    >
      <el-table-column label="文件名称" prop="name">
        <template #default="scope">
          <span
            class="icon iconfont"
            :class="[getFileTypeIcon(scope.row.type)]"
          ></span>
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="type">
        <template #default="scope">
          <span>{{ getFileTypeName(scope.row.type) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createAt" />
      <el-table-column label="更新时间" prop="updateAt" />
      <el-table-column label="操作" width="80">
        <template #default="scope">
          <div class="h-full flex items-center" @click.stop>
            <el-dropdown @command="handleCommand($event, scope.row)">
              <div
                class="iconBox rounded-[4px] bg-[rgba(0,0,0,.3)] w-[22px] h-[16px] flex justify-center items-center cursor-pointer"
              >
                <span
                  class="text-[18px] text-[#fff] iconfont icon-shenglvehao"
                ></span>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="rename">重命名</el-dropdown-item>
                  <el-dropdown-item command="clone">克隆</el-dropdown-item>
                  <el-dropdown-item command="move">移动</el-dropdown-item>
                  <el-dropdown-item command="delete" :divided="true"
                    >删除</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { getFileTypeIcon, getFileTypeName } from '@/utils'

const props = defineProps({
  list: {
    type: Array,
    default() {
      return []
    }
  }
})
const emits = defineEmits(['fileClick', 'operationClick'])

// 表格行点击
const onTableRowClick = row => {
  emits('fileClick', row)
}

// 操作
const handleCommand = (command, item) => {
  emits('operationClick', {
    command,
    item
  })
}
</script>

<style lang="less" scoped>
.listViewContainer {
  width: 100%;

  .icon {
    margin-right: 5px;
    font-size: 16px;
  }
}
</style>

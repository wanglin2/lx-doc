<template>
  <div
    class="folderItem flex justify-between items-center h-[36px] pl-[36px] pr-[8px] cursor-pointer rounded-[5px]"
    :class="{ active: active }"
    @click="handleClick"
  >
    <div class="text-[14px] text-[#1d2129]">{{ name }}</div>
    <div class="moreBtn flex-shrink-0 flex items-center" v-if="value !== 'default'">
      <el-dropdown @command="handleCommand">
        <span class="text-[14px] text-[#565d64] iconfont icon-shenglvehao"></span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="rename">重命名</el-dropdown-item>
            <el-dropdown-item command="delete" :divided="true">删除</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

defineProps<{
  name: string,
  value: string | number,
  active: boolean;
}>();

const emits = defineEmits(["rename", "delete", "click"]);

const handleCommand = (command: "rename" | "delete") => {
  emits(command);
};

const handleClick = () => {
  emits('click')
}
</script>

<style lang="less" scoped>
.folderItem {
  transition: all 0.3s;

  &:hover {
    background-color: #f7f7f7;
  }

  &.active {
    background-color: #f7f7f7;
  }
}
</style>

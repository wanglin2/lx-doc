<template>
  <div class="fileItem cursor-pointer w-[270px]" @click="handleClick">
    <div class="card relative h-[150px] rounded-[8px] overflow-hidden bg-[#f7f9fa] mb-[5px]">
      <div class="imgBox w-full h-full flex justify-center items-center">
        <img v-if="img && img !== 'null'" class="w-full h-full object-contain" :src="img" />
        <span v-else class="text-[#939aa8]">暂无封面</span>
      </div>
      <div class="moreBtn absolute right-[9px] top-[6px]" @click.stop>
        <el-dropdown @command="handleCommand">
          <div
            class="iconBox rounded-[4px] bg-[rgba(0,0,0,.3)] w-[22px] h-[16px] flex justify-center items-center"
          >
            <span class="text-[18px] text-[#fff] iconfont icon-shenglvehao"></span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="rename">重命名</el-dropdown-item>
              <el-dropdown-item command="clone">克隆</el-dropdown-item>
              <el-dropdown-item command="move">移动</el-dropdown-item>
              <el-dropdown-item command="delete" :divided="true">删除</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div class="flex">
      <span class="iconfont mr-[5px] text-[20px]" :class="[TYPE_ICON_MAP[type]]"></span>
      <div>
        <div class="text-[14px] text-[#1d2129]">{{ name }}</div>
        <div class="text-[12px] text-[#939aa8]">{{ showTime }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { TYPE_ICON_MAP } from '../constants';

const props = defineProps<{
  name: string;
  img: string | null;
  time: string;
  type: string;
}>();

const emits = defineEmits(["rename", "delete", "click", "move", "clone"]);

// 创建时间
const showTime = computed(() => {
  let now = Date.now()
  let time = new Date(props.time).getTime()
  let hour = Math.floor((now - time) / 1000 / 60 / 60)
  let min = Math.floor((now - time) / 1000 / 60)
  if (min <= 0) {
    return '刚刚';
  } else if (hour < 1) {  
    return min + '分钟前';
  } else if (hour <= 12) {
    return hour + '小时前';
  } else {
    return props.time;
  }
})

const handleCommand = (command: "rename" | "clone" | "move" | "delete") => {
  emits(command);
};

const handleClick = () => {
  emits("click");
};
</script>

<style lang="less" scoped>
.fileItem {
  transition: all 0.3s;

  .card {
    border: 1px solid #e5e5e5;

    .imgBox {
      transition: all 0.3s;
    }

    &:hover {
      .imgBox {
        transform: scale(1.1);
      }
    }

    .iconBox {
      &:hover {
        background-color: rgba(0, 0, 0, 0.5);
      }
    }
  }
}
</style>

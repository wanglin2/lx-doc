<template>
  <div class="menuListContainer" @click.stop>
    <template v-for="item in list">
      <div class="devider" v-if="item.value === 'devider'"></div>
      <div v-else class="menuItem" :key="item.value" @click="onClick(item)">
        <div class="selectIconBox" v-if="showSelect">
          <el-icon v-if="selectValues.includes(item.value)"><Select /></el-icon>
        </div>
        <span
          class="menuIcon iconfont"
          :class="[item.icon]"
          v-if="showIcon"
        ></span>
        <span class="menuText">{{ item.name }}</span>
      </div>
    </template>
  </div>
</template>

<script setup>
import { Select } from '@element-plus/icons-vue'

const props = defineProps({
  list: {
    type: Array,
    default() {
      return []
    }
  },
  showIcon: {
    type: Boolean,
    default: true
  },
  showSelect: {
    type: Boolean,
    default: false
  },
  selectValues: {
    type: Array,
    default() {
      return []
    }
  }
})
const emits = defineEmits(['click'])

const onClick = item => {
  emits('click', item)
}
</script>

<style lang="less" scoped>
.menuListContainer {
  width: 100%;

  .devider {
    width: 140px;
    height: 1px;
    background-color: #e9edf2;
    margin: 2px auto;
  }

  .menuItem {
    display: flex;
    align-items: center;
    height: 32px;
    cursor: pointer;
    border-radius: 5px;
    padding: 0 8px;

    &:hover {
      background: #f3f5f9;

      .menuText {
        color: #000;
      }
    }

    .selectIconBox {
      width: 30px;
    }

    .menuIcon {
      width: 24px;
      height: 24px;
      color: #212930;
      margin-right: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .menuText {
      color: #212930;
      font-size: 14px;
    }
  }
}
</style>

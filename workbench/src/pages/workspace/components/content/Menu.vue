<template>
  <div class="menuListContainer" @click.stop>
    <div
      class="menuItem"
      v-for="item in list"
      :key="item.value"
      @click="onClick(item)"
    >
      <span class="menuIcon iconfont" :class="[item.icon]"></span>
      <span class="menuText">{{ item.name }}</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  list: {
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

    .menuIcon {
      width: 24px;
      height: 24px;
      color: #212930;
      margin-right: 4px;
    }

    .menuText {
      color: #212930;
      font-size: 14px;
    }
  }
}
</style>

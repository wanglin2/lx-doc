<template>
  <div class="noDataContainer">
    <span class="emptyIcon iconfont icon-wushuju"></span>
    <div class="tip">
      <span class="addIcon iconfont icon-jia"></span>
      <div class="text">点击左上角「创建」吧</div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
.noDataContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: center;

  .emptyIcon {
    font-size: 100px;
  }

  .tip {
    display: flex;
    align-items: center;
    margin-top: 12px;
    display: flex;
    align-items: center;
    color: #212930;

    .addIcon {
      margin-right: 4px;
    }

    .text {
      
    }
  }
}
</style>

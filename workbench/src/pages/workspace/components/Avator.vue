<template>
  <div>
    <div class="navBox" @click.stop>
      <div class="avator" @click="showHideControl = !showHideControl">
        <img :src="userAvator" alt="" />
      </div>
      <div class="navList" v-if="showHideControl">
        <div class="navGroup">
          <div class="navItem">
            <a href="../" class="navItemContent">回到主站</a>
          </div>
          <div class="navItem">
            <a href="../content/wlmtplus/leavemessage/index.html" class="navItemContent">留言吐槽</a>
          </div>
        </div>
        <div class="navGroup">
          <div class="navItem" @click="logout">
            <a href="" @click.prevent class="navItemContent">退出登录</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onUnmounted, ref } from "vue";
import { useStore } from "../../../store";
import api from '../../../api';

const store = useStore();

const userAvator = computed(() => {
  return store.userInfo?.userimg;
})

// 退出登录
const logout = async () => {
  await api.logout();
  location.reload();
}

// 下拉菜单
const useDropdown = () => {
  const showHideControl = ref(false);

  const onHideClick = () => {
    showHideControl.value = false;
  };

  const showControl = () => {
    showHideControl.value = true;
  };

  document.addEventListener("click", onHideClick);

  const unbindEvent = () => {
    document.removeEventListener("click", onHideClick);
  };

  return {
    showHideControl,
    onHideClick,
    showControl,
    unbindEvent,
  };
};

const { showHideControl, onHideClick, showControl, unbindEvent } =
  useDropdown();
onUnmounted(() => {
  unbindEvent();
});
</script>

<style lang="less" scoped>
.navBox {
  position: relative;

  .avator {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }

    img {
      width: 100%;
    }
  }

  .navList {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 15px;
    list-style: none;
    width: 168px;
    font-size: 15px;
    color: #909090;
    white-space: nowrap;
    background-color: #fff;
    border: 1px solid hsla(217, 5%, 71%, 0.45);
    border-radius: 4px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);

    .navGroup {
      border-bottom: 1px solid rgba(0, 0, 0, 0.04);
      padding: 10px 0;

      .navItem {
        padding: 8px 0;
        cursor: pointer;

        &:hover {
          color: #333;
          background-color: hsla(0, 0%, 95%, 0.5);

          .navItemContent {
            color: #333;
          }
        }

        .navItemContent {
          display: block;
          padding: 0 15px;
          text-decoration: none;
          color: #909090;
          font-weight: bold;
          text-decoration: none;
        }
      }
    }
  }
}
</style>

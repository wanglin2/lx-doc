<template>
  <div class="loginContainer">
    <div class="infoBox">
      <div class="logoBox">
        <span class="logo">
          <img :src="config.logo" alt="" />
        </span>
        <span class="title">{{ config.name }}</span>
      </div>
      <img class="illustration" src="@/assets/img/login.png" alt="" />
    </div>
    <div class="formBox">
      <div class="formWrap">
        <div class="title">欢迎使用{{ config.name }}</div>
        <!-- 登录 -->
        <el-form :model="loginForm">
          <el-form-item label="">
            <el-input
              v-model="loginForm.name"
              placeholder="请输入用户名"
              style="height: 50px"
            />
          </el-form-item>
          <el-form-item label="">
            <el-input
              v-model="loginForm.password"
              placeholder="请输入密码"
              style="height: 50px"
            />
          </el-form-item>
        </el-form>
        <el-button type="primary" style="width: 100%; height: 50px">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import config from '@/config'

const currentTab = ref('login')

const loginForm = reactive({
  account: '',
  password: ''
})
</script>

<style lang="less" scoped>
.loginContainer {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .infoBox {
    width: 30%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: #eef1f3;

    .logoBox {
      display: flex;
      align-items: center;
      height: 100px;
      justify-content: center;

      .logo {
        width: 60px;
        margin-right: 10px;

        img {
          width: 100%;
        }
      }

      .title {
        font-size: 40px;
        font-weight: bold;
        color: var(--theme-color);
      }
    }

    .illustration {
      width: 70%;
    }
  }

  .formBox {
    width: 70%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .formWrap {
      width: 400px;

      .title {
        font-size: 30px;
        color: #212930;
        margin-bottom: 40px;
      }
    }
  }
}
</style>

<template>
  <div class="loginContainer">
    <div class="infoBox">
      <div class="logoBox">
        <span class="logo">
          <img :src="config.logo" alt="" />
        </span>
        <span class="title">{{ config.name }}</span>
      </div>
      <img class="illustration" src="@/assets/img/login.svg" alt="" />
    </div>
    <div class="formBox">
      <div class="formWrap">
        <div class="title">
          {{ isRegister ? '注册新账号' : `欢迎使用${config.name}` }}
        </div>
        <!-- 登录/注册 -->
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules">
          <el-form-item label="" prop="account">
            <el-input
              v-model="loginForm.account"
              placeholder="请输入用户名"
              style="height: 50px"
            />
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input
              v-model="loginForm.password"
              placeholder="请输入密码"
              style="height: 50px"
              show-password
            />
          </el-form-item>
          <el-form-item label="" prop="password2" v-if="isRegister">
            <el-input
              v-model="loginForm.password2"
              placeholder="请再次输入密码"
              style="height: 50px"
              show-password
            />
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          style="width: 100%; height: 50px"
          @click="confirm"
          >{{ isRegister ? '注册' : '登录' }}</el-button
        >
        <div class="btnBox">
          <div class="registerBtn" @click="changeToLogin" v-if="isRegister">
            已有账号？点此登录
          </div>
          <div class="registerBtn" @click="changeToRegister" v-else>
            没有账号？点此注册
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import config from '@/config'
import api from '@/api'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  validateAccount,
  validatePassword,
  getValidatePassword2Fn
} from '@/utils'
import { useStore } from '../../store'

const store = useStore()
const router = useRouter()

const init = async () => {
  try {
    // 获取到用户信息则视为已登陆，跳转到工作台页面
    const userInfo = await store.getUserInfo()
    if (userInfo) {
      router.replace('/')
      return
    }
  } catch (error) {
    console.log(error)
  }
}

init()

const loginFormRef = ref(null)
const loginForm = reactive({
  account: '',
  password: '',
  password2: ''
})
const validatePassword2 = getValidatePassword2Fn(() => {
  return loginForm.password.trim()
})
const loginRules = reactive({
  account: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { validator: validateAccount, trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { validator: validatePassword, trigger: 'blur' }
  ],
  password2: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validatePassword2, trigger: 'blur' }
  ]
})
const isRegister = ref(false)

const login = async () => {
  await api.login({
    account: loginForm.account.trim(),
    password: loginForm.password.trim()
  })
  ElMessage.success('登录成功')
  router.push({
    name: 'List'
  })
}

const register = async () => {
  await api.register({
    account: loginForm.account.trim(),
    password: loginForm.password.trim()
  })
  ElMessage.success('注册成功')
  changeToLogin()
}

const resetForm = () => {
  loginFormRef.value.resetFields()
}

const confirm = () => {
  loginFormRef.value.validate(async valid => {
    if (valid) {
      try {
        if (isRegister.value) {
          await register()
        } else {
          await login()
        }
      } catch (error) {
        console.log(error)
      }
    }
  })
}

const changeToRegister = () => {
  isRegister.value = true
  resetForm()
}

const changeToLogin = () => {
  isRegister.value = false
  resetForm()
}
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
      margin-bottom: 20px;

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

      /deep/ .el-form-item__error {
        white-space: nowrap;
      }

      .title {
        font-size: 30px;
        color: #212930;
        margin-bottom: 40px;
      }

      .btnBox {
        margin-top: 12px;

        .registerBtn {
          font-size: 12px;
          cursor: pointer;
          user-select: none;
        }
      }
    }
  }
}
</style>

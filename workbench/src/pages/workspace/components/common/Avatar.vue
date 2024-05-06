<template>
  <div class="avatarBox" @click.stop>
    <div class="avatarImgBox" @click="showHideControl = !showHideControl">
      <img :src="userAvatar" alt="" v-if="userAvatar" />
      <span v-else class="iconfont icon-denglu-copy"></span>
    </div>
    <div class="navList" v-if="showHideControl">
      <div class="navGroup">
        <div class="navItem" @click="toHomepage">
          <a href="" @click.prevent class="navItemContent">个人主页</a>
        </div>
        <div class="navItem" @click="changePassword">
          <a href="" @click.prevent class="navItemContent">修改密码</a>
        </div>
      </div>
      <div class="navGroup">
        <div class="navItem" @click="logout">
          <a href="" @click.prevent class="navItemContent">退出登录</a>
        </div>
      </div>
    </div>
    <el-dialog
      v-model="changePasswordDialogVisible"
      :align-center="true"
      title="修改密码"
      width="400"
    >
      <el-form
        ref="changePasswordFormRef"
        :model="changePasswordForm"
        :rules="changePasswordFormRules"
        label-position="top"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input
            v-model="changePasswordForm.oldPassword"
            placeholder="请输入原密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="changePasswordForm.newPassword"
            placeholder="请输入新密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="再次输入新密码" prop="newPassword2">
          <el-input
            v-model="changePasswordForm.newPassword2"
            placeholder="请再次输入新密码"
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialogFooter">
          <el-button @click="cancelChangePassword">取消</el-button>
          <el-button type="primary" @click="confirmChangePassword"
            >确定</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onUnmounted, reactive, ref } from 'vue'
import { useStore } from '@/store'
import api from '@/api'
import { useRouter } from 'vue-router'
import { validatePassword, getValidatePassword2Fn } from '@/utils'
import { ElMessage } from 'element-plus'

const store = useStore()
const router = useRouter()

const userAvatar = computed(() => {
  return store.userInfo?.avatar
})

// 去我的主页
const toHomepage = () => {
  router.push({
    name: 'Homepage'
  })
}

// 退出登录
const logout = async () => {
  await api.logout()
  location.reload()
}

// 下拉菜单
const useDropdown = () => {
  const showHideControl = ref(false)

  const onHideClick = () => {
    showHideControl.value = false
  }

  const showControl = () => {
    showHideControl.value = true
  }

  document.addEventListener('click', onHideClick)

  const unbindEvent = () => {
    document.removeEventListener('click', onHideClick)
  }

  return {
    showHideControl,
    onHideClick,
    showControl,
    unbindEvent
  }
}

const { showHideControl, onHideClick, showControl, unbindEvent } = useDropdown()

// 修改密码
const changePasswordFormRef = ref(null)
const changePasswordDialogVisible = ref(false)
const changePasswordForm = reactive({
  oldPassword: '',
  newPassword: '',
  newPassword2: ''
})
const validatePassword2 = getValidatePassword2Fn(() => {
  return changePasswordForm.newPassword.trim()
})
const changePasswordFormRules = reactive({
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    { validator: validatePassword, trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { validator: validatePassword, trigger: 'blur' }
  ],
  newPassword2: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    { validator: validatePassword2, trigger: 'blur' }
  ]
})
const changePassword = () => {
  changePasswordDialogVisible.value = true
}
const confirmChangePassword = () => {
  changePasswordFormRef.value.validate(async valid => {
    if (valid) {
      try {
        await api.changePassword({
          oldPassword: changePasswordForm.oldPassword.trim(),
          newPassword: changePasswordForm.newPassword.trim()
        })
        ElMessage.success('修改成功，请重新登录')
        await api.logout()
        router.push({
          name: 'Login'
        })
      } catch (error) {
        console.log(error)
      }
    }
  })
}

const cancelChangePassword = () => {
  changePasswordDialogVisible.value = false
  changePasswordFormRef.value.resetFields()
}

onUnmounted(() => {
  unbindEvent()
})
</script>

<style lang="less" scoped>
.avatarBox {
  position: relative;
  z-index: 1999;

  .avatarImgBox {
    width: 32px;
    height: 32px;
    overflow: hidden;
    border: var(--el-border);
    border-color: var(--el-border-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: #fff;

    &:hover {
      background-color: var(--el-color-primary-light-9);
      border-color: var(--el-color-primary-light-7);
    }

    img {
      width: 28px;
      height: 28px;
      object-fit: cover;
      border-radius: 50%;
    }
  }

  .navList {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 15px;
    list-style: none;
    width: 120px;
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

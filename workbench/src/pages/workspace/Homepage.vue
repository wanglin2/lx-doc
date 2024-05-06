<template>
  <div class="homepageContainer">
    <div class="header">
      <div class="headerLeft"></div>
      <div class="headerRight">
        <Avatar></Avatar>
      </div>
    </div>
    <div class="content">
      <div class="infoBox" v-if="userInfo">
        <div class="avatarBox">
          <img :src="userInfo.avatar" alt="" v-if="userInfo.avatar" />
          <span v-else class="iconfont icon-denglu-copy"></span>
          <div class="changeBtn" @click="onChangeAvatar">修改头像</div>
        </div>
        <div class="userNameBox">{{ userInfo.userName }}</div>
        <div class="infoList">
          <div class="infoItem">
            <div class="left">
              <div class="name">昵称：</div>
              <div class="value" v-if="!form.isEditUserName">
                {{ userInfo.userName }}
              </div>
              <el-input v-if="form.isEditUserName" v-model="form.userName" />
            </div>
            <div class="right">
              <el-button @click="onUpdateUserName" v-if="!form.isEditUserName"
                >修改</el-button
              >
              <el-button
                type="primary"
                @click="confirmUpdateUserName"
                v-if="form.isEditUserName"
                >确定</el-button
              >
              <el-button
                type="danger"
                @click="cancelUpdateUserName"
                v-if="form.isEditUserName"
                >取消</el-button
              >
            </div>
          </div>
          <div class="infoItem">
            <div class="left">
              <div class="name">账号：</div>
              <div class="value">{{ userInfo.account }}</div>
            </div>
          </div>
          <div class="infoItem">
            <div class="left">
              <div class="name">注册时间：</div>
              <div class="value">{{ userInfo.createAt }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      v-model="avatarUploadDialogVisible"
      :align-center="true"
      title="上传头像"
      width="800"
    >
      <div class="cropperBox">
        <ImgCutter
          ref="imgCutterRef"
          label="选择本地图片"
          fileType="jpeg"
          :DoNotDisplayCopyright="true"
          :crossOrigin="true"
          crossOriginHeader="*"
          rate="1:1"
          :tool="false"
          :isModal="false"
          :showChooseBtn="true"
          :lockScroll="true"
          :boxWidth="775"
          :boxHeight="458"
          :cutWidth="250"
          :cutHeight="250"
          :toolBoxOverflow="false"
          @cutDown="onImgSelectSuccess"
        >
        </ImgCutter>
      </div>
      <template #footer>
        <div class="dialogFooter">
          <el-button @click="cancelChangeAvatar">取消</el-button>
          <el-button type="primary" @click="confirmChangeAvatar">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch, reactive, onUnmounted } from 'vue'
import Avatar from './components/common/Avatar.vue'
import { useStore } from '@/store'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '@/api'
import emitter from '@/utils/eventBus'
import ImgCutter from 'vue-img-cutter'

const store = useStore()

const userInfo = computed(() => {
  return store.userInfo
})

const form = reactive({
  userName: '',
  isEditUserName: false
})

// 修改头像
const imgCutterRef = ref(null)
const avatarUploadDialogVisible = ref(false)
const onChangeAvatar = () => {
  avatarUploadDialogVisible.value = true
}
const onImgSelectSuccess = async res => {
  console.log(res)
  const img = new Image()
  img.src = res.dataURL
  document.body.appendChild(img)
  try {
    const formData = new FormData()
    formData.append('file', res.file)
    const { data } = await api.uploadFiles(formData)
    await api.updateUserInfo({
      avatar: data[0]
    })
    store.userInfo.avatar = data[0]
    cancelChangeAvatar()
    ElMessage.success('修改成功')
  } catch (error) {
    console.log(error)
  }
}
const confirmChangeAvatar = () => {
  imgCutterRef.value.cropPicture(false)
}
const cancelChangeAvatar = () => {
  avatarUploadDialogVisible.value = false
  imgCutterRef.value.handleClose()
}

// 用户名修改
const onUpdateUserName = () => {
  form.userName = userInfo.value.userName
  form.isEditUserName = true
}
const confirmUpdateUserName = async () => {
  try {
    const name = form.userName.trim()
    if (!name) {
      ElMessage.warning('请输入昵称')
      return
    }
    await api.updateUserInfo({
      userName: name
    })
    store.userInfo.userName = name
    cancelUpdateUserName()
    ElMessage.success('修改成功')
  } catch (error) {
    console.log(error)
  }
}
const cancelUpdateUserName = () => {
  form.isEditUserName = false
  form.userName = ''
}
</script>

<style lang="less" scoped>
.homepageContainer {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .header {
    width: 100%;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    padding: 0 24px;

    .headerRight {
      display: flex;
      align-items: center;
    }
  }

  .content {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: 20px;
    max-width: 800px;

    .infoBox {
      padding: 20px;
      overflow-y: auto;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .avatarBox {
        width: 100px;
        height: 100px;
        overflow: hidden;
        border: var(--el-border);
        border-color: var(--el-border-color);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        background-color: #fff;
        position: relative;

        &:hover {
          background-color: var(--el-color-primary-light-9);
          border-color: var(--el-color-primary-light-7);

          .changeBtn {
            top: 0;
          }
        }

        img {
          width: 95px;
          height: 95px;
          object-fit: cover;
          border-radius: 50%;
        }

        span {
          font-size: 50px;
        }

        .changeBtn {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          top: 100%;
          transition: all 0.3s;
        }
      }

      .userNameBox {
        margin-top: 20px;
        font-size: 20px;
      }

      .infoList {
        margin-top: 20px;
        width: 80%;

        .infoItem {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 40px;

          .left {
            display: flex;
            align-items: center;
            color: #666;
            font-size: 14px;

            .name {
              width: 90px;
            }

            .value {
            }
          }

          .right {
          }
        }
      }
    }
  }
}

.cropperBox {
  /deep/ .i-dialog-footer {
    display: none;
  }
}
</style>

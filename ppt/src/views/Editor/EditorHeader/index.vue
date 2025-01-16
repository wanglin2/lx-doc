<template>
  <div class="editor-header">
    <div class="left">
      <div class="menu-item" @click="onBack"><IconLeft class="icon" /></div>
      <Popover
        trigger="click"
        placement="bottom-start"
        v-model:value="mainMenuVisible"
      >
        <template #content>
          <FileInput accept=".pptist" @change="onImportPptist">
            <PopoverMenuItem>导入 pptist 文件</PopoverMenuItem>
          </FileInput>
          <FileInput
            accept="application/vnd.openxmlformats-officedocument.presentationml.presentation"
            @change="onImportPptx"
          >
            <PopoverMenuItem>导入 pptx 文件（测试版）</PopoverMenuItem>
          </FileInput>
          <PopoverMenuItem @click="setDialogForExport('pptx')"
            >导出文件</PopoverMenuItem
          >
          <PopoverMenuItem @click="onResetPpt">重置幻灯片</PopoverMenuItem>
          <PopoverMenuItem @click="onShowShortcutkeys">快捷键</PopoverMenuItem>
        </template>
        <div class="menu-item"><IconHamburgerButton class="icon" /></div>
      </Popover>

      <div class="title">
        <Input
          class="title-input"
          ref="titleInputRef"
          v-model:value="titleValue"
          @blur="handleUpdateTitle()"
          v-if="editingTitle"
        ></Input>
        <div
          class="title-text"
          @click="startEditTitle()"
          :title="fileName"
          v-else
        >
          {{ fileName }}
        </div>
      </div>
    </div>

    <div class="right">
      <div class="saveBox">
        <span class="saveTip">
          <component
            :is="saveTipIcon"
            style="color: #333"
            :class="[saveTipIconIsLoading ? 'is-loading' : '']"
          ></component>
          <span class="text">{{ saveTip }}</span>
        </span>
        <Button size="small" @click="save">保存</Button>
      </div>
      <div class="group-menu-item">
        <div
          class="menu-item"
          v-tooltip="'幻灯片放映'"
          @click="enterScreening()"
        >
          <IconPpt class="icon" />
        </div>
        <Popover trigger="click" center>
          <template #content>
            <PopoverMenuItem @click="enterScreeningFromStart()"
              >从头开始</PopoverMenuItem
            >
            <PopoverMenuItem @click="enterScreening()"
              >从当前页开始</PopoverMenuItem
            >
          </template>
          <div class="arrow-btn"><IconDown class="arrow" /></div>
        </Popover>
      </div>
      <div
        class="menu-item"
        v-tooltip="'导出'"
        @click="setDialogForExport('pptx')"
      >
        <IconDownload class="icon" />
      </div>
    </div>

    <Drawer
      :width="320"
      v-model:visible="hotkeyDrawerVisible"
      placement="right"
    >
      <HotkeyDoc />
    </Drawer>

    <FullscreenSpin :loading="exporting" tip="正在导入..." />
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref, watch, computed } from 'vue'
import { useMainStore, useSlidesStore } from '@/store'
import useScreening from '@/hooks/useScreening'
import useImport from '@/hooks/useImport'
import useSlideHandler from '@/hooks/useSlideHandler'
import type { DialogForExportTypes } from '@/types/export'
import { useRoute, useRouter } from 'vue-router'
import Button from '@/components/Button.vue'

import HotkeyDoc from './HotkeyDoc.vue'
import FileInput from '@/components/FileInput.vue'
import FullscreenSpin from '@/components/FullscreenSpin.vue'
import Drawer from '@/components/Drawer.vue'
import Input from '@/components/Input.vue'
import Popover from '@/components/Popover.vue'
import PopoverMenuItem from '@/components/PopoverMenuItem.vue'

const route = useRoute()
const router = useRouter()
const mainStore = useMainStore()
const slidesStore = useSlidesStore()
const { enterScreening, enterScreeningFromStart } = useScreening()
const { importSpecificFile, importPPTXFile, exporting } = useImport()
const { resetSlides } = useSlideHandler()

const mainMenuVisible = ref(false)
const hotkeyDrawerVisible = ref(false)
const editingTitle = ref(false)
const titleInputRef = ref<InstanceType<typeof Input>>()
const titleValue = ref('')

const onBack = async () => {
  if (window.top !== window.self && window.parent) {
    // 如果是 iframe 中运行，通知上层 window 后退
    if (mainStore.autoSaveStatus !== 'success') {
      const answer = window.confirm('系统可能不会保存您所做的更改。')
      if (!answer) return false
    }
    try {
      window.parent.history.back()
    } catch (e) {
      window.parent.postMessage('history-back', '*')
    }
  } else {
    // 如果是新窗口打开，跳到工作台标签页并且关闭当前标签页
    const href = process.env.NODE_ENV === 'production' ? '/' : 'http://' + location.hostname + ':9090'
    const workspaceWindow = window.open(href, 'lx-doc')
    if (window !== workspaceWindow) {
      window.close()
    }
  }
}

const fileName = ref('')
watch(
  () => {
    return mainStore.fileData
  },
  val => {
    if (val && val.name) {
      fileName.value = val.name
    }
  },
  {
    deep: true,
    immediate: true
  }
)

const startEditTitle = () => {
  titleValue.value = fileName.value
  editingTitle.value = true
  nextTick(() => titleInputRef.value?.focus())
}

const handleUpdateTitle = () => {
  const text = titleValue.value.trim()
  if (text) {
    mainStore.updateFileData({
      name: text
    })
  }
  editingTitle.value = false
}

// 保存
const autoSaveTimer = ref<null | number>(null)
const saveTipIcon = computed(() => {
  switch (mainStore.autoSaveStatus) {
    case 'wait':
      return 'IconAttention'
    case 'ing':
      return 'IconLoading'
    case 'fail':
      return 'IconCloseOne'
    case 'success':
      return 'IconCheckOne'
    default:
      return ''
  }
})
const saveTipIconIsLoading = computed(() => {
  return mainStore.autoSaveStatus === 'ing'
})
const saveTip = computed(() => {
  switch (mainStore.autoSaveStatus) {
    case 'wait':
      return '有操作尚未保存'
    case 'ing':
      return '正在保存...'
    case 'fail':
      return '保存失败'
    case 'success':
      return '保存成功'
    default:
      return ''
  }
})
const save = async () => {
  try {
    const content = {
      slides: slidesStore.slides,
      theme: slidesStore.theme
    }
    mainStore.updateFileData({
      content: JSON.stringify(content)
    })
  } catch (error) {
    mainStore.setAutoSaveStatus('fail')
  }
}
const onChange = () => {
  mainStore.setAutoSaveStatus('wait')
  clearTimeout(autoSaveTimer.value)
  autoSaveTimer.value = setTimeout(() => {
    save()
  }, 3000)
}
watch(
  [
    () => {
      return slidesStore.theme
    },
    () => {
      return slidesStore.slides
    }
  ],
  () => {
    onChange()
  },
  {
    deep: true
  }
)

const setDialogForExport = (type: DialogForExportTypes) => {
  mainStore.setDialogForExport(type)
  mainMenuVisible.value = false
}

const onImportPptist = files => {
  importSpecificFile(files)
  mainMenuVisible.value = false
}

const onImportPptx = files => {
  importPPTXFile(files)
  mainMenuVisible.value = false
}

const onResetPpt = () => {
  resetSlides()
  mainMenuVisible.value = false
}

const onShowShortcutkeys = () => {
  mainMenuVisible.value = false
  hotkeyDrawerVisible.value = true
}

window.onbeforeunload = function () {
  if (mainStore.autoSaveStatus !== 'success') {
    return '存在未保存的数据'
  }
}
</script>

<style lang="scss" scoped>
.editor-header {
  background-color: #fff;
  user-select: none;
  border-bottom: 1px solid $borderColor;
  display: flex;
  justify-content: space-between;
  padding: 0 5px;
}
.left,
.right {
  display: flex;
  justify-content: center;
  align-items: center;

  .saveBox {
    display: flex;
    align-items: center;

    .saveTip {
      display: flex;
      align-items: center;
      margin-right: 4px;
      color: #333;

      .is-loading {
        animation: rotate 0.5s infinite linear;
      }

      .text {
        margin-left: 4px;
        font-size: 12px;
      }
    }
  }
}
@keyframes rotate {
  0% {
    transform: rotateZ(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
.menu-item {
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  padding: 0 10px;
  border-radius: $borderRadius;
  cursor: pointer;

  .icon {
    font-size: 18px;
    color: #666;
  }

  &:hover {
    background-color: #f1f1f1;
  }
}
.group-menu-item {
  height: 30px;
  display: flex;
  margin: 0 8px;
  padding: 0 2px;
  border-radius: $borderRadius;

  &:hover {
    background-color: #f1f1f1;
  }

  .menu-item {
    padding: 0 3px;
  }
  .arrow-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
}
.title {
  height: 32px;
  margin-left: 2px;
  font-size: 13px;

  .title-input {
    width: 200px;
    height: 100%;
    padding-left: 0;
    padding-right: 0;
  }
  .title-text {
    min-width: 20px;
    max-width: 400px;
    line-height: 32px;
    padding: 0 6px;
    border-radius: $borderRadius;
    cursor: pointer;

    @include ellipsis-oneline();

    &:hover {
      background-color: #f1f1f1;
    }
  }
}
.github-link {
  display: inline-block;
  height: 30px;
}
</style>

<template>
  <div class="flex flex-wrap mb-[30px]">
    <div
      v-for="(item, index) in typeList"
      :key="index"
      class="w-[155px] mr-[40px] mb-[10px]"
      @click="handleClick(item)"
    >
      <!-- 白板 -->
      <div
        class="card h-[115px] rounded-[8px] flex justify-center items-center cursor-pointer"
        :style="{
          backgroundColor: item.bgColor || '#3456ff',
        }"
        v-if="!item.img"
      >
        <span class="iconfont icon-tianjia text-[#fff] text-[40px]"></span>
      </div>
      <!-- 其他 -->
      <div
        class="card h-[115px] rounded-[8px] flex justify-center items-center cursor-pointer"
        :style="{
          backgroundColor: item.bgColor || '#f7f9fa',
        }"
        v-else
      >
        <img class="w-full h-full object-contain" :src="item.img" alt />
      </div>
      <div
        class="text-[#1d2129] text-[14px] h-[30px] flex justify-center items-center"
      >{{ item.name }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from "vue";
import mindImg from "../../../assets/img/mind.jpg";
import bpmnImg from "../../../assets/img/bpmn.png";
import markdownImg from "../../../assets/img/markdown.webp";
import sheetImg from "../../../assets/img/sheet.webp";
import pptImg from "../../../assets/img/ppt.webp";
import docImg from "../../../assets/img/doc.webp";
import processImg from '../../../assets/img/process.png';
import resumeImg from '../../../assets/img/resume.jpg';
import { ElMessage } from "element-plus";
import "element-plus/es/components/message/style/css";
import api from "../../../api";
import { useRouter } from 'vue-router';
import { openEditPage } from '../../../utils';
import emitter from '../../../utils/eventBus';

const router = useRouter()

const props = defineProps<{
  belongId: string | number;
}>();

interface FileItem {
  type: "whiteboard" | "mind" | "bpmn" | "markdown" | "sheet" | "ppt" | "doc" | "process" | "whiteboard2" | "resume";
  img: string;
  name: string;
  bgColor?: string;
  data?: any;
  cover?: string;
}

// 文件类型列表
const typeList = ref<FileItem[]>([
  {
    type: "whiteboard",
    img: "",
    name: "新建白板",
  },
  {
    type: "whiteboard2",
    img: "",
    name: "极简白板",
    bgColor: "rgb(107, 199, 219)",
  },
  {
    type: "mind",
    img: mindImg,
    name: "思维导图",
    bgColor: "rgb(248, 215, 49)",
  },
  {
    type: "doc",
    img: docImg,
    name: "文档",
    bgColor: '#fff'
  },
  {
    type: "sheet",
    img: sheetImg,
    name: "电子表格",
    bgColor: '#fff'
  },
  {
    type: "ppt",
    img: pptImg,
    name: "PPT",
    bgColor: '#fff'
  },
  {
    type: "process",
    img: processImg,
    name: "流程图",
    bgColor: '#f7f7f7'
  },
  {
    type: "markdown",
    img: markdownImg,
    name: "Markdown",
    bgColor: '#fff'
  },
  {
    type: "resume",
    img: resumeImg,
    name: "简历",
    bgColor: '#fff'
  },
  {
    type: "bpmn",
    img: bpmnImg,
    name: "BPMN",
  }
]);

// 发送创建文件请求
const create = async (item: FileItem, cb: (uid: string) => void, isClone: boolean = false) => {
  try {
    let formData: {
      type: string;
      name: string;
      belongId?: string;
      data?: any;
      cover?: string;
    } = {
      type: item.type,
      name: '未命名' + item.name
    }
    if (props.belongId) {
      formData.belongId = props.belongId + '';
    }
    // 克隆模式
    if (isClone) {
      formData.data = item.data;
      formData.name = '克隆' + item.name;
      formData.cover = item.cover;
    }
    let { data } = await api.createFile(formData);
    if (data.code === 0) {
      cb(data.data.uid);
    } else {
      ElMessage.error(data.msg);
    }
  } catch (e) {
    console.log(e);
    ElMessage.error("创建失败，请重试");
  }
};

// 创建文件
const handleClick = (item: FileItem) => {
  create(item, (uid) => {
    openEditPage(item.type, uid)
  });
};

// 复制文件
const cloneFile = (item) => {
  create(item, (uid) => {
    openEditPage(item.type, uid)
  }, true);
}

emitter.on('CLONE_FILE', cloneFile)

onUnmounted(() => {
  emitter.off('CLONE_FILE', cloneFile)
})
</script>

<style scoped lang="less">
.card {
  border: 1px solid #e5e5e5;

  &:hover {
    opacity: 0.9;
  }
}
</style>

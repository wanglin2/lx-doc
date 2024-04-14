<template>
  <div class="mainContainer w-[1200px]">
		<Header></Header>
    <Desc></Desc>
    <Block img="http://assets.lxqnsys.com/board.gif" title="在线白板" desc="手绘风格在线白板，一个可以无限往下滚动的无边界白板，支持常见形状、线段、文字、图片，以及自由书写，同时可设置丰富的样式，满足你的自由创作灵感。" style="margin-bottom: 150px;"></Block>
    <Block :reverse="true" img="http://assets.lxqnsys.com/board2.gif" title="思维导图" desc="一个简洁的思维导图，支持多种结构、内置多种主题、支持高度自定义，并且操作简单，给你一个纯粹的思维导图使用体验。" style="margin-bottom: 150px;"></Block>
    <Block img="http://assets.lxqnsys.com/board3.gif" title="BPMN" desc="BPMN标准的流程图，提供了任何人都可以容易理解的业务工作流的图形表示，有助于业务流程分析和业务流程改进。"></Block>
    <Footer></Footer>
	</div>
</template>

<script setup lang="ts">
import { useStore } from '../../store';
import { useRouter } from 'vue-router';
import Header from './components/Header.vue';
import Desc from './components/Desc.vue';
import Block from './components/Block.vue';
import Footer from './components/Footer.vue';

const store = useStore()
const router = useRouter()

const init = async () => {
  await store.getUserInfo()
  if (store.userInfo) {
    router.replace({
      name: 'Workspace'
    })
  }
}

init()
</script>

<style lang="less" scoped>
.mainContainer {
  margin: 0 auto;
}
</style>

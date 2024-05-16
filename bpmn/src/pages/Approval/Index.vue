<template>
  <div class="approve-container">
    <NodePanel :lf="lf"></NodePanel>
    <div ref="graph" class="viewport"></div>
    <PropertyPanel :lf="lf" :nodeData="nodeData" v-if="nodeData"></PropertyPanel>
    <Setting :lf="lf"></Setting>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import NodePanel from './components/NodePanel.vue';
import LogicFlow from '@logicflow/core';
import RegisteNode from './components/registerNode';
import { themeApprove, data } from './config';
import PropertyPanel from './components/PropertyPanel.vue';
import { ElMessage } from 'element-plus'
import Setting from './components/Setting.vue';

const config = {
  stopScrollGraph: true,
  stopZoomGraph: true,
  grid: {
    size: 10,
    visible: true,
    type: 'mesh',
    config: {
      color: '#DCDCDC',  // 设置网格的颜色
    }
  },
  keyboard: { enabled: true },
  style: themeApprove,
  edgeType: 'customPolylineEdge'
}

const nodeData = ref(null)
const graph = ref(null)
let lf = ref(null)

// 监听事件
const initEvent = (lf) => {
  lf.on('element:click', ({ data }) => {
    nodeData.value = data
    console.log(data);
  });
  lf.on('blank:click	', () => {
    nodeData.value = null
  })
  lf.on('connection:not-allowed', (data) => {
    ElMessage.error(data.msg);
  });
}

onMounted(() => {
  lf.value = new LogicFlow({
    ...config,
    container: graph.value
  });
  RegisteNode(lf.value);
  lf.value.render(data);
  initEvent(lf.value);
})
</script>

<style lang="less" scoped>
.approve-container {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;

  .viewport {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>

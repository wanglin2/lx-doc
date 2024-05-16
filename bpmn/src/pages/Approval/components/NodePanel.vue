<template>
    <div class="node-panel">
        <div
            v-for="(item, index) in approveNodes"
            :className="[`approve-node node-${item.type}`]"
            :key="index"
        >
            <div class="node-shape" :style="{ ...item.style }" @mousedown="dragNode(item)"></div>
            <div class="node-label">{{ item.label }}</div>
        </div>
    </div>
</template>

<script setup>
import { approveNodes } from '../config';

const props = defineProps({
    lf: {
        type: Object
    }
})

// 拖拽创建
const dragNode = (item) => {
    props.lf.dnd.startDrag({
        type: item.type,
        text: item.label
    })
}
</script>

<style lang="less" scoped>
.node-panel {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 70px;
    padding: 20px 10px;
    background-color: white;
    box-shadow: 0 0 10px 1px rgb(228, 224, 219);
    border-radius: 6px;
    z-index: 101;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.approve-node {
    display: block;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .node-label {
        font-size: 12px;
        margin-top: 5px;
    }

    &.node-jugement {
        .node-label {
            margin-top: 15px;
        }
    }
}
</style>

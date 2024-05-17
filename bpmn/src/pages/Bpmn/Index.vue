<template>
    <div class="bpmnContainer" v-if="show">
        <div class="canvas" ref="canvas"></div>
        <ToolBar v-if="modeler" :modeler="modeler"></ToolBar>
        <Save v-if="modeler" :modeler="modeler"></Save>
    </div>
</template>

<script setup>
import { nextTick, ref } from 'vue';
import BpmnModeler from 'bpmn-js/lib/Modeler'
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
import translate from './translate';
import defaultXmlStr from './example';
import minimapModule from 'diagram-js-minimap';
import ToolBar from './components/ToolBar.vue';
import Save from '../../components/Save.vue';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus'
import { useStore } from '../../store';
import { saveToUserFile } from '../../api';
import bus from '../../bus';

const canvas = ref(null)
const modeler = ref(null)

const initBpmn = (data) => {
    data = data || defaultXmlStr
    modeler.value = new BpmnModeler({
        container: canvas.value,
        additionalModules: [
            {
                translate: ['value', translate]
            },
            minimapModule,
        ],
    });
    modeler.value.importXML(data);
    modeler.value.get('minimap').open();
    modeler.value.on('commandStack.changed', () => {
        modeler.value.saveXML({ format: true }, function (err, xml) {
            if (!err) {
                saveToUserFile(xml)
            }
        })
    });
    bus.on('MANUAL_SAVE', () => {
        modeler.value.saveXML({ format: true }, function (err, xml) {
            if (!err) {
                saveToUserFile(xml)
            }
        })
    })
    modeler.value.on('element.changed', (event) => {
        const element = event.element;
    });
}

const show = ref(false)
const route = useRoute()
const store = useStore()
const init = async () => {
    try {
        if (!route.params.id) {
            ElMessage.warning({
                message: '页面缺少必要参数！',
                duration: 0
            })
            return;
        }
        let userInfo = await store.getUserInfo()
        if (userInfo) {
            let fileData = await store.getUserFileData(route.params.id)
            show.value = true;
            nextTick(() => {
                initBpmn(fileData.data)
            })
        } else {
            ElMessage.warning({
                message: '请先登录！',
                duration: 0
            })
        }
    } catch (e) {
        ElMessage.warning({
            message: '页面初始化失败，请重试！',
            duration: 0
        })
    }
}

init()
</script>

<style lang="less" scoped>
.bpmnContainer {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;

    .canvas {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }
}

/deep/ .bjs-powered-by {
    display: none;
}
</style>

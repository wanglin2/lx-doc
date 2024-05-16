<template>
    <div class="toolbarContainer">
        <div>
            <!-- 导入 -->
            <el-tooltip effect="dark" content="导入dpmn文件" placement="top">
                <el-button :icon="FolderOpened" circle @click="importFile" style="margin-right: 10px;" />
            </el-tooltip>
            <!-- 下载 -->
            <el-dropdown @command="handleDownloadCommand">
                <el-button :icon="Download" circle style="margin-right: 10px;" />
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="png">下载为png文件</el-dropdown-item>
                        <el-dropdown-item command="xml">下载为xml文件</el-dropdown-item>
                        <el-dropdown-item command="svg">下载为svg文件</el-dropdown-item>
                        <el-dropdown-item command="bpmn">下载为bpmn文件</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <!-- 缩放 -->
            <el-button-group key="scale-control" size="small" style="margin-right: 10px;">
                <el-tooltip effect="dark" content="缩小视图" placement="top">
                    <el-button :disabled="defaultZoom < 0.2" :icon="ZoomOut" @click="processZoomOut()" />
                </el-tooltip>
                <el-button>{{ Math.floor(defaultZoom * 10 * 10) + "%" }}</el-button>
                <el-tooltip effect="dark" content="放大视图" placement="top">
                    <el-button :disabled="defaultZoom > 4" :icon="ZoomIn" @click="processZoomIn()" />
                </el-tooltip>
                <el-tooltip effect="dark" content="重置视图并居中" placement="top">
                    <el-button :icon="ScaleToOriginal" @click="processReZoom()" />
                </el-tooltip>
            </el-button-group>
            <!-- 前进后退 -->
            <el-button-group key="stack-control" size="small">
                <el-tooltip effect="dark" content="撤销" placement="top">
                    <el-button :disabled="!revocable" :icon="RefreshLeft" @click="processUndo()" />
                </el-tooltip>
                <el-tooltip effect="dark" content="恢复" placement="top">
                    <el-button :disabled="!recoverable" :icon="RefreshRight" @click="processRedo()" />
                </el-tooltip>
                <el-tooltip effect="dark" content="重新绘制" placement="top">
                    <el-button :icon="Refresh" @click="processRestart" />
                </el-tooltip>
            </el-button-group>
        </div>
        <!-- 用于打开本地文件-->
        <input type="file" id="files" ref="refFile" style="display: none" accept=".xml, .bpmn"
            @change="importLocalFile" />
    </div>
</template>

<script setup>
import {
    FolderOpened,
    Download,
    ZoomIn,
    ZoomOut,
    ScaleToOriginal,
    RefreshLeft,
    RefreshRight,
    Refresh
} from '@element-plus/icons-vue'
import { ref } from 'vue';
import defaultXML from '../example';
import { downloadFunc, setEncoded, svgToPng } from '../../../utils';
import bus from '../../../bus';

const props = defineProps({
    modeler: {
        type: Object
    }
})

// 导入文件
const refFile = ref(null)
const importFile = () => {
    refFile.value.click()
}

// 加载本地文件
const importLocalFile = () => {
    const file = refFile.value.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function () {
        let xmlStr = this.result;
        createNewDiagram(xmlStr);
    };
}

// 创建新的流程图
const createNewDiagram = async (xml) => {
    // 将字符串转换成图显示出来
    let xmlString = xml || defaultXML;
    try {
        let { warnings } = await props.modeler.importXML(xmlString);
        if (warnings && warnings.length) {
            warnings.forEach(warn => console.warn(warn));
        }
    } catch (e) {
        console.error(e);
    }
}

// 下载文件
const handleDownloadCommand = async (type) => {
    try {
        let name = type + '文件';
        // 按需要类型创建文件并下载
        if (type === "xml" || type === "bpmn") {
            const { err, xml } = await props.modeler.saveXML();
            // 读取异常时抛出异常
            if (err) {
                console.error(`[警告 ]: ${err.message || err}`);
            }
            let { href, filename } = setEncoded(type, name, xml);
            downloadFunc(href, filename);
        } else if (type === 'svg') {
            const { err, svg } = await props.modeler.saveSVG();
            // 读取异常时抛出异常
            if (err) {
                return console.error(err);
            }
            let { href, filename } = setEncoded("svg", name, svg);
            downloadFunc(href, filename);
        } else if (type === 'png') {
            const { err, svg } = await props.modeler.saveSVG();
            // 读取异常时抛出异常
            if (err) {
                return console.error(err);
            }
            let imgData = await svgToPng(svg)
            downloadFunc(imgData, name)
        }
    } catch (e) {
        console.error(`[警告 ]: ${e.message || e}`);
    }
}

// 缩放
const defaultZoom = ref(1)

// 监听视图缩放变化
props.modeler.on("canvas.viewbox.changed", ({ viewbox }) => {
    const { scale } = viewbox;
    defaultZoom.value = Math.floor(scale * 100) / 100;
});

const processZoomIn = (zoomStep = 0.1) => {
    let newZoom = Math.floor(defaultZoom.value * 100 + zoomStep * 100) / 100;
    if (newZoom > 4) {
        throw new Error("[Process Designer Warn ]: The zoom ratio cannot be greater than 4");
    }
    defaultZoom.value = newZoom;
    props.modeler.get("canvas").zoom(defaultZoom.value);
}
const processZoomOut = (zoomStep = 0.1) => {
    let newZoom = Math.floor(defaultZoom.value * 100 - zoomStep * 100) / 100;
    if (newZoom < 0.2) {
        throw new Error("[Process Designer Warn ]: The zoom ratio cannot be less than 0.2");
    }
    defaultZoom.value = newZoom;
    props.modeler.get("canvas").zoom(defaultZoom.value);
}
const processReZoom = () => {
    defaultZoom.value = 1;
    props.modeler.get("canvas").zoom("fit-viewport", "auto");
}

// 前进后退
const revocable = ref(false)
const recoverable = ref(false)
const EventBus = props.modeler.get("eventBus");
// 监听图形改变返回xml
EventBus.on("commandStack.changed", async event => {
    try {
        recoverable.value = props.modeler.get("commandStack").canRedo();
        revocable.value = props.modeler.get("commandStack").canUndo();
        let { xml } = await props.modeler.saveXML({ format: true });
    } catch (e) {
        console.error(`[Process Designer Warn]: ${e.message || e}`);
    }
});

const processRedo = () => {
    props.modeler.get("commandStack").redo();
}
const processUndo = () => {
    props.modeler.get("commandStack").undo();
}

const processRestart = async () => {
    recoverable.value = false;
    revocable.value = false;
    await createNewDiagram(null);
    bus.emit('MANUAL_SAVE')
}
</script>

<style lang="less" scoped>
.toolbarContainer {
    position: absolute;
    left: 20px;
    bottom: 10px;
}
</style>

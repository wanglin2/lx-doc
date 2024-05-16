<template>
    <div class="property-panel" v-if="nodeData">
        <h2>属性面板</h2>
        <el-form :key="nodeData.id" :model="ruleForm">
            <!-- 矩形、菱形特有 -->
            <template v-if="['approver', 'jugement'].includes(nodeData.type)">
                <el-form-item label="宽" prop="width">
                    <el-slider
                        :max="500"
                        v-model="ruleForm.width"
                        @change="(width) => {
                            updateProperty({
                                width
                            })
                        }"
                    />
                </el-form-item>
                <el-form-item label="高" prop="height">
                    <el-slider
                        :max="500"
                        v-model="ruleForm.height"
                        @change="(height) => {
                            updateProperty({
                                height
                            })
                        }"
                    />
                </el-form-item>
            </template>
            <!-- 圆形特有 -->
            <template v-if="['apply', 'finsh'].includes(nodeData.type)">
                <el-form-item label="半径" prop="radius">
                    <el-slider
                        :max="500"
                        v-model="ruleForm.radius"
                        @change="(radius) => {
                            updateProperty({
                                radius
                            })
                        }"
                    />
                </el-form-item>
            </template>
            <!-- 公共 -->
            <el-form-item label="文字" prop="text">
                <el-input v-model="ruleForm.text" @input="onTextInput" />
            </el-form-item>
            <el-form-item label="文字大小" prop="fontSize">
                <el-select
                    v-model="ruleForm.fontSize"
                    placeholder="请选择"
                    @change="(fontSize) => {
                        updateProperty({
                            fontSize
                        })
                    }"
                >
                    <el-option
                        v-for="item in fontSizeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="文字颜色" prop="color">
                <el-color-picker
                    v-model="ruleForm.color"
                    @change="(color) => {
                        updateProperty({
                            color
                        })
                    }"
                />
            </el-form-item>
            <!-- 连接线的文字特有 -->
            <el-form-item
                v-if="['customPolylineEdge'].includes(nodeData.type)"
                label="文字背景颜色"
                prop="textFill"
            >
                <el-color-picker
                    v-model="ruleForm.textFill"
                    @change="(textFill) => {
                        updateProperty({
                            textFill
                        })
                    }"
                />
            </el-form-item>
            <el-form-item label="边框颜色" prop="stroke">
                <el-color-picker
                    v-model="ruleForm.stroke"
                    @change="(stroke) => {
                        updateProperty({
                            stroke
                        })
                    }"
                />
            </el-form-item>
            <el-form-item label="边框大小" prop="strokeWidth">
                <el-select
                    v-model="ruleForm.strokeWidth"
                    placeholder="请选择"
                    @change="(strokeWidth) => {
                        updateProperty({
                            strokeWidth
                        })
                    }"
                >
                    <el-option
                        v-for="item in strokeWidthList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="边框虚线大小" prop="strokeDash">
                <el-select
                    v-model="ruleForm.strokeDash"
                    placeholder="请选择"
                    @change="(strokeDash) => {
                        updateProperty({
                            strokeDash
                        })
                    }"
                >
                    <el-option
                        v-for="item in strokeWidthList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <!-- 连接线没有 -->
            <el-form-item
                v-if="!['customPolylineEdge'].includes(nodeData.type)"
                label="填充颜色"
                prop="fill"
            >
                <el-color-picker
                    v-model="ruleForm.fill"
                    @change="(fill) => {
                        updateProperty({
                            fill
                        })
                    }"
                />
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { reactive, watch } from 'vue';
import { fontSizeList, strokeWidthList } from '../config';

const props = defineProps({
    nodeData: {
        type: Object,
        default() {
            return null
        }
    },
    lf: {
        type: Object
    }
})

const ruleForm = reactive({
    text: '',
    fontSize: '',
    color: '',
    stroke: '',
    strokeWidth: '',
    strokeWidth: '',
    strokeDash: '',
    fill: '',
    width: '',
    height: '',
    radius: '',
    textFill: ''
})

const resetRuleForm = () => {
    Object.keys(ruleForm).forEach((key) => {
        ruleForm[key] = '';
    })
}

watch(() => {
    return props.nodeData;
}, () => {
    resetRuleForm();
    ruleForm.text = props.nodeData.text?.value;
    Object.keys(props.nodeData.properties || {}).forEach((key) => {
        ruleForm[key] = (props.nodeData.properties || {})[key];
    })
}, {
    deep: true,
    immediate: true
})

// 获取节点或边元素
const getElement = () => {
    const node = props.lf.graphModel.nodesMap[props.nodeData.id];
    const edge = props.lf.graphModel.edgesMap[props.nodeData.id];
    return node || edge || null;
}

// 修改文字
const onTextInput = (text) => {
    const element = getElement()
    if (element) {
        element.model.updateText(text);
    }
}

// 更新属性
const updateProperty = (data) => {
    const element = getElement()
    if (element) {
        console.log(element, data);
        element.model.setProperties(Object.assign(element.model.properties, data));
    }
}
</script>

<style lang="less" scoped>
.property-panel {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 250px;
    padding: 20px;
    margin: 0;
    background-color: white;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    z-index: 101;
    box-shadow: 0 0 10px 1px rgb(228, 224, 219);

    h2 {
        margin-bottom: 10px;
    }
}
</style>

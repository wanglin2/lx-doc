<template>
    <div class="settingContainer">
        <div class="item">
            <span class="label">显示网格</span>
            <el-switch
                v-model="setting.showGrid"
                size="small"
                :active-value="true"
                :inactive-value="false"
            />
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
const setting = reactive({
    showGrid: true
})
</script>

<style lang="less" scoped>
.settingContainer {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 10px;
    padding: 0 10px;
    height: 40px;
    background-color: white;
    box-shadow: 0 0 10px 1px rgb(228, 224, 219);
    border-radius: 6px;
    z-index: 101;
    display: flex;
    align-items: center;

    .item {
        display: flex;
        align-items: center;

        .label {
            margin-right: 5px;
            font-size: 14px;
        }
    }
}
</style>

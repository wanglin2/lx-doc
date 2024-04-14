<template>
    <div class="flex flex-col items-center py-[100px]">
        <div class="text-[#1d2129] text-[44px]">完全免费的在线文档平台</div>
        <div class="text-[#939aa8] text-[18px] my-[26px] mb-[10px]">全能白板 • 文档 • 思维导图 • 电子表格 • PPT • 流程图 • Markdown • 简历 • BPMN</div>
        <div class="text-[#939aa8] text-[12px] mt-[0] mb-[26px]">敬请期待：设计 • 图片编辑 • 甘特图 • 图表</div>
        <div
            class="loginBtn w-[192px] h-[48px] text-[#fff] bg-[#ff3f5d] rounded-[6px] flex justify-center items-center cursor-pointer"
            @click="login"
        >点此登录去创建</div>
    </div>
</template>

<script setup lang="ts">
// 去登录
const login = () => {
    localStorage.setItem("LOGIN_CALLBACK_URL", location.origin + '/board');
    location.href =
        process.env.NODE_ENV === "development" ? "./index/#/login" : "../#/login";
};
</script>

<style lang="less" scoped>
.loginBtn {
    box-shadow: 0 2px 8px 0 rgba(245, 47, 77, 0.2);
    transition: all 0.3s;

    &:hover {
        opacity: 0.8;
    }
}
</style>

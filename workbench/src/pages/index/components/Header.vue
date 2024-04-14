<template>
    <div class="w-full flex justify-between">
        <div class="logo h-[64px] flex justify-center items-center text-[30px] flex-shrink-0 text-[#727c87]">
            <img
                src="http://assets.lxqnsys.com/%E7%94%BB%E6%9E%B6%28easel%29_%E7%88%B1%E7%BB%99%E7%BD%91_aigei_com.png"
                class="w-[35px] h-[35px] mr-[10px]"
            />
            理想文档
        </div>
        <div class="flex items-center">
            <el-tooltip effect="dark" content="点此去登录" placement="bottom">
                <div
                    class="avatar w-[40px] h-[40px] flex justify-center items-center cursor-pointer text-[#727c87]"
                    @click="login"
                >
                    <span class="iconfont icon-denglu-copy text-[25px]"></span>
                </div>
            </el-tooltip>
        </div>
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
.avatar {
    border: 1px solid #727c87;
    border-radius: 50%;
}
</style>

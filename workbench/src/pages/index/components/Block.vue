<template>
    <div class="flex items-center justify-between">
        <div class="imgBlock w-[750px] flex-shrink-0 mr-[50px]" v-if="reverse">
            <img :src="img" alt />
        </div>
        <div class="grow">
            <div class="text-[32px] text-[#1d2129] mb-[30px]">{{ title }}</div>
            <div class="text-[18px] text-[#727c87]">{{ desc }}</div>
        </div>
        <div class="imgBlock w-[750px] flex-shrink-0 ml-[50px]" v-if="!reverse">
            <img :src="img" alt />
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    reverse: boolean,
    img: string,
    title: string,
    desc: string
}>()
</script>

<style lang="less" scoped>
.imgBlock {
    box-shadow: 0 2px 8px rgba(0,0,0,.1);
}
</style>

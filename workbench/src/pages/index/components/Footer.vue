<template>
    <div class="copyrightContainer w-full">
        <p>© 「<a href="../">理想青年实验室</a>」出品 lxqnsys.com 2015-{{ year }}</p>
        <p class="w-full">
            <a href="https://beian.miit.gov.cn/">赣ICP备16009458号-3</a>
            <a href="http://www.beian.gov.cn/" target="_blank" class="flex w-full">
                <img src="http://lxqnsys.com/index_assets/img/ghs.d0289dc0.png" style="object-fit: contain;" class="mr-[5px]" />
                浙公网安备 33011002014046号
            </a>
        </p>
    </div>
</template>

<script lang="ts">
export default {
    name: "Copyright",
    data() {
        return {
            clickNum: "",
            year: new Date().getFullYear()
        };
    },
};
</script>

<style lang="less" scoped>
.copyrightContainer {
    width: 100%;
    margin: 50px auto;

    a {
        color: #2c3e50;
    }

    p {
        a {
            margin-right: 10px;
        }
    }
}
</style>

<template>
    <el-container style="height: 100vh; border: 0px">
        <!-- 侧边栏 -->
        <el-aside width="200px" style="background-color: rgb(238, 241, 246); padding: 10px;">
            <SideBar></SideBar>
        </el-aside>
        <el-container>
            <!-- 头部 -->
            <el-header style="text-align: right; font-size: 12px">
                <HeaderBar></HeaderBar>
            </el-header>
            <!-- 主体 -->
            <el-main>
                <MainBody></MainBody>
            </el-main>
        </el-container>
    </el-container>

</template>

<script>
import HeaderBar from '@/components/HeaderBar.vue'
import SideBar from '@/components/SideBar.vue'
import MainBody from '@/components/MainBody.vue'
export default {
    name: 'HomeView',
    data() {
        return {
        }
    },
    components: {
        HeaderBar, SideBar, MainBody
    },
};
</script>

<style scoped>
.el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
}

.el-aside {
    color: #333;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE 10+ */
}
.el-main {
    overflow-y: hidden;
    overflow-x: hidden;
    /* scrollbar-width: none; */
    /* Firefox */
    -ms-overflow-style: none;
    /* IE 10+ */
    height: 100%;
}


</style>
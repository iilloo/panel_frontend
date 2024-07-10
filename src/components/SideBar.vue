<template>
    <div style="border: 0cap; ">
        <el-button disabled style="width: 100%; height: 60px; 
                            box-sizing: border-box;border:0px;padding: 0px;
                            margin-bottom: 10px; font-size: 50px; 
                            background-color: transparent;">Panel</el-button>
        <el-menu background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
            <el-menu-item v-for="item in items" :index= item.id :key = item.id @click = routeChange(item.pathname)>{{item.name}}</el-menu-item> 
        </el-menu>
    </div>
</template>

<script>
export default {
    name: 'SideBar',
    data() {
        return {
            items: [
                {id: "1", name: '在线终端', pathname: 'terminalSys'},
                {id: "2", name: '文件管理', pathname: 'fileSystem'},
                {id: "3", name: '主机状态', pathname: 'hostStatus'},
                {id: "4", name: '定时任务', pathname: 'timingTask'},
                {id: "5", name: '垃圾清理', pathname: 'garbageCleaning'},
                {id: "6", name: '端口管理', pathname: 'portManagement'},
                {id: "7", name: '进程管理', pathname: 'processManagement'},
                {id: "8", name: '软件管理', pathname: 'softwareManagement'},
                // {id: "9", name: '可执行文件管理', pathname: 'executableFileManagement'},
            ],
        }
    },
    methods: {
        routeChange(pathname) {
            this.$bus.$emit('routeChange', pathname)
        }
    }
}
</script>

<style scoped>

</style>
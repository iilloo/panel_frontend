<template>
    <div>
        <el-dropdown>
            <i class="el-icon-setting" style="margin-right: 15px"></i>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>修改账户内容</el-dropdown-item>
                <el-dropdown-item>退出登录</el-dropdown-item>
                <el-dropdown-item>删除账户</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <span>{{ username }}</span>
    </div>
</template>

<script>
export default {
    name: 'HeaderBar',
    data() {
        return {
            username: 'kazusa'

        }
    }
}
</script>

<style scoped>

</style>
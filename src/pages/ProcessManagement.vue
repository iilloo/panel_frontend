<template>
    <div class="processManagement">
        <div class="header">
            <el-input calss="input" size="small" 
                placeholder="请输入内容"></el-input>
            <el-button @click="deleteProcess" type="danger" icon="el-icon-delete" plain size="mini"></el-button>
        </div>
        <div class="table">
            <el-table height="100%" :data="processInfos" style="width: 100%" border>
                <el-table-column type="selection" width="40px">
                </el-table-column>
                <el-table-column prop="pid" label="PID" width="200">
                </el-table-column>
                <el-table-column prop="user" label="USER" width="200">
                </el-table-column>
                <el-table-column prop="cpuUsage" label="%CPU" width="200">
                </el-table-column>
                <el-table-column prop="memUsage" label="MEM(MB)" width="200">
                </el-table-column>
                <el-table-column prop="address" label="ADDR">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
export default {
    name: "processManagement",
    data() {
        return {
            processInfos: [
                {
                    pid: "1",
                    user: "root",
                    cpuUsage: "0.3",
                    memUsage: "20",
                    address: "/sbin/init"
                },
                {
                    pid: "2",
                    user: "root",
                    cpuUsage: "0.1",
                    memUsage: "13",
                    address: "[kthreadd]"
                },
                {
                    pid: "3",
                    user: "root",
                    cpuUsage: "0.1",
                    memUsage: "10",
                    address: "[rcu_gp]"
                },
                {
                    pid: "4",
                    user: "root",
                    cpuUsage: "0.1",
                    memUsage: "16",
                    address: "[rcu_par_gp]"
                },
                {
                    pid: "6",
                    user: "root",
                    cpuUsage: "0.0",
                    memUsage: "30",
                    address: "[kworker/0:0H-kblockd]"
                },
                {
                    pid: "8",
                    user: "root",
                    cpuUsage: "0.0",
                    memUsage: "20",
                    address: "[mm_percpu_wq]"
                },
                {
                    pid: "9",
                    user: "root",
                    cpuUsage: "0.0",
                    memUsage: "12",
                    address: "[ksoftirqd/0]"
                },
                {
                    pid: "10",
                    user: "root",
                    cpuUsage: "0.0",
                    memUsage: "0.0",
                    address: "[rcu_sched]"
                },
                {
                    pid: "11",
                    user: "root",
                    cpuUsage: "0.1",
                    memUsage: "10",
                    address: "[migration/0]"
                },
                {
                    pid: "12",
                    user: "root",
                    cpuUsage: "0.1",
                    memUsage: "6",
                    address: "[idle_inject/0]"
                },
                {
                    pid: "14",
                    user: "root",
                    cpuUsage: "0.0",
                    memUsage: "20",
                    address: "[cpuhp/0]"
                },
                {
                    pid: "15",
                    user: "root",
                    cpuUsage: "0.1",
                    memUsage: "30",
                    address: "[kdevtmpfs]"
                },
                {
                    pid: "16",
                    user: "root",
                    cpuUsage: "0.2",
                    memUsage: "30",
                    address: "[netns]"
                },
                {
                    pid: "17",
                    user: "root",
                    cpuUsage: "0.3",
                    memUsage: "18",
                    address: "[rcu_tasks_kthre]"
                },
                {
                    pid: "18",
                    user: "root",
                    cpuUsage: "0.5",
                    memUsage: "20",
                    address: "[kauditd]"
                },
                {
                    pid: "19",
                    user: "root",
                    cpuUsage: "0.7",
                    memUsage: "20",
                    address: "[khungtaskd]"
                },
                {
                    pid: "20",
                    user: "root",
                    cpuUsage: "0.3",
                    memUsage: "20",
                    address: "[oom_reaper]"
                },

            ],

        }
    },
    methods: {
        deleteProcess() {
            this.$confirm('此操作将终止进程, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        }
    }
}
</script>

<style>
.processManagement {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.processManagement .table {
    flex: 1;
    overflow: auto;
}

.processManagement .header {
    display: flex;
    margin-bottom: 10px;
    justify-content: space-between;
}

.processManagement .header .el-input {
    padding-left: 0;
    flex: 0 0 auto;
    width: 300px;
}
.processManagement .header .el-input .el-input__inner {
    font-size: 14px;
    padding: 0 10px;
    height: 32px;
    line-height: 32px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    background-color: #f4f4f4;
    color: #606266;
    transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    box-sizing: border-box;
}

.processManagement .header .el-button {
    flex: 0 0 auto;
}
</style>
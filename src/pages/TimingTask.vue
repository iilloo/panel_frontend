<template>
    <div class="timingTask">
        <div class="header">
            <el-button @click="addTask" type="success" icon="el-icon-plus" plain size="mini"></el-button>
            <el-button @click="editTask" type="primary" icon="el-icon-edit" plain size="mini"></el-button>

            <el-button @click="deleteTask" type="danger" icon="el-icon-delete" plain size="mini"></el-button>
        </div>
        <div class="table">
            <el-table height="100%" :data="taskInfos" style="width: 100%" border>
                <el-table-column type="selection" width="40px">
                </el-table-column>
                <el-table-column prop="name" label="任务名称" width="200">
                </el-table-column>
                <el-table-column prop="timing" label="定时" width="200">
                </el-table-column>
                <el-table-column prop="command" label="命令" width="300">
                </el-table-column>
                <el-table-column prop="describe" label="任务描述">
                </el-table-column>
            </el-table>
        </div>
        <el-dialog class="taskDialog" :title="dialogTitle" :visible.sync="dialogFormVisible">
            <el-form class="taskForm" ref="taskForm" :model="taskForm" label-width="80px">
                <el-form-item label="时机">
                    <div class="timingItem">
                        <span class="ItemText">分</span>
                        <el-select size="mini" v-model="taskForm.timing.minute" placeholder="请选择">
                            <el-option v-for="i in 59" :key="i.index" :label="i" :value="i">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="timingItem">
                        <span class="ItemText">时</span>
                        <el-select size="mini" v-model="taskForm.timing.hour" placeholder="请选择">
                            <el-option v-for="i in 23" :key="i.index" :label="i" :value="i">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="timingItem">
                        <span class="ItemText">日</span>
                        <el-select size="mini" v-model="taskForm.timing.day" placeholder="请选择">
                            <el-option v-for="i in generateRange(1, 31)" :key="i.index" :label="i" :value="i">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="timingItem">
                        <span class="ItemText">月</span>
                        <el-select size="mini" v-model="taskForm.timing.month" placeholder="请选择">
                            <el-option v-for="i in generateRange(1, 12)" :key="i.index" :label="i" :value="i">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="timingItem">
                        <span class="ItemText">周</span>
                        <el-select size="mini" v-model="taskForm.timing.week" placeholder="请选择">
                            <el-option v-for="i in 7" :key="i.index" :label="i" :value="i">
                            </el-option>
                        </el-select>
                    </div>
                </el-form-item>
                <el-form-item label="命令">
                    <el-input v-model="taskForm.command" size="mini" placeholder="请输入命令"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "timingTask",
    data() {
        return {
            taskInfos: [
                {
                    name: "定时关机",
                    timing: "0 23 * * *",
                    command: "/sbin/shutdown -h now",
                    describe: "每天晚上11点关机"
                },
                {
                    name: "任务2",
                    timing: "0 12 * * *",
                    command: "echo 'hello'",
                    describe: "任务2描述"
                },
                {
                    name: "任务3",
                    timing: "0 12 * * *",
                    command: "echo 'hello'",
                    describe: "任务3描述"
                },
                {
                    name: "任务4",
                    timing: "0 12 * * *",
                    command: "echo 'hello'",
                    describe: "任务4描述"
                },
                {
                    name: "任务5",
                    timing: "0 12 * * *",
                    command: "echo 'hello'",
                    describe: "任务5描述"
                },
                {
                    name: "任务6",
                    timing: "0 12 * * *",
                    command: "echo 'hello'",
                    describe: "任务6描述"
                },
                {
                    name: "任务7",
                    timing: "0 12 * * *",
                    command: "echo 'hello'",
                    describe: "任务7描述"
                },
                {
                    name: "任务8",
                    timing: "0 12 * * *",
                    command: "echo 'hello'",
                    describe: "任务8描述"
                },
                {
                    name: "任务9",
                    timing: "0 12 * * *",
                    command: "echo 'hello'",
                    describe: "任务9描述"
                },
                {
                    name: "任务10",
                    timing: "0 12 * * *",
                    command: "echo 'hello'",
                    describe: "任务10描述"
                },
                {
                    name: "任务11",
                    timing: "0 12 * * *",
                    command: "echo 'hello'",
                    describe: "任务11描述"
                },
                {
                    name: "任务12",
                    timing: "0 12 * * *",
                    command: "echo 'hello'",
                    describe: "任务12描述"
                },
                {
                    name: "任务13",
                    timing: "0 12 * * *",
                    command: "echo 'hello'",
                    describe: "任务13描述"
                },
                {
                    name: "任务14",
                    timing: "0 12 * * *",
                    command: "echo 'hello'",
                    describe: "任务14描述"
                },
                {
                    name: "任务15",
                    timing: "0 12 * * *",
                    command: "echo 'hello'",
                    describe: "任务15描述"
                },
                {
                    name: "任务16",
                    timing: "0 12 * * *",
                    command: "echo 'hello'",
                    describe: "任务16描述"
                },
                {
                    name: "任务17",
                    timing: "0 12 * * *",
                    command: "echo 'hello'",
                    describe: "任务17描述"
                },
                {
                    name: "任务18",
                    timing: "0 12 * * *",
                    command: "echo 'hello'",
                    describe: "任务18描述"
                },
                {
                    name: "任务19",
                    timing: "0 12 * * *",
                    command: "echo 'hello'",
                    describe: "任务19描述"
                },
                {
                    name: "任务20",
                    timing: "0 12 * * *",
                    command: "echo 'hello'",
                    describe: "任务20描述"
                },
                {
                    name: "任务21",
                    timing: "0 12 * * *",
                    command: "echo 'hello'",
                    describe: "任务21描述"
                },
                {
                    name: "任务22",
                    timing: "0 12 * * *",
                    command: "echo 'hello'",
                    describe: "任务22描述"
                },
                {
                    name: "任务23",
                    timing: "0 12 * * *",
                    command: "echo 'hello'",
                    describe: "任务23描述"
                },
                {
                    name: "任务24",
                    timing: "0 12 * * *",
                    command: "echo 'hello'",
                    describe: "任务24描述"
                },
                {
                    name: "任务25",
                    timing: "0 12 * * *",
                    command: "echo 'hello'",
                    describe: "任务25描述"
                }
            ],
            dialogFormVisible: false,
            taskForm: {
                timing: {
                    minute: 0,
                    hour: 0,
                    day: 1,
                    month: 1,
                    week: 0,
                },
                command: "",
            },
            dialogTitle: "",
        }
    },
    methods: {
        addTask() {
            this.dialogTitle = "添加任务";
            this.dialogFormVisible = true;
        },
        generateRange(start, end) {
            return Array.from({ length: end - start + 1 }, (_, i) => i + start)
        },
        editTask() {
            this.dialogTitle = "编辑任务";
            this.dialogFormVisible = true;
        },
        deleteTask() {
            this.$confirm('是否删除选中的任务？', '提示', {
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
        },
    },

}
</script>

<style>
.timingTask {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.timingTask .header {
    display: flex;
    margin-bottom: 10px;
}

.timingTask .table .el-table .el-table__cell {
    padding: 8px 0;
}

.timingTask .table {
    flex: 1;
    overflow: auto;
}

.timingTask .taskDialog .el-dialog {
    width: 30%;
}

.timingTask .taskDialog .taskForm .timingItem {
    width: 60px;
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
}
.timingTask .taskDialog .taskForm .el-form-item__label {
    width: 40px !important;
    text-align: left;

}
.timingTask .taskDialog .taskForm .el-form-item__content {
    margin-left: 40px !important;
}

.timingTask .taskDialog .taskForm .timingItem .ItemText {
    text-align: center;
}
.timingTask .taskDialog .taskForm .el-form-item__content {
    display: flex;
    justify-content: space-between;
}


</style>

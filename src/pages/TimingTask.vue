<template>
    <div class="timingTask">
        <div class="header">
            <el-button @click="flashTask" type="primary" icon="el-icon-refresh-right" plain size="mini"></el-button>
            <el-button @click="addTask" type="success" icon="el-icon-plus" plain size="mini"></el-button>
            <el-button v-if="selectedRows.length == 1" @click="editTask" type="primary" icon="el-icon-edit" plain
                size="mini"></el-button>
            <el-button v-if="selectedRows.length" @click="deleteTask" type="danger" icon="el-icon-delete" plain
                size="mini"></el-button>

        </div>
        <div class="table">
            <el-table @selection-change="handleSelectionChange" height="100%" :data="taskInfos" style="width: 100%"
                border>
                <el-table-column type="selection" width="40px">
                </el-table-column>
                <el-table-column prop="task_name" label="任务名称" width="200">
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
            <el-form :rules="rules" class="taskForm" ref="taskForm" :model="taskForm" label-width="80px">
                <el-form-item class="taskForm_item" label="名称" prop="name">
                    <el-input v-model="taskForm.task_name" size="mini" placeholder="请输入任务名称"></el-input>
                </el-form-item>
                <el-form-item label="时机" prop="timing">
                    <div class="timingItem">
                        <span class="ItemText">秒</span>
                        <el-select size="mini" v-model="taskForm.timing.second" placeholder="请选择">
                            <el-option label="*" value="*"></el-option>
                            <el-option label="?" value="?"></el-option>
                            <el-option v-for="i in 60" :key="i" :label="i - 1" :value="String(i - 1)">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="timingItem">
                        <span class="ItemText">分</span>

                        <el-select size="mini" v-model="taskForm.timing.minute" placeholder="请选择">
                            <el-option label="*" value="*"></el-option>
                            <el-option label="?" value="?"></el-option>
                            <el-option v-for="i in 60" :key="i" :label="i - 1" :value="String(i - 1)">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="timingItem">
                        <span class="ItemText">时</span>
                        <el-select size="mini" v-model="taskForm.timing.hour" placeholder="请选择">
                            <el-option label="*" value="*"></el-option>
                            <el-option label="?" value="?"></el-option>
                            <el-option v-for="i in 24" :key="i" :label="i - 1" :value="String(i - 1)">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="timingItem">
                        <span class="ItemText">日</span>
                        <el-select size="mini" v-model="taskForm.timing.day" placeholder="请选择">
                            <el-option label="*" value="*"></el-option>
                            <el-option label="?" value="?"></el-option>
                            <el-option v-for="i in generateRange(1, 31)" :key="i" :label="i" :value="String(i)">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="timingItem">
                        <span class="ItemText">月</span>
                        <el-select size="mini" v-model="taskForm.timing.month" placeholder="请选择">
                            <el-option label="*" value="*"></el-option>
                            <el-option label="?" value="?"></el-option>
                            <el-option v-for="i in generateRange(1, 12)" :key="i" :label="i" :value="String(i)">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="timingItem">
                        <span class="ItemText">周</span>
                        <el-select size="mini" v-model="taskForm.timing.week" placeholder="请选择">
                            <el-option label="*" value="*"></el-option>
                            <el-option label="?" value="?"></el-option>
                            <el-option v-for="i in 7" :key="i" :label="i" :value="String(i)">
                            </el-option>
                        </el-select>
                    </div>
                </el-form-item>
                <el-form-item class="taskForm_item" label="命令" prop="command">
                    <el-input v-model="taskForm.command" size="mini" placeholder="请输入命令"></el-input>
                </el-form-item>
                <el-form-item class="taskForm_item" label="描述" prop="description">
                    <el-input type="textarea" v-model="taskForm.description" placeholder="请输入描述(可选)"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click=dialogCancel>取 消</el-button>
                <el-button type="primary" @click=dialogConfirm>确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import instance from '@/utils/axios';

export default {
    name: "timingTask",
    data() {
        var checkTiming = (rule, value, callback) => {
            if (value.second === '' || value.minute === '' || value.hour === '' || value.day === '' || value.month === '' || value.week === '') {
                callback(new Error('请输入完整的时间'));
            } else {
                callback();
            }
        };
        return {
            selectedRows: [],// 用于保存选中的行文件名称
            selectedRow: {},// 用于保存选中的行文件数据

            rules: {
                task_name: [
                    { required: true, message: "请输入任务名称", trigger: "blur" },
                ],
                timing: [
                    { validator: checkTiming, trigger: "blur" },
                ],
                command: [
                    { required: true, message: "请输入命令", trigger: "blur" },
                ],
            },
            taskInfos: [
                {
                    name: "定时关机",
                    timing: "0 23 * * *",
                    command: "/sbin/shutdown -h now",
                    describe: "每天晚上11点关机"
                },

            ],
            dialogFormVisible: false,
            taskForm: {
                task_name: "",
                timing: {
                    second: '',
                    minute: '',
                    hour: '',
                    day: '',
                    month: '',
                    week: '',
                },
                command: "",
                description: "",
            },
            dialogTitle: "",
        }
    },
    mounted() {
        this.getTaskList();
    },
    methods: {
        handleSelectionChange(val) {

            this.selectedRows = []
            for (let i = 0; i < val.length; i++) {
                this.selectedRows[i] = val[i].task_name
            }
            this.selectedRow = {}
            if (val.length === 1) {
                this.selectedRow = val[0]
                console.log("selectedRow:", this.selectedRow)
            }
        },
        flashTask() {
            this.getTaskList();
        },
        getTaskList() {
            instance.get('/timingTask/getTaskList').then(response => {
                console.log("tasks:", response.tasks)
                this.taskInfos = response.tasks;
                this.$message({
                    message: '刷新成功！',
                    type: 'success'
                });
            }).catch(error => {
                console.log(error)
            });
        },
        dialogCancel() {
            this.dialogFormVisible = false;
        },
        dialogConfirm() {
            this.$refs.taskForm.validate((valid) => {
                if (valid) {
                    if (this.dialogTitle === "添加任务") {
                        instance.post('/timingTask/addTask', {
                            task_name: this.taskForm.task_name,
                            timing: `${this.taskForm.timing.second} ${this.taskForm.timing.minute} ${this.taskForm.timing.hour} ${this.taskForm.timing.day} ${this.taskForm.timing.month} ${this.taskForm.timing.week}`,
                            command: this.taskForm.command,
                            describe: this.taskForm.description
                        }).then(response => {
                            console.log(response)
                            this.$message({
                                message: '添加成功！',
                                type: 'success'
                            });
                            this.dialogFormVisible = false;
                            this.getTaskList();
                        }).catch(error => {
                            console.log(error)
                        });
                    } else if (this.dialogTitle === "编辑任务") {

                        instance.post('/timingTask/updateTask', {
                            new_task_name: this.taskForm.task_name,
                            old_task_name: this.selectedRow.task_name,
                            timing: `${this.taskForm.timing.second} ${this.taskForm.timing.minute} ${this.taskForm.timing.hour} ${this.taskForm.timing.day} ${this.taskForm.timing.month} ${this.taskForm.timing.week}`,
                            command: this.taskForm.command,
                            describe: this.taskForm.description
                        }).then(response => {
                            console.log(response)
                            this.$message({
                                message: '修改成功！',
                                type: 'success'
                            });
                            this.getTaskList();
                            this.dialogFormVisible = false;
                        }).catch(error => {
                            console.log(error)
                        });
                    } else if (this.dialogTitle === "删除任务") {
                        instance.post('/timingTask/deleteTask', {
                            task_names: this.selectedRows
                        }).then(response => {
                            console.log(response)
                            this.$message({
                                message: '删除成功！',
                                type: 'success'
                            });
                            // this.getTaskList();
                            this.dialogFormVisible = false;
                            this.getTaskList();
                        }).catch(error => {
                            console.log(error)
                        });
                    }
                } else {
                    return false;
                }
            });
        },
        addTask() {
            this.dialogTitle = "添加任务";
            this.dialogFormVisible = true;
            this.taskForm.task_name = ""
            this.taskForm.timing = {
                second: '',
                minute: '',
                hour: '',
                day: '',
                month: '',
                week: '',
            }
            this.taskForm.command = ""
            this.taskForm.description = ""

        },
        generateRange(start, end) {
            return Array.from({ length: end - start + 1 }, (_, i) => i + start)
        },
        editTask() {
            this.dialogTitle = "编辑任务";
            this.dialogFormVisible = true;
            this.taskForm.task_name = this.selectedRow.task_name
            this.taskForm.timing = {
                second: this.selectedRow.timing.split(" ")[0],
                minute: this.selectedRow.timing.split(" ")[1],
                hour: this.selectedRow.timing.split(" ")[2],
                day: this.selectedRow.timing.split(" ")[3],
                month: this.selectedRow.timing.split(" ")[4],
                week: this.selectedRow.timing.split(" ")[5],
            }
            this.taskForm.command = this.selectedRow.command
            this.taskForm.description = this.selectedRow.describe
        },
        deleteTask() {
            this.$confirm('是否删除选中的任务？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                instance.post('/timingTask/deleteTask', {
                    task_names: this.selectedRows
                }).then(response => {
                    console.log(response)
                    this.$message({
                        message: '删除成功！',
                        type: 'success'
                    });
                    // this.getTaskList();
                    this.dialogFormVisible = false;
                    this.getTaskList();
                }).catch(error => {
                    console.log(error)
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
    width: 45%;
}

.timingTask .taskDialog .taskForm .timingItem {
    width: 85px;
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
}

.timingTask .taskDialog .taskForm .el-form-item__label {
    width: 60px !important;
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

.timingTask .taskDialog .taskForm .taskForm_item {
    width: 80%;
}
</style>

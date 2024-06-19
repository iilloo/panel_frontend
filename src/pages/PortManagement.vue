<template>
    <div class="portManagement">
        <div class="header">
            <el-button @click="addRule" type="success" icon="el-icon-plus" plain size="mini"></el-button>
            <el-button @click="editRule" type="primary" icon="el-icon-edit" plain size="mini"></el-button>

            <el-button @click="deleteRule" type="danger" icon="el-icon-delete" plain size="mini"></el-button>
        </div>
        <div class="table">
            <el-table class="leftTable" height="100%" :data="inRules" style="width: 45%" border>
                <el-table-column label="入站规则" width="100%">
                    <el-table-column type="selection" width="40px">
                    </el-table-column>
                    <el-table-column prop="action" label="行为" width="150">
                    </el-table-column>
                    <el-table-column prop="address" label="IP来源" width="250">
                    </el-table-column>
                    <el-table-column prop="port" label="本机端口">
                    </el-table-column>
                </el-table-column>
            </el-table>
            <el-table height="100%" :data="outRules" style="width: 45%;" border>
                <el-table-column label="出站规则" width="100%">
                    <el-table-column type="selection" width="40px">
                    </el-table-column>
                    <el-table-column prop="action" label="行为" width="150">
                    </el-table-column>
                    <el-table-column prop="address" label="IP地址" width="250">
                    </el-table-column>
                    <el-table-column prop="port" label="目标端口">
                    </el-table-column>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog width="30%" :title="dialogTile" :visible.sync="PortDialogVisible">
            <el-form :model="ruleForm">
                <el-form-item label="规则" label-width="60px">
                    <el-radio v-model="ruleForm.isInRule" :label=true>入站规则</el-radio>
                    <el-radio v-model="ruleForm.isInRule" :label=false>出站规则</el-radio>
                </el-form-item>
                <el-form-item label="行为" label-width="60px">
                    <el-radio v-model="ruleForm.action" label="allow">ALLOW</el-radio>
                    <el-radio v-model="ruleForm.action" label="deny">DENY</el-radio>
                </el-form-item>
                <el-form-item label="IP地址" label-width="60px">
                    <el-input size="mini" v-model="ruleForm.address" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="端口" label-width="60px">
                    <el-input size="mini" v-model="ruleForm.port" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="PortDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="PortDialogVisible = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'PortManagement',
    data() {
        return {
            inRules: [
                {
                    action: "ALLOW",
                    address: "104.168.25.4",
                    port: "80"
                },
                {
                    action: "DENY",
                    address: "72.145.64.58",
                    port: "22"
                },
                {
                    action: "ALLOW",
                    address: "0.0.0.0",
                    port: "443"
                },
                {
                    action: "DENY",
                    address: "0.0.0.0",
                    port: "21"
                },
                {
                    action: "ALLOW",
                    address: "104.168.25.4",
                    port: "80"
                },
                {
                    action: "DENY",
                    address: "72.145.64.58",
                    port: "22"
                },
                {
                    action: "ALLOW",
                    address: "0.0.0.0",
                    port: "443"
                },
                {
                    action: "DENY",
                    address: "0.0.0.0",
                    port: "21"
                },
                {
                    action: "ALLOW",
                    address: "114.168.25.4",
                    port: "80"
                },
                {
                    action: "DENY",
                    address: "72.145.64.58",
                    port: "22"
                },
                {
                    action: "ALLOW",
                    address: "0.0.0.0",
                    port: "10000"
                },
                {
                    action: "DENY",
                    address: "85.66.55.54",
                    port: "12000"
                },
                {
                    action: "ALLOW",
                    address: "104.36.54.123",
                    port: "80"
                },
                {
                    action: "DENY",
                    address: "70.145.65.58",
                    port: "22"
                },
                {
                    action: "ALLOW",
                    address: "1.1.1.1",
                    port: "443"
                },
                {
                    action: "DENY",
                    address: "0.0.0.0",
                    port: "8888"
                },
            ],
            outRules: [],
            PortDialogVisible: false,
            dialogTile: '',
            ruleForm: {
                isInRule: true,
                action: 'allow',
                address: '',
                port: '',
            }
        }
    },
    methods: {
        addRule() {
            this.dialogTile = '添加规则';
            this.PortDialogVisible = true;
        },
        editRule() {
            this.dialogTile = '编辑规则';
            this.PortDialogVisible = true;
        },
        deleteRule() {
            this.$confirm('此操作将永久删除该规则, 是否继续?', '提示', {
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
.portManagement {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.portManagement .header {
    display: flex;
    margin-bottom: 10px;
}

.portManagement .table .el-table .el-table__cell {
    padding: 8px 0;
}

.portManagement .table {
    flex: 1;
    overflow: auto;
    display: flex;
}

.portManagement .table .leftTable {
    margin-right: 20px;
}

</style>
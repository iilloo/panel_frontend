<template>
    <div class="headerBar">
        <el-dropdown trigger="click" @command="handleCommand">
            <i class="el-icon-setting" style="margin-right: 15px"></i>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="modify">修改账户内容</el-dropdown-item>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                <el-dropdown-item command="delete">删除账户</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <span>{{ username }}</span>
        <div class="dialog">
            <el-dialog :close-on-click-modal="false" title="修改账户信息" :visible.sync="dialogFormVisible" width="40%"
                :modal="true" @close="handleClose">
                <el-form ref="userForm" :model="userForm" :rules="rules" label-width="100px" label-position="left">
                    <el-form-item label="用户名：">
                        <span>{{ username }}</span>
                    </el-form-item>
                    <el-form-item label="当前密码：" prop="nowPassword">
                        <el-input :type="showPassword ? 'text' : 'password'" v-model="userForm.nowPassword"
                            placeholder="请输入当前密码" autocomplete="off">
                            <template #suffix>
                                <i :class="showPassword ? 'el-icon-view' : 'el-icon-view'"
                                    @click="togglePasswordVisibility(0)" style="cursor: pointer;">
                                </i>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="新密码：" prop="newPassword">
                        <el-input :type="showPassword_1 ? 'text' : 'password'" v-model="userForm.newPassword"
                            placeholder="请输入新密码" autocomplete="off">
                            <template #suffix>
                                <i :class="showPassword_1 ? 'el-icon-view' : 'el-icon-view'"
                                    @click="togglePasswordVisibility(1)" style="cursor: pointer;">
                                </i>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="确认密码：" prop="confirmPassword" autocomplete="off">
                        <el-input :type="showPassword_2 ? 'text' : 'password'" v-model="userForm.confirmPassword"
                            placeholder="请再次输入新密码">
                            <template #suffix>
                                <i :class="showPassword_2 ? 'el-icon-view' : 'el-icon-view'"
                                    @click="togglePasswordVisibility(2)" style="cursor: pointer;">
                                </i>
                            </template>
                        </el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogCancel">取 消</el-button>
                    <el-button type="primary" @click="dialogConfirm">确定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>

</template>

<script>
import vm from '../main.js'
import instance from '@/utils/axios';
export default {
    name: 'HeaderBar',
    data() {
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.userForm.confirmPassword !== '') {
                    this.$refs.userForm.validateField('confirmPassword');
                }
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.userForm.newPassword) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            username: '获取失败',
            dialogFormVisible: false,
            showPassword: false, // 控制密码显示状态
            showPassword_1: false, // 控制密码显示状态
            showPassword_2: false, // 控制密码显示状态
            userForm: {
                nowPassword: '',
                newPassword: '',
                confirmPassword: '',
            },
            rules: {
                nowPassword: [
                    { required: true, message: '请输入当前密码', trigger: 'blur' },
                    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
                ],
                newPassword: [
                    { required: true, validator: validatePass, trigger: 'blur' },
                    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
                ],
                confirmPassword: [
                    { required: true, validator: validatePass2, trigger: 'blur' },
                    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
                ]
            }

        }
    },
    methods: {
        handleClose(done) {
            this.$refs.userForm.resetFields();
            done();
        },
        // 切换密码显示状态
        togglePasswordVisibility(value) {
            if (value === 0) {
                this.showPassword = !this.showPassword;
            } else if (value === 1) {
                this.showPassword_1 = !this.showPassword_1;
            } else {
                this.showPassword_2 = !this.showPassword_2;
            }
        },
        handleCommand(command) {
            if (command === 'logout') {
                this.$confirm('此操作将退出登录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    localStorage.removeItem('token')
                    vm.$router.push('/login')
                    this.$message({
                        type: 'success',
                        message: '退出成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消退出登录'
                    });
                });

            } else if (command === 'modify') {
                this.dialogFormVisible = true

            } else if (command === 'delete') {
                this.$confirm('此操作将永久删除账户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$bus.$emit('changeLoading', true)
                    instance.post('/deleteAccount', {
                        username: this.username
                    })
                        .then(response => {
                            console.log(response)
                            this.$message({
                                message: '删除成功！',
                                type: 'success'
                            });
                            localStorage.removeItem('token')
                            this.$bus.$emit('close')
                            vm.$router.push('/login')
                            this.$bus.$emit('changeLoading', false)
                        })
                        .catch(error => {
                            console.log(error)
                            this.$bus.$emit('changeLoading', false)
                        })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            }

        },
        dialogCancel() {
            this.$message({
                type: 'info',
                message: '已取消修改'
            });
            this.dialogFormVisible = false
        },
        dialogConfirm() {
            
            this.$refs.userForm.validate((valid) => {
                if (valid) {
                    this.$bus.$emit('changeLoading', true)
                    console.log('submit!')
                    instance.post('/modifyPassword', {
                        nowPassword: this.userForm.nowPassword,
                        newPassword: this.userForm.newPassword
                    })
                        .then(response => {
                            console.log(response)
                            if (response.code === 200) {
                                this.dialogFormVisible = false
                                this.$message({
                                    message: '修改成功！',
                                    type: 'success'
                                });
                            } else {
                                this.$message({
                                    message: '修改失败！',
                                    type: 'error'
                                });
                            }
                            this.$bus.$emit('changeLoading', false)
                        })
                        .catch(error => {
                            console.log(error)
                            this.$bus.$emit('changeLoading', false)
                        })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        }
    },
    mounted() {
        this.$bus.$emit('changeLoading', true)
        instance.get('/getUserName')
            .then(response => {
                this.username = response.userName
                vm.UserName = this.username
                console.log(response)
                this.$bus.$emit('changeLoading', false)
            })
            .catch(error => {
                console.log(error)
                this.$bus.$emit('changeLoading', false)
            })
    }
}
</script>

<style scoped>
.headerBar .dialog {
    text-align: left;
    line-height: 10px;
}

.headerBar .dialog .el-form-item {
    margin-bottom: 20px;
    margin-right: 40px;
}
</style>
<template>
    <div v-loading="loading" class="fileSys">
        <div class="header">
            <div class="headerLeft">
                <el-button @click="backToPre" type="info" icon="el-icon-back" plain size="mini"></el-button>
                <el-button @click="refreshFile" type="warning" icon="el-icon-refresh-right" plain
                    size="mini"></el-button>
                <el-button @click="backToHome" type="success" icon="el-icon-house" plain size="mini"></el-button>
                <el-input calss="fileSysInput" size="small" v-model="path" @change="sendPath"
                    placeholder="请输入内容"></el-input>
            </div>
            <div class="headerRight">
                <el-button @click="addFile" type="success" icon="el-icon-document-add" plain size="mini"></el-button>
                <el-button @click="addFolder" type="success" icon="el-icon-folder-add" plain size="mini"></el-button>
                <el-button @click="renameFile" v-if="selectedRows.length === 1" type="primary" icon="el-icon-edit" plain
                    size="mini"></el-button>

                <el-button @click="deleteFile" v-if="selectedRows.length" type="danger" icon="el-icon-delete" plain
                    size="mini"></el-button>
            </div>
        </div>
        <div class="table">
            <el-table height="100%" @selection-change="handleSelectionChange" @row-dblclick="handleRowDoubleClick"
                :data="currentDirContents" style="width: 100%" border>
                <el-table-column type="selection" width="40px">
                </el-table-column>
                <el-table-column label="名称" width="300">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isDir">📁</span>
                        <span v-else>📄</span>
                        <span style="margin-left: 10px">{{ scope.row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="modTime" label="修改日期" width="400">
                </el-table-column>
                <el-table-column label="类型">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isDir">文件夹</span>
                        <span v-else>文件</span>
                    </template>
                </el-table-column>
                <el-table-column label="大小">
                    <template slot-scope="scope">
                        <span>{{ scope.row.size }} KB</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>

</template>

<script>
// import axios from 'axios';
import instance from '@/utils/axios';
import fileEditComponent from '@/components/FileEditComponent.vue'


export default {
    name: 'FileSystem',
    data() {
        return {
            currentDirContents: [],
            path: '',
            selectedRows: [],// 用于保存选中的行文件名称
            selectedRow: {},// 用于保存选中的行文件数据
            loading: false,
        }
    },
    methods: {
        sendPath() {
            const unixPathRegex = /^(\/[^/]+)+\/?$/
            if (unixPathRegex.test(this.path) === false && this.path !== '/') {
                //路径不合格的话，就设置为当前路径
                this.path = localStorage.getItem('path')
                this.$message({
                    message: '路径格式错误！',
                    type: 'error'
                });
                return Promise.resolve(false)
            } else {
                // console.log('路径格式正确')
            }
            this.loading = true
            return instance.get('/fileSys/search', {
                params: {
                    path: this.path
                },
            })
                .then(response => {
                    console.log('查询成功！search')
                    console.log(response)
                    this.currentDirContents = response.files
                    localStorage.setItem('path', this.path)
                    // this.$message({
                    //     message: '查询成功！',
                    //     type: 'success'
                    // });
                    return true
                })
                .catch(error => {
                    console.log(error)
                    this.path = localStorage.getItem('path')
                    return false
                })
                .finally(() => {
                    this.loading = false
                })
        },
        readFile(path, name) {
            this.loading = true
            instance.get('/fileSys/read', {
                params: {
                    path: path,
                }
            })
                .then(response => {
                    console.log('读取成功！read')
                    console.log(response)
                    this.selectedTextContent = response.text
                    this.$message({
                        message: '读取成功！',
                        type: 'success'
                    });
                    this.$modal.show(fileEditComponent, {
                        //向组件内传递数据
                        name: name,
                        text: response.text,
                    },
                        {
                            //model的配置
                            resizable: true,
                            clickToClose: false,
                            width: '700px',
                            height: '500px',
                            minWidth: 300,
                            minHeight: 200,
                            draggable: true,
                        })
                })
                .catch(error => {
                    console.log(error)
                })
                .finally(() => {
                    this.loading = false
                })
        },
        // 双击文件夹进入
        handleRowDoubleClick(row, column) {
            // e.stopPropagation(); 
            if (column.type === 'selection') {
                return
            }
            if (row.isDir) {
                this.path = row.path
                this.sendPath()
            } else {
                // console.log(row.path, row.name)
                this.readFile(row.path, row.name)

            }
        },
        refreshFile() {
            this.sendPath().then((res) => {
                if (res) {
                    this.$message({
                        message: '刷新成功！',
                        type: 'success'
                    });
                }
            })

        },
        backToHome() {
            this.path = '/home/kazusa/'
            this.sendPath()
        },
        backToPre() {
            if (this.path[this.path.length - 1] !== '/') {
                this.path += '/'
            }
            const path = this.path.split('/')
            path.pop()
            path.pop()
            this.path = path.join('/') + '/'
            this.sendPath()
        },
        addRequest(name, isDir) {
            this.loading = true
            instance.post('/fileSys/add', {
                path: this.path,
                name: name,
                isDir: isDir,
            })
                .then(response => {
                    console.log(response)
                    this.sendPath()
                    this.$message({
                        message: '添加成功！',
                        type: 'success'
                    });
                })
                .catch(error => {
                    console.log(error)
                })
                .finally(() => {
                    this.loading = false
                })
        },
        addFile() {

            this.$prompt('请输入文件名', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^[\w\s.-]+(\.\w+)?$/,
                inputErrorMessage: '文件名不合法！'
            }).then(({ value }) => {
                for (let i = 0; i < this.currentDirContents.length; i++) {
                    if (this.currentDirContents[i].name === value) {
                        this.$message({
                            message: '文件名已存在！',
                            type: 'error'
                        });
                        return
                    }
                }
                this.addRequest(value, false)
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消添加'
                });
            });
        },
        addFolder() {
            this.$prompt('请输入目录名', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^[\w\s.-]+$/,
                inputErrorMessage: '目录名不合法！'
            }).then(({ value }) => {
                for (let i = 0; i < this.currentDirContents.length; i++) {
                    if (this.currentDirContents[i].name === value) {
                        this.$message({
                            message: '名称已存在！',
                            type: 'error'
                        });
                        return
                    }
                }
                this.addRequest(value, true)
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消添加'
                });
            });
        },
        //更新选中的文件数据
        handleSelectionChange(val) {
            this.selectedRows = []
            for (let i = 0; i < val.length; i++) {
                this.selectedRows[i] = val[i].name
            }
            // console.log(this.selectedRows)
            this.selectedRow = {}
            if (val.length === 1) {
                this.selectedRow = { name: val[0].name, isDir: val[0].isDir }
            }
        },
        //删除文件
        deleteFile() {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.loading = true
                instance.post('/fileSys/delete', {
                    path: this.path,
                    names: this.selectedRows,
                }, {
                    headers: {
                        'Override': 'DELETE'
                    }
                })
                    .then(response => {
                        console.log(response)
                        this.sendPath()
                        this.$message({
                            message: '删除成功！',
                            type: 'success'
                        });
                    })
                    .catch(error => {
                        console.log(error)
                    })
                    .finally(() => {
                        this.loading = false
                    })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        renameFile() {
            // const path = this.path.replace(/\//g, '_')
            var matchRule = /^[\w\s.-]+$/
            var title = '请输入新文件夹名'
            var errorMessage = '文件夹名不合法！'
            if (!this.selectedRow.isDir) {
                matchRule = /^[\w\s.-]+(\.\w+)?$/
                title = '请输入新文件名'
                errorMessage = '文件名不合法！'
            }
            this.$prompt(title, '提示', {
                inputValue: this.selectedRow.name,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: matchRule,
                inputErrorMessage: errorMessage
            }).then(({ value }) => {
                for (let i = 0; i < this.currentDirContents.length; i++) {
                    if (this.currentDirContents[i].name === value) {
                        this.$message({
                            message: '名称已存在！',
                            type: 'error'
                        });
                        return
                    }
                }
                this.loading = true
                instance.post(`/fileSys/rename/${this.selectedRow.name}/${value}`, {
                    path: this.path
                })
                    .then(response => {
                        console.log(response)
                        this.sendPath()
                        this.$message({
                            message: '修改成功！',
                            type: 'success'
                        });
                    })
                    .catch(error => {
                        console.log(error)
                    })
                    .finally(() => {
                        this.loading = false
                    })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消修改'
                });
            });

        },
        sendContent(text1, name1) {
            console.log('sendContent')
            instance.put('/fileSys/write', {
                path: this.path,
                name: name1,
                text: text1,
            })
                .then(response => {
                    console.log(response)
                    this.$message({
                        message: '保存成功！',
                        type: 'success'
                    });
                })
                .catch(error => {
                    console.log(error)
                })
        },
        async sendContent1(text1, name1) {
            console.log('sendContent')
            try {
                const response = await instance.put('/fileSys/write', {
                    path: this.path,
                    name: name1,
                    text: text1,
                })
                console.log(response)
                if (response.status === 200) {
                    return true
                } else {
                    return false
                }
            } catch (error) {
                console.log(error)
                return false
            }
        },
    },

    mounted() {
        // localStorage.setItem('path', this.path)
        this.path = localStorage.getItem('path') || '/home/kazusa/'
        this.sendPath()
    },
    created() {
        this.$bus.$on('saveFile', (text1, name1, callback) => {
            const res = this.sendContent1(text1, name1)
            callback(res)
        })
    },
    components: {
    }
}
</script>

<style>
.fileSys .header .el-input__inner {
    height: 32px;
    line-height: 32px;
    font-size: 20px;
    padding: 0 10px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    background-color: #f4f4f4;
    color: #606266;
    transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    box-sizing: border-box;

}

.fileSys .el-input--small {
    width: 500px;
    padding: 0 10px;
}

.el-table .el-table__cell {
    padding: 8px 0;
    /* font-size: 20px; */
    /* line-height: 40px; */
}

.fileSys .header {
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
}

.fileSys .header .headerLeft {
    flex: 0 0 auto;
    display: flex;
}

.fileSys .header .headerRight {
    flex: 0 0 auto;
    display: flex;
}

.fileSys .el-button {
    padding: 8px 8px;
    bottom: 2px;
}

.fileSys {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

}

.fileSys .table {
    flex: 1;
    /* overflow: none; */
    /* height: 100%; */
    overflow: auto;
}
</style>

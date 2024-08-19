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
                <el-button @click="addFile" type="success" icon="el-icon-document-add" plain size="mini"></el-button>
                <el-button @click="addFolder" type="success" icon="el-icon-folder-add" plain size="mini"></el-button>
                <el-button @click="deleteFile" v-if="selectedRows.length && !isOperate" type="danger"
                    icon="el-icon-delete" plain size="mini"></el-button>
            </div>
            <div class="headerRight">

                <el-button @click="renameFile" v-if="selectedRows.length === 1 && !isOperate" type="primary"
                    icon="el-icon-edit" plain size="mini"></el-button>

                <el-button @click="cutFile" v-if="selectedRows.length && !isOperate" type="warning"
                    icon="el-icon-scissors" plain size="mini"></el-button>
                <el-button @click="copyFile" v-if="selectedRows.length && !isOperate" type="primary"
                    icon="el-icon-copy-document" plain size="mini"></el-button>

                <el-button @click="pasteFile" v-if="isOperate" type="info" icon="el-icon-document-copy" plain
                    size="mini"></el-button>

                <el-button @click="cancelOptions" v-if="isOperate" type="success" icon="el-icon-close" plain
                    size="mini"></el-button>

                <!-- <el-button @click="deleteFile" v-if="selectedRows.length && !isOperate" type="danger"
                    icon="el-icon-delete" plain size="mini"></el-button> -->
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
            <!-- 隐藏文件输入框 -->
            <input type="file" ref="fileInput" @change="uploadFile" style="display: none;"
                :multiple="isChromium ? true : false" />
            <input type="file" ref="folderInput" @change="uploadFile" style="display: none;"
                :webkitdirectory="isChromium ? true : false" :multiple="isChromium ? true : false" />

        </div>
        <div class="toolbar">
            <el-button type="primary" plain v-if="selectedRows.length && !isOperate">
                <i class="el-icon-download"></i>
            </el-button>
            <el-button type="info" @click="triggerFileDialog" plain>
                <i class="el-icon-upload2"></i>
            </el-button>
            <el-button type="info" @click="triggerFolderDialog" plain>
                <i class="el-icon-upload"></i>
            </el-button>
        </div>
        <div class="unfoldIcon">
            <el-button plain class="unfoldButton" @click="unfoldDrawer">
                <i class="el-icon-arrow-up"></i>
            </el-button>
        </div>
        <el-drawer class="drawer" size="100%" :withHeader="false" :wrapperClosable="false" :modal="false"
            :modal-append-to-body="false" title="复制进度" :visible.sync="isFold" :direction="unFoldDirection">
            <el-button plain class="drawerCloseButton" @click="closeDrawer">
                <i class="el-icon-close"></i>
            </el-button>
            <el-tabs class="drawerTabs">
                <el-tab-pane label="复制进度">
                    <el-table class="drawerTable" height="100%" style="width: 100%" border :data=SSEInfos>
                        <el-table-column prop="srcFileName" label="源文件名" width="450px">
                        </el-table-column>
                        <el-table-column prop="destFileName" label="目标文件名" width="450px">
                        </el-table-column>
                        <el-table-column prop="totalBytes" label="总字节数" width="220px">
                        </el-table-column>
                        <el-table-column prop="progressPercentage" label="进度">
                            <template slot-scope="scope">
                                <el-progress :color="customColorMethod" :percentage="scope.row.progressPercentage"
                                    :format="progressFormat"></el-progress>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="上传进度">
                    <el-table class="drawerTable" height="100%" style="width: 100%" border :data="uploadFileProgress">
                        <el-table-column prop="uploadFileName" label="上传文件名" width="450px">
                        </el-table-column>
                        <el-table-column prop="totalBytes" label="总字节数" width="220px">
                        </el-table-column>
                        <el-table-column prop="progressPercentage" label="进度">
                            <template slot-scope="scope">
                                <el-progress :color="customColorMethod" :percentage="scope.row.progressPercentage"
                                    :format="progressFormat"></el-progress>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-drawer>
    </div>

</template>

<script>
// import axios from 'axios';
import instance from '@/utils/axios';
import fileEditComponent from '@/components/FileEditComponent.vue'
import { EventSourcePolyfill } from 'event-source-polyfill';


export default {
    name: 'FileSystem',
    data() {
        return {
            currentDirContents: [],// 用于保存当前目录下的文件信息
            path: '',// 用于保存当前路径
            selectedRows: [],// 用于保存选中的行文件名称
            selectedRow: {},// 用于保存选中的行文件数据
            loading: false,
            preSelectedRows: [],// 用于保存复制或剪切的文件名称
            pasteDeleteFiles: [],// 用于保存粘贴时由于同名需要删除的文件名称
            prePath: '', // 用于保存复制或剪切的源文件目录路径
            isCut: false,// 用于标识是否为剪切操作
            isOperate: false,// 用于标识是否为复制或剪切操作
            SSEInfos: [
                {
                    eventSource: null,
                    totalBytes: 0,
                    progressPercentage: 0,
                    srcFileName: '',
                    destFileName: '',
                },
            ],
            uploadFileProgress: [
                {
                    eventSource: null,
                    totalBytes: 0,
                    progressPercentage: 0,
                    uploadFileName: '',
                    destFilePath: '',
                },
            ],
            isFold: false,
            unFoldDirection: 'btt',
            isChromium: false, // 标识是否为 Chromium 浏览器
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
        addRequest: async function (name, isDir) {
            this.loading = true
            try {
                const response = await instance.post('/fileSys/add', {
                    path: this.path,
                    name: name,
                    isDir: isDir,
                })
                console.log('收到响应:', response);
                if (response) {
                    this.$message({
                        message: '添加成功！',
                        type: 'success'
                    });
                    await this.sendPath()
                }
            } catch (error) {
                console.log(error)
                this.$message({
                    message: '添加失败！',
                    type: 'error'
                });
            } finally {
                this.loading = false
            }
            // instance.post('/fileSys/add', {
            //     path: this.path,
            //     name: name,
            //     isDir: isDir,
            // })
            //     .then(response => {
            //         console.log(response)
            //         this.sendPath()
            //         this.$message({
            //             message: '添加成功！',
            //             type: 'success'
            //         });
            //     })
            //     .catch(error => {
            //         console.log(error)
            //     })
            //     .finally(() => {
            //         this.loading = false
            //     })
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
            }).then(async () => {
                this.loading = true
                try {
                    const response = await instance.post('/fileSys/delete', {
                        path: this.path,
                        names: this.selectedRows,
                    }, {
                        headers: {
                            'Override': 'DELETE'
                        }
                    })
                    console.log('收到响应:', response);
                    if (response.code === 200) {
                        this.$message({
                            message: '删除成功！',
                            type: 'success'
                        });
                        await this.sendPath()
                    }
                } catch (error) {
                    console.log(error)
                    this.$message({
                        message: '删除失败！',
                        type: 'error'
                    });
                } finally {
                    this.loading = false
                }
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
            }).then(async ({ value }) => {
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
                try {
                    const response = await instance.post(`/fileSys/rename/${this.selectedRow.name}/${value}`, {
                        path: this.path
                    })
                    if (response.code === 200) {
                        this.$message({
                            message: '修改成功！',
                            type: 'success'
                        });
                        await this.sendPath()
                    }
                } catch (error) {
                    console.log(error)
                    this.$message({
                        message: '修改失败！',
                        type: 'error'
                    });
                } finally {
                    this.loading = false
                }
                // instance.post(`/fileSys/rename/${this.selectedRow.name}/${value}`, {
                //     path: this.path
                // })
                //     .then(response => {
                //         console.log(response)
                //         this.sendPath()
                //         this.$message({
                //             message: '修改成功！',
                //             type: 'success'
                //         });
                //     })
                //     .catch(error => {
                //         console.log(error)
                //     })
                //     .finally(() => {
                //         this.loading = false
                //     })
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
        sendContent1: async function (text1, name1) {
            console.log('sendContent')
            try {
                const response = await instance.put('/fileSys/write', {
                    path: this.path,
                    name: name1,
                    text: text1,
                })
                console.log('收到响应:', response);
                console.log('状态码:', response.code);
                console.log('响应数据:', response.msg);
                if (response.code === 200) {
                    return true
                } else {
                    return false
                }
            } catch (error) {
                console.log(error)
                console.error('请求发生错误:', error.message || error);
                return false
            }
        },
        saveFileHandler: async function (text1, name1, callback) {
            console.log('saveFile')
            try {
                const res = await this.sendContent1(text1, name1);
                callback(res);
            } catch (error) {
                console.error('Error in saveFile:', error);
                callback(false); // 或者根据您的错误处理策略进行调整
            }
        },
        cutFile() {
            this.preSelectedRows = this.selectedRows
            this.prePath = this.path
            this.isOperate = true
            this.isCut = true
        },
        copyFile() {
            this.preSelectedRows = this.selectedRows
            this.prePath = this.path
            this.isOperate = true
            this.isCut = false
        },
        async handleSamefileName() {
            for (let i = 0; i < this.preSelectedRows.length; i++) {
                for (let j = 0; j < this.currentDirContents.length; j++) {
                    if (this.preSelectedRows[i] === this.currentDirContents[j].name) {
                        await this.$confirm(`<div style="word-wrap: break-word;">是否覆盖该文件夹下的同名文件<br>${this.preSelectedRows[i]}</div>`, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning',
                            dangerouslyUseHTMLString: true,
                        }).then((action) => {
                            if (action === 'confirm') {
                                this.pasteDeleteFiles.push(this.preSelectedRows[i])
                            } else {
                                // preSelectedRows中删除currentDirContents中已存在的文件
                                this.preSelectedRows.splice(i, 1)
                            }
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消操作'
                            });
                            // preSelectedRows中删除currentDirContents中已存在的文件
                            this.preSelectedRows.splice(i, 1)
                        });
                        break;
                    }
                }
            }
        },
        pasteFile() {
            this.$confirm('此操作将复制或剪切文件到当前目录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                //文件为剪切的情况
                if (this.isCut === true) {
                    await this.handleSamefileName()
                    if (this.preSelectedRows.length === 0) {
                        this.$message({
                            message: 'paste文件数为0无需操作！',
                            type: 'info'
                        });
                        this.isOperate = false
                        this.isCut = false
                        this.loading = false
                        return
                    }
                    this.loading = true
                    try {
                        const response = await instance.post('/fileSys/cutPaste', {
                            names: this.preSelectedRows,
                            deleteNames: this.pasteDeleteFiles,
                            oldPath: this.prePath,
                            newPath: this.path,
                        })
                        console.log(response)
                        if (response.code === 200) {

                            this.$message({
                                message: '粘贴成功！',
                                type: 'success'
                            });
                            await this.sendPath()
                        }
                    } catch (error) {
                        console.log(error)
                        this.$message({
                            message: '粘贴失败！',
                            type: 'error'
                        });
                    } finally {
                        this.isOperate = false
                        this.isCut = false
                        this.loading = false
                    }
                } else {
                    //文件为复制的情况
                    this.loading = false
                    await this.handleSamefileName()
                    if (this.preSelectedRows.length === 0) {
                        this.$message({
                            message: 'copy文件数为0无需操作！',
                            type: 'info'
                        });
                        this.isOperate = false
                        this.isCut = false
                        return
                    }
                    this.startCopy()
                    this.isOperate = false
                }

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                });
            });
        },
        cancelOptions() {
            this.isOperate = false
            this.isCut = false
        },
        startCopy() {
            const params = new URLSearchParams();
            params.append('names', JSON.stringify(this.preSelectedRows));
            params.append('oldPath', this.prePath);
            params.append('newPath', this.path);
            const token = localStorage.getItem('token')
            const eventSource = new EventSourcePolyfill(`http://192.168.124.101:8888/fileSys/copyPaste?${params.toString()}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            const SSEInfo = {
                eventSource: eventSource,
                totalBytes: 0,
                progressPercentage: 0,
                srcFileName: '',
                destFileName: '',
            }
            this.SSEInfos.push(SSEInfo)
            const index = this.SSEInfos.length - 1
            eventSource.onmessage = (event) => {
                const data = event.data
                console.log(`SSE服务端数据[${index}]:`, data)
                if (data.includes('Copy operation completed!')) {
                    this.SSEInfos[index].progressPercentage = 100
                    eventSource.close();
                    this.$message({
                        message: '复制成功！',
                        type: 'success'
                    });
                    this.sendPath()
                } else if (data.includes('Percent')) {
                    this.SSEInfos[index].progressPercentage = parseFloat(data.split(':')[1])
                } else if (data.includes('TotalBytes')) {
                    this.SSEInfos[index].totalBytes = parseInt(data.split(':')[1])
                } else if (data.includes('SrcFileName')) {
                    this.SSEInfos[index].srcFileName = data.split(':')[1]
                } else if (data.includes('DestFileName')) {
                    this.SSEInfos[index].destFileName = data.split(':')[1]
                }

            }

            eventSource.onerror = (error) => {
                console.error(`EventSource error [${index}]:`, error);
                eventSource.close();
            };
        },
        unfoldDrawer() {
            this.isFold = true
        },
        progressFormat(percentage) {
            return percentage === 100 ? '完成' : `${percentage}%`
        },
        customColorMethod(percentage) {
            if (percentage === 100) {
                return '#67c23a'
            } else {
                return '#1989fa'
            }
        },
        closeDrawer() {
            this.isFold = false
        },
        // 触发文件选择对话框
        triggerFileDialog() {
            this.$refs.fileInput.click();
        },
        triggerFolderDialog() {
            this.$refs.folderInput.click();
        },
        // 上传文件
        uploadFile(event) {
            const timeIndex = new Date().toString()
            const files = event.target.files;
            if (files.length > 0) {
                // 创建SSE连接获取各次上传进度
                const token = localStorage.getItem('token')
                const params = new URLSearchParams();
                params.append('timeIndex', timeIndex);
                const eventSource = new EventSourcePolyfill(`http://192.168.124.101:8888/fileSys/uploadFileProgress?${params.toString()}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    },
                );
                const uploadFileProgress = {
                    eventSource: eventSource,
                    totalBytes: 0,
                    progressPercentage: 0,
                    uploadFileName: '',
                    destFilePath: this.path,
                }
                this.uploadFileProgress.push(uploadFileProgress)
                const index = this.uploadFileProgress.length - 1
                eventSource.onmessage = (event) => {
                    const data = event.data
                    console.log(`uploadFile-SSE服务端数据[${index}]:`, data)
                    if (data.includes('Upload operation completed!')) {
                        this.uploadFileProgress[index].progressPercentage = 100
                        eventSource.close();
                        this.$message({
                            message: '上传成功！',
                            type: 'success'
                        });
                        this.sendPath()
                    } else if (data.includes('Percent')) {
                        this.uploadFileProgress[index].progressPercentage = parseFloat(data.split(':')[1])
                    } else if (data.includes('TotalBytes')) {
                        this.uploadFileProgress[index].totalBytes = parseInt(data.split(':')[1])
                    } else if (data.includes('uploadFileName')) {
                        this.uploadFileProgress[index].uploadFileName = data.split(':')[1]
                    }
                }
                eventSource.onerror = (error) => {
                    console.error(`EventSource error [${index}]:`, error);
                    eventSource.close();
                }
                const formData = new FormData();
                formData.append("path", this.path);
                formData.append("timeIndex", timeIndex);
                for (let i = 0; i < files.length; i++) {
                    formData.append("files", files[i]);
                }
                //上传文件
                instance.post('/fileSys/uploadFile', formData)
                    .then(response => {
                        console.log(response)
                        this.$message({
                            message: '上传成功！',
                            type: 'success'
                        });
                        this.sendPath()
                    })
                    .catch(error => {
                        console.log(error)
                        this.$message({
                            message: '上传失败！',
                            type: 'error'
                        });
                    })
                    .finally(() => {

                    })
            }

        },
        uploadFolder(event) {
            const files = event.target.files;
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append("files", files[i]);
            }
        },

    },

    mounted() {
        // localStorage.setItem('path', this.path)
        this.path = localStorage.getItem('path') || '/home/kazusa/'
        this.sendPath()
        // 获取并转为小写的 userAgent 字符串
        const userAgent = navigator.userAgent.toLowerCase();
        // 判断是否为基于 Chromium 的浏览器
        const isChromium = !!window.chrome && (userAgent.includes("chrome") || userAgent.includes("edg") || userAgent.includes("opr"));
        this.isChromium = isChromium;
    },
    created() {
        this.$bus.$on('saveFile', this.saveFileHandler);
    },
    beforeDestroy() {
        this.$bus.$off('saveFile', this.saveFileHandler);
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

.fileSys .header .el-input--small {
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

.fileSys .header .el-button {
    padding: 8px 8px;
    bottom: 2px;
}

.fileSys {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;

}

.fileSys .table {
    flex: 1;
    /* overflow: none; */
    /* height: 100%; */
    overflow: auto;
}

.fileSys .table .el-table .cell {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}


.fileSys .toolbar {
    position: fixed;
    /* 固定定位 */
    bottom: 34px;
    /* 距离底部 0 像素 */
    right: 40px;
    /* 距离右边 0 像素 */
    z-index: 3100;
    /* 设置一个很大的 z-index 确保浮在其他元素之上 */

    /* width: 100px; */
    /* background-color: #f4f4f4; */
    display: flex;
    /* justify-content: center; */
    flex-direction: column;
}

.fileSys .toolbar .el-button {
    margin-top: 10px;
    margin-left: 0px;
    padding: 0px;
    height: 32px;
    width: 32px;
}

.fileSys .drawer {
    position: relative !important;
    width: 100%;
    height: 40%;
    bottom: 0px;
    top: auto;
}

.fileSys .drawer .btt {
    border: 1px solid #ebeef5;
}

.fileSys .drawer .drawerCloseButton {
    position: absolute;
    right: 3px;
    top: 3px;
    height: 30px;
    width: 30px;
    padding: 0px;
    font-size: 20px;
    border: 0px;
    z-index: 3000;
}

.fileSys .drawer .el-drawer__body {
    padding: 10px;
    padding-top: 0px;
    padding-bottom: 10px;
}

.fileSys .drawer .el-table .cell {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}


.fileSys .drawer .drawerTabs {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.fileSys .drawer .drawerTabs .el-tabs__content {
    flex-grow: 1;
}

.fileSys .drawer .drawerTabs .el-tabs__content .el-tab-pane {
    height: 100%;
}


.fileSys .unfoldIcon {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 5px;
    font-size: larger;
}

.fileSys .unfoldIcon .unfoldButton {
    border-width: 0px;
}
</style>

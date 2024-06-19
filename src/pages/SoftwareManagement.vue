<template>
    <div class="softwareManagement">
        <div class="left">
            <div class="header">
                <el-input calss="input" size="small" placeholder="(软件包管理)请输入内容"></el-input>
                <el-button @click="deleteSoftware" type="danger" icon="el-icon-delete" plain size="mini"></el-button>
            </div>
            <div class="table">
                <el-table height="100%" :data="softwaresInfos" style="width: 100%" border>
                    <el-table-column type="selection" width="40px">
                    </el-table-column>
                    <el-table-column prop="name" label="软件包名称" width="150">
                    </el-table-column>
                    <el-table-column prop="version" label="发行版本" width="150">
                    </el-table-column>
                    <el-table-column prop="architecture" label="包架构" width="100">
                    </el-table-column>
                    <el-table-column prop="Description" label="描述">
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="right">
            <div class="header">
                <el-input calss="input" size="small" placeholder="(用户可执行文件管理)请输入内容"></el-input>
                <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>
            </div>
            <div class="table">
                <el-table height="100%" :data="executableFiles" style="width: 100%" border>

                    <el-table-column type="selection" width="40px">
                    </el-table-column>
                    <el-table-column prop="name" label="可执行文件名称" width="150">
                    </el-table-column>
                    <el-table-column prop="path" label="路径">
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "softwareManagement",
    data() {
        return {
            softwaresInfos: [
                {
                    name: "adduser",
                    version: "3.118ubuntu2",
                    architecture: "all",
                    Description: "add and remove users and groups"
                },
                {
                    name: "alsa-topology-conf ",
                    version: "1.2.2-1",
                    architecture: "all",
                    Description: "ALSA topology configuration files"
                },
                {
                    name: "alsa-ucm-conf",
                    version: "1.2.2-1ubuntu0.13",
                    architecture: "all",
                    Description: " ALSA Use Case Manager configuration files"
                },
                {
                    name: "amd64-microcode",
                    version: "3.20191218.1ubuntu1.2",
                    architecture: "amd64",
                    Description: "Processor microcode firmware for AMD CPUs"
                },
                {
                    name: "apparmor",
                    version: "2.13.3-7ubuntu5.3",
                    architecture: "amd64",
                    Description: "user-space parser utility for AppArmor"
                },
                {
                    name: "apt",
                    version: "2.0.10",
                    architecture: "amd64",
                    Description: "commandline package manager"
                },
                {
                    name: "apt-transport-https",
                    version: "2.0.10",
                    architecture: "all",
                    Description: "transitional package for https support"
                },
                {
                    name: "apt-utils",
                    version: "2.0.10",
                    architecture: "amd64",
                    Description: "package management related utility programs"
                },
                {
                    name: "attr",
                    version: "1:2.4.48-5",
                    architecture: "amd64",
                    Description: "utilities for manipulating filesystem extended attributes"
                },
                {
                    name: "base-files",
                    version: "11ubuntu5.7",
                    architecture: "amd64",
                    Description: "Debian base system miscellaneous files"
                },
                {
                    name: "base-passwd ",
                    version: "3.5.47",
                    architecture: "amd64",
                    Description: "Debian base system master password and group files"
                },
                {
                    name: "bash",
                    version: "5.0-6ubuntu1.2 ",
                    architecture: "amd64",
                    Description: "GNU Bourne Again SHell"
                },
                {
                    name: "bind9-dnsutils",
                    version: "1:9.16.1-0ubuntu2.16",
                    architecture: "amd64",
                    Description: "Clients provided with BIND 9"
                },
                {
                    name: "bind9-host ",
                    version: "1:9.16.1-0ubuntu2.16",
                    architecture: "amd64",
                    Description: "DNS Lookup Utility"
                },
                {
                    name: "bind9-libs:amd64",
                    version: "1:9.16.1-0ubuntu2.16",
                    architecture: "amd64",
                    Description: "Shared Libraries used by BIND 9"
                },
                {
                    name: "bsdutils",
                    version: "1:2.34-0.1ubuntu9.4",
                    architecture: "amd64",
                    Description: "basic utilities from 4.4BSD-Lite"
                },
                {
                    name: "busybox-initramfs",
                    version: "1:1.30.1-4ubuntu6.4",
                    architecture: "amd64",
                    Description: "Standalone shell setup for initramfs"
                },
                {
                    name: "bzip2",
                    version: "1.0.8-2",
                    architecture: "amd64",
                    Description: "high-quality block-sorting file compressor - utilities"
                },
            ],
            executableFiles: [
                {
                    name: "ecs.sh",
                    path: "/root/ecs.sh",
                },
                {
                    name: "kejilion.sh",
                    path: "/root/kejilion.sh",
                },
                {
                    name: "tcpx.sh",
                    path: "/root/tcpx.sh",
                },
            ],
        }

    },
    methods: {
        deleteSoftware() {
            this.$confirm('此操作将永久删除该软件包, 是否继续?', '提示', {
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
.softwareManagement {
    width: 100%;
    height: 100%;
    display: flex;
}

.softwareManagement .left {
    flex: 5;
    overflow: auto;
    display: flex;
    flex-direction: column;
    /* margin-right: 25px; */
}

.softwareManagement .right {
    flex: 3;
    overflow: auto;
    display: flex;
    flex-direction: column;
    margin-left: 25px;
}

.softwareManagement .table {
    flex: 1;
    overflow: auto;
}

.softwareManagement .header {
    display: flex;
    margin-bottom: 10px;
    justify-content: space-between;
}

.softwareManagement .header .el-input {
    padding-left: 0;
    flex: 0 0 auto;
    width: 300px;
}

.softwareManagement .header .el-input .el-input__inner {
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

.softwareManagement .header .el-button {
    flex: 0 0 auto;
}
</style>
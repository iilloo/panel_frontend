<template>
    <div class="executableFileManagement">
        <div class="header">
            <el-input calss="input" size="small" placeholder="请输入内容"></el-input>
            <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>
        </div>
        <div class="table">
            <el-table height="100%" :data="softwaresInfos" style="width: 100%" border>
                <el-table-column type="selection" width="40px">
                </el-table-column>
                <el-table-column prop="name" label="软件包名称" width="200">
                </el-table-column>
                <el-table-column prop="version" label="发行版本" width="200">
                </el-table-column>
                <el-table-column prop="architecture" label="包架构" width="200">
                </el-table-column>
                <el-table-column prop="Description" label="描述">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
export default {
    name: "ExecutableFileManagement"
}
</script>

<style>
.executableFileManagement {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.executableFileManagement .table {
    flex: 1;
    overflow: auto;
}

.executableFileManagement .header {
    display: flex;
    margin-bottom: 10px;
    justify-content: space-between;
}

.executableFileManagement .header .el-input {
    padding-left: 0;
    flex: 0 0 auto;
    width: 300px;
}
.executableFileManagement .header .el-input .el-input__inner {
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

.executableFileManagement .header .el-button {
    flex: 0 0 auto;
}
</style>
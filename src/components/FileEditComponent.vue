<template>
    <div v-loading="loading" class="fileEditor">
        <el-row>
            <el-button :disabled="isSave" @click="saveFile" size="mini" type="primary" class="saveFile">保存</el-button>
            <el-button size="mini" plain v-if="fileName" class="fileName">{{ fileName }}</el-button>
            <el-button circle size="mini" @click="closeFile" class="fileClose" plain>
                <i class="el-icon-close"></i>

            </el-button>

        </el-row>
        <div class="main">
            <el-input type="textarea" placeholder="无内容" v-model="textContent">
            </el-input>
        </div>

    </div>
</template>

<script>
import EventBus from '../eventBus/event_bus'
export default {
    name: 'FileEditComponent',
    data() {
        return {
            fileName: this.name,
            textContent: this.text,
            isSave: true,
            loading: false,
        }
    },
    props: {
        text: {
            type: String,
            default: '',
            reqired: true,
        },
        name: {
            type: String,
            default: '',
            reqired: true,
        }
    },
    methods: {
        saveFile() {
            //开始loading
            this.loading = true;
            return new Promise((resolve) => {
                EventBus.$emit('saveFile', this.textContent, this.fileName, (res) => {
                    console.log('bbbbbb');
                    if (res) {
                        console.log(res);
                        this.isSave = true;
                        this.$message.success('保存成功');
                        resolve(true);
                    } else {
                        this.$message.error('保存失败');
                        resolve(false);
                    }
                    //结束loading
                    this.loading = false;
                });
            });


        },
        closeFile: async function () {
            if (this.isSave) {
                this.$emit('close');
                return;
            }
            this.$confirm('检测到未保存的内容，是否在离开页面前保存修改？', '确认信息', {
                distinguishCancelAndClose: true,
                confirmButtonText: '保存并关闭',
                cancelButtonText: '直接关闭',
                type: 'warning'
            }).then(async (action) => {
                const isSave = await this.saveFile();
                // this.$emit('close');
                if (isSave && action === 'confirm') {
                    this.$emit('close');
                }
            }).catch(
                action => {
                    if (action === 'cancel') {
                        this.$emit('close');
                    }
                },
            );
        },
    },
    watch: {
        textContent(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.isSave = false;
            }
        },
    },
    components: {

    }
}
</script>

<style>
.fileEditor {
    height: 100%;
    display: flex;
    /* align-content: center; */
    /* flex-wrap: nowrap; */
    flex-direction: column;
}

.fileEditor .el-input__inner {
    width: 400px;

}

.fileEditor .el-row {
    padding: 10px 12px;
    display: flex;
    position: relative;
    padding-bottom: 6px;
}

.fileEditor .fileClose {
    position: absolute;
    right: 5px;
    top: 5px;
}



.fileEditor .el-textarea__inner {
    height: 100%;
    resize: none;

}

.fileEditor .el-textarea {
    height: 100%;
}

.fileEditor .main {
    height: 100%;
    padding: 10px;
    padding-top: 0px;
    /* display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center; */
}

.fileEditor .fileName {
    margin-left: 5px;
    padding-left: 5px;
    padding-right: 5px;
}
</style>
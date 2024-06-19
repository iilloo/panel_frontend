<template>
  <div class="file">
    <el-row>
      <el-col :span="6">📄 {{ name }}</el-col>
      <el-col :span="6">文件</el-col>
      <el-col :span="6"></el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'FileComponent',
  data() {
    return {
      name: this.file.name,
      isDir: this.file.isDir
    }
  },
  props: {
    file: {
      type: Object,
      required: true
    }
  },
}
</script>
<template>
  <div v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.7)">
    <router-view>
    </router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      fullscreenLoading: false
    }
  },
  components: {

  },
  created() {
    //当路由跳转时，先全屏显示loading，跳转结束后再关闭loading
    this.$bus.$on('changeLoading', (value) => {
      console.log('changeLoading', value)
      this.fullscreenLoading = value
    })
  }
}
</script>

<style></style>

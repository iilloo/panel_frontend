<template>
    <div class="mainBody">
        <keep-alive include="TerminalSys">
            <router-view></router-view>
        </keep-alive>

    </div>
</template>

<script>



// import instance from '@/utils/axios';
export default {
    name: 'MainBody',
    data() {
        return {

        }
    },
    methods: {
        routerChangeHandler(pathName) {
            if (this.$route.name === pathName) {
                return
            }
            this.$router.push({
                name: pathName,
            }).catch(err => {
                if (err.name !== 'NavigationDuplicated') {
                    console.log('err:NavigationDuplicated')
                } else {
                    throw err
                }
            })
        },
    },
    created() {
        this.$bus.$on('routeChange', this.routerChangeHandler)
    },
    beforeDestroy() {
        this.$bus.$off('routeChange', this.routerChangeHandler)
    },
    mounted() {
        if (this.$route.name !== 'timingTask') {
            this.$router.push({
                name: 'timingTask',
            })
        }
    }
}
</script>

<style scoped>
.mainBody {
    width: 100%;
    height: 100%;
}
</style>
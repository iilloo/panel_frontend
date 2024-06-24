<template>
    <div class="mainBody">
        <keep-alive include="TerminalSys">
            <router-view></router-view>
        </keep-alive>
        
    </div>
</template>

<script>


export default {
    name: 'MainBody',
    data() {
        return {

        }
    },
    created() {
        this.$bus.$on('routeChange', (pathName) => {
            if (this.$route.name !== pathName) {
                this.$router.push({
                    name: pathName,
                })
            }
        })
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
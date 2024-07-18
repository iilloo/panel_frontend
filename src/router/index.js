import VueRouter from "vue-router";
import LoginView from "@/pages/LoginView.vue";
import HomeView from "@/pages/HomeView.vue";
import FileSystem from "@/pages/FileSystem.vue";
import ExecutableFileManagement from "@/pages/ExecutableFileManagement.vue";
import GarbageCleaning from "@/pages/GarbageCleaning.vue";
import HostStatus from "@/pages/HostStatus.vue";
import PortManagement from "@/pages/PortManagement.vue";
import ProcessManagement from "@/pages/ProcessManagement.vue";
import SoftwareManagement from "@/pages/SoftwareManagement.vue";
import TerminalSystem from "@/pages/TerminalSystem.vue";
import TimingTask from "@/pages/TimingTask.vue";
import TerminalSys from "@/pages/TerminalSys.vue";
import instance from "@/utils/axios.js";
import EventBus from "@/eventBus/event_bus";

// import vm from "@/main.js";

const router = new VueRouter({      // VueRouter configuration object
    routes: [
        {
            path: "/login",
            name: "login",
            component: LoginView
        },
        {
            path: "/home",
            name: "home",
            component: HomeView,
            children: [
                {
                    path: "fileSystem",
                    name: "fileSystem",
                    component: FileSystem,
                },
                {
                    path: "executableFileManagement",
                    name: "executableFileManagement",
                    component: ExecutableFileManagement,
                },
                {
                    path: "garbageCleaning",
                    name: "garbageCleaning",
                    component: GarbageCleaning,
                },
                {
                    path: "hostStatus",
                    name: "hostStatus",
                    component: HostStatus,
                },
                {
                    path: "portManagement",
                    name: "portManagement",
                    component: PortManagement,
                },
                {
                    path: "processManagement",
                    name: "processManagement",
                    component: ProcessManagement,
                },
                {
                    path: "softwareManagement",
                    name: "softwareManagement",
                    component: SoftwareManagement,
                },
                {
                    path: "terminalSystem",
                    name: "terminalSystem",
                    component: TerminalSystem,
                },
                {
                    path: "timingTask",
                    name: "timingTask",
                    component: TimingTask,
                },
                {
                    path: "terminalSys",
                    name: "terminalSys",
                    component: TerminalSys,
                },

            ]

        },
        {
            path: "/",
            redirect: "/home"
        }
    ]

}); // Add closing curly brace

async function isLogin() {
    const token = window.localStorage.getItem('token');
    var flag = false;
    if (token === null) {
        console.log('token为空');
        return flag;
    } else {
        try {
            const response = await instance.get('/checkToken');
            if (response.code === 200) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.log('请求失败');
            console.log(err);
            return false;
        }
    }
}
//全局路由守卫，初始化和路由切换时触发
router.beforeEach((to, from, next) => {
    EventBus.$emit('changeLoading', true);
    console.log('------------------');
    console.log('form:' + from.path);
    console.log('to:' + to.path);
    console.log('----------');
    (async () => {

        if (to.path === '/login') {
            return next();
        }
        if (from.path === '/login') {
            return next();
        }
        let flag = await isLogin();
        EventBus.$emit('changeLoading', false);
        if (!flag) {
            window.localStorage.removeItem('token');
            return next('/login');
        }
        return next();
    })();
    // EventBus.$emit('changeLoading', false);
});

// Add empty function



export default router; // Export the router object

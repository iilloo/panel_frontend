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

const router = new VueRouter({      // VueRouter configuration object
    routes: [
        {
            path: "/Login",
            name: "login",
            component: LoginView
        },
        {
            path: "/Home",
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
//全局路由守卫，初始化和路由切换时触发
router.beforeEach((to, from, next) => {
    // console.log('topath:', to.fullPath);
    // console.log('frompath:', from.fullPath);
    //获取token
    const token = window.localStorage.getItem('token');
    //判断
    if (to.path === '/login') {
        //如果是登录页面，直接放行
        next();
    } else {
        //如果不是登录页面
        //判断是否有token
        if (!token) {
            //如果没有token，跳转到登录页面
            next('/login');
        } else {
            //如果有token，直接放行
            next();
        }
    }
}); 

// Add empty function



export default router; // Export the router object

import axios from 'axios'
import vm from '../main.js'
const instance = axios.create({
    baseURL: 'http://192.168.124.101:8888',
    timeout: 1000
})

// 请求拦截器
instance.interceptors.request.use(
    config => {
        //在发送请求之前做些什么
        const isLogin = config.url.indexOf('/login') !== -1;
        if (!isLogin) {
            // 如果不是登录请求,则添加请求头
            const token = localStorage.getItem('token');
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config
    },
    error => {
        // 对请求错误做些什么
        this.$message.error('请求失败,请稍后重试');
        return Promise.reject(error)
    }
)

// 响应拦截器
instance.interceptors.response.use(
    response => {
        // 对响应数据做点什么
        const token = response.headers['panel-token'];
        if (token) {
            localStorage.setItem('token', token);
        }
        return response.data
    },
    error => {
        // 对响应错误做点什么
        const { status, data } = error.response
        if (status === 401) {
            const errorMsg = data.msg; // 获取msg字段
            // 针对401 Unauthorized做特殊处理
            vm.$message.error(errorMsg);
            // 清除token
            localStorage.removeItem('token');
            // 跳转到登录页面
            if (vm.$router.currentRoute.path !== '/login') {
                vm.$router.push('/login');

            }
        } else if (status === 400) {
            vm.$message.error(data.msg);
        } else if (status === 404) {
            vm.$message.error('请求地址不存在！');
        } else {
            // 处理其他错误
            vm.$message.error(data.msg);
        }
        return Promise.reject(error)
    }
)
export default instance
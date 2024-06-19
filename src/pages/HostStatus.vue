<template>
    <div class="hostStatus">
        <div class="header">
            <el-card class="box-card">
                <i class="el-icon-bottom icon">{{ netInfo.downloadSpeed }} </i>
                <i class="el-icon-top icon">{{ netInfo.uploadSpeed }} </i>
                <i class="el-icon-upload2 icon">{{ netInfo.downloadTotal }} </i>
                <i class="el-icon-download icon">{{ netInfo.uploadTotal }} </i>
            </el-card>
        </div>
        <div class="mainBody">
            <el-card class="box-card">
                <div slot="header">
                    <span>主机信息</span>
                </div>
                <div class="list">
                    <div v-for="info in hostInfos" :key="info.index" class="text-item">
                        <span class="infoName"> {{ info.name }} </span> : <span class="infoValue"> {{ info.value }}
                        </span>
                    </div>
                </div>
            </el-card>
            <el-card v-for="item in states" :key="item.index" class="box-card">
                <div slot="header">
                    <span>{{ item.name }}</span>
                </div>
                <div class="main">
                    <el-progress class="circle" type="circle" :percentage="item.percentage" :stroke-width="12"
                        :width="140" :color="customColors"></el-progress>
                    <div class="info">
                        <span>{{ '( ' + item.current }} / {{ item.sum + ' ) ' }}</span><span>{{
                            item.suffix }}</span>
                    </div>
                </div>
            </el-card>
        </div>

    </div>
</template>

<script>
import instance from '@/utils/axios';
export default {
    name: 'hostStatus',
    data() {
        return {
            intervalId: null,
            intervalId_2: null,
            netInfo: {
                downloadSpeed: 0,
                uploadSpeed: 0,
                downloadTotal: 0,
                uploadTotal: 0,
            },
            states: {
                CPU: {
                    name: 'CPU',
                    percentage: 0,
                    current: 0,
                    sum: 0,
                    suffix: '核'
                },
                内存: {
                    name: '内存',
                    percentage: 0,
                    current: 0,
                    sum: 0,
                    suffix: 'MB'
                },
                swap: {
                    name: 'swap',
                    percentage: 0,
                    current: 0,
                    sum: 0,
                    suffix: 'GB'
                },
                硬盘: {
                    name: '硬盘',
                    percentage: 0,
                    current: 0,
                    sum: 0,
                    suffix: 'GB'
                },
            },
            customColors: [
                { color: '#f56c6c', percentage: 90 },
                { color: '#e6a23c', percentage: 75 },
                { color: '#5cb87a', percentage: 50 },
                { color: '#1989fa', percentage: 25 },
                { color: '#6f7ad3', percentage: 0 }
            ],
            hostInfos: [
                { name: '操作系统', value: '-' },
                { name: '内核版本', value: '-' },
                { name: '系统类型', value: '-' },
                { name: '运行时间', value: '-' },
                { name: '开机时间', value: '-' },
            ],


        }
    },
    methods: {
        // 通过websocket获取主机信息
        getHostInfo() {
            if (this.$socket && this.$socket.readyState === WebSocket.OPEN) {
                this.$socket.send(JSON.stringify({
                    type: 'getHostInfo', // 事件
                    data: 'hello',
                }))
                // console.log('发送消息getHostInfo')
            } else {
                console.log('WebSocket not connected! getHostInfo failed!')
            }
        },
        //get请求获得主机基本信息
        getHostBasicInfo() {
            instance.get('/hostStatus/hostBasicInfo').then(res => {
                this.hostInfos = res.hostBasicInfos

                // console.log('HostStatus axios message', res.data)
            }).catch(err => {
                console.log('HostStatus axios error', err)
            })
        }
    },
    sockets: {
        onmessage(event) {
            const data = JSON.parse(event.data)
            if (data.type === 'hostInfo') {
                this.states = data.data.hostBasicInfos
                // console.log('HostStatus websocket message', data.type, data.data.hostBasicInfos)
                this.netInfo = data.data.netStatus
                // console.log('HostStatus websocket message', event.data)
                // console.log('HostStatus websocket message', data.type, data.data.netStatus)
            } else if (data.type === "hostError") {
                console.log('HostStatus websocket message', data.type, data.data)
            }

        },
        onerror(err) {
            console.log('WebSocket error' + err)
        },
    },
    mounted() {
        // 每隔4s通过websocket获取主机信息
        this.getHostInfo()
        this.intervalId = setInterval(this.getHostInfo, 4000)
        //获取主机基本信息
        this.getHostBasicInfo()
        this.intervalId_2 = setInterval(this.getHostBasicInfo, 1800 * 1000)
    },
    beforeDestroy() {
        clearInterval(this.intervalId)
    }

}
</script>

<style>
.hostStatus {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
}

.hostStatus .header .box-card {

    margin: 10px;
    width: 55%;
}

.hostStatus .header .box-card .el-card__body {
    box-sizing: border-box;
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 12px 20px;
}

.hostStatus .header .box-card .icon {
    font-size: 16px;
    cursor: pointer;
    flex: 0 0 auto;
    color: #a0a3a7;

}

.hostStatus .mainBody .box-card {
    margin: 10px;
    width: 380px;
    display: inline-block;
    vertical-align: top;
    height: 240px;

}

.hostStatus .mainBody .box-card .list .text-item {
    padding: 6px;
    padding-top: 2px;
}

.hostStatus .mainBody .box-card .list .text-item .infoValue {
    color: #a0a3a7;
    font-size: small;
}

.hostStatus .mainBody .box-card .list .text-item .infoName {
    /* color: #606266; */
    font-size: 14px;
}

.hostStatus .mainBody .box-card .main {
    display: flex;
    /* 可选: 设置flex方向为水平 */
    flex-direction: row;
}

.hostStatus .mainBody .box-card .main .circle {
    flex-shrink: 0;
    /* 防止 A 被压缩 */
}

.hostStatus .mainBody .box-card .main .info {
    flex: 1;
    /* 占据剩余空间 */
    display: flex;
    /* 将 B 也设置为 flex 布局 */
    justify-content: center;
    /* 子元素在水平方向居中 */
    align-items: center;
    /* 子元素在垂直方向居中 */

}
</style>
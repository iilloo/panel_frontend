<template>
    <div class="terminalSystem">
        <Terminal ref='myTerminalRef' @exec-cmd="onExecCmd" :show-header="true" :init-log="null" name="my-terminal"></Terminal>
    </div>
</template>

<script>

import Terminal from "vue-web-terminal"
import 'vue-web-terminal/lib/theme/dark.css'
import {TerminalFlash} from 'vue-web-terminal'
export default {
    name: "terminalSystem",
    components: {
        Terminal
    },
    data() {
        return {
            flash: null,
            command: ''
        }
    },
    methods: {
        onExecCmd(key, command, success) {
            
            if (this.$socket && this.$socket.readyState === WebSocket.OPEN) {
                this.$socket.send(JSON.stringify({
                    type: 'cmdStdin', // 事件
                    data: command,
                }))
                //记录当前的命令
                this.command = command
                this.flash = new TerminalFlash()
                console.log('发送消息cmdStdin成功！')
                success(this.flash)

            } else {
                console.log('WebSocket not connected! cmdStdin failed!')
            }

        },
        pushMsg(msg) {
            // this.$refs["my-terminal"].pushMsg(msg)
            this.$refs.myTerminalRef.pushMessage(msg)
        }

    },
    sockets: {
        onmessage(event) {
            const data = JSON.parse(event.data)
            if (data.type === 'cmdStdout') {
                console.log('Terminal websocket message', data.type, data.data)
                if (data.data === 'END_OF_COMMAND_' + this.command) {
                    this.flash.finish()
                } else {
                    this.pushMsg(data.data)
                }
                // this.pushMsg(data.data)

                // this.flash.finish()
            } else if (data.type === "cmdError") {
                console.log('HostStatus websocket message', data.type, data.data)
            }
        },
        onerror(err) {
            console.log('WebSocket error' + err)
        },
        
    },
    mounted() {
        this.pushMsg("Welcome to the terminal system!")
    }
}
</script>

<style>
.terminalSystem {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
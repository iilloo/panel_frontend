<template>
    <div class="terminalSys" ref="terminal"></div>
</template>

<script>
import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css'


import { FitAddon } from '@xterm/addon-fit';
export default {
    name: 'TerminalSys',
    data() {
        return {
            terminal: null,
            fitAddon: null,
            windowSize: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            debouncedSendPtyInfo: null, // 用于存储防抖函数实例
            activeCount: 0,
            isActived: false,
        };
    },
    mounted() {
        this.initTerminal();
        this.sendData();
    },
    beforeDestroy() {
        if (this.terminal) {
            this.terminal.dispose()
        }
        this.activeCount = 0;
        console.log('TerminalSys beforeDestroy')
    },
    methods: {
        initTerminal() {
            //如果存在终端实例，先销毁
            if (this.terminal) {
                this.terminal.dispose()
            }
            //创建终端实例
            this.terminal = new Terminal(
                {
                    rendererType: 'canvas', //渲染类型
                    rows: 200, //行数 18是字体高度,根据需要自己修改
                    convertEol: true, //启用时，光标将设置为下一行的开头
                    // scrollback: 800, //终端中的回滚量
                    disableStdin: false, //是否应禁用输入
                    // cursorStyle: 'underline', //光标样式
                    // cursorBlink: true, //光标闪烁
                    // tabStopWidth: 8, //制表宽度
                    screenKeys: true,
                    theme: {
                        // foreground: 'yellow', //字体
                        // background: '#060101', //背景色
                        // cursor: 'help', //设置光标
                    },
                }
            );
            //终端挂载到dom
            this.terminal.open(this.$refs.terminal);
            this.fitAddon = new FitAddon();
            this.terminal.loadAddon(this.fitAddon);
            this.fitAddon.fit();
            this.terminal.writeln('Welcome to xterm.js in Vue!');
            this.terminal.focus();
        },
        sendData() {
            // 绑定数据输入事件
            this.terminal.onData((data) => {
                if (this.$socket && this.$socket.readyState === WebSocket.OPEN) {
                    this.$socket.send(JSON.stringify({
                        type: 'cmdStdin', // 事件
                        data: data,
                    }))
                    console.log('发送消息cmdStdin成功！')
                } else {
                    console.log('WebSocket not connected! cmdStdin failed!')
                }
            });
        },
        updateWindowSize() {
            this.windowSize.width = window.innerWidth;
            this.windowSize.height = window.innerHeight;
        },
        // 防抖函数
        debounce(func, delay) {
            let timeout;
            return function (...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    func.apply(this, args);
                }, delay);
            };
        },
        sendPtyInfo() {
            if (this.$socket && this.$socket.readyState === WebSocket.OPEN) {
                this.$socket.send(JSON.stringify({
                    type: 'ptyInfo', // 事件
                    data: {
                        cols: this.terminal.cols,
                        rows: this.terminal.rows,
                    }
                }))
                console.log('发送消息ptyInfo成功！')
                console.log(this.terminal.cols, this.terminal.rows)
            } else {
                console.log('WebSocket not connected! ptyInfo failed!')
            }
        },

    },
    sockets: {
        onmessage(event) {
            const data = JSON.parse(event.data)
            if (data.type === 'cmdStdout') {
                console.log('Terminal websocket message', data.type, data.data)
                this.terminal.write(data.data)
            } else if (data.type === "cmdError") {
                console.log('HostStatus websocket message', data.type, data.data)
            }
        },
        onerror(err) {
            console.log('WebSocket error' + err)
        },
    },
    computed: {
    },
    watch: {
        //监听属性
        windowSize: {
            deep: true, //监视多级结构的属性
            handler() {
                //
                console.log('windowSize changed')
                this.fitAddon.fit();
                if (this.debouncedSendPtyInfo) {
                    this.debouncedSendPtyInfo();
                }
            }

        }

    },
    //失活
    deactivated() {
        this.activeCount = 0;
        window.removeEventListener('resize', this.updateWindowSize)
    },
    activated() {
        this.debouncedSendPtyInfo = this.debounce(this.sendPtyInfo, 300)
        window.addEventListener('resize', this.updateWindowSize);
        this.terminal.focus();
        this.fitAddon.fit();
        if (this.activeCount === 0) {
            console.log('TerminalSys activated')
            this.sendPtyInfo();
            this.activeCount = 1;
        }
    },
};
</script>

<style>
.terminal {
    width: 100%;
    height: 100%;
}

.terminalSys {
    width: 100%;
    height: 100%;
}

.terminalSys .terminal .xterm-viewport {
    overflow-y: auto !important;
    /* overflow-x: scroll !important; */
}
</style>
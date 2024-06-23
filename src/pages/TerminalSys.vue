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
        };
    },
    mounted() {
        this.initTerminal();
    },
    methods: {
        initTerminal() {
            if (this.terminal) {
                this.terminal.dispose()
            }
            this.terminal = new Terminal(
                {
                    rendererType: 'canvas', //渲染类型
                    rows: 35, //行数 18是字体高度,根据需要自己修改
                    convertEol: true, //启用时，光标将设置为下一行的开头
                    // scrollback: 800, //终端中的回滚量
                    disableStdin: false, //是否应禁用输入
                    // cursorStyle: 'underline', //光标样式
                    cursorBlink: true, //光标闪烁
                    tabStopWidth: 8, //制表宽度
                    screenKeys: true,
                    theme: {
                        foreground: 'yellow', //字体
                        background: '#060101', //背景色
                        cursor: 'help', //设置光标
                    },
                }
            );
            this.terminal.open(this.$refs.terminal);
            this.fitAddon = new FitAddon();
            this.terminal.loadAddon(this.fitAddon);
            this.fitAddon.fit();
            this.terminal.writeln('Welcome to xterm.js in Vue!');
            this.terminal.focus();
            console.log(this.terminal);
            // 绑定事件处理
            // 绑定数据输入事件
            this.terminal.onData((data) => {
                const printable = data.match(/[\x20-\x7E]/); // 匹配可打印字符的正则表达式
                if (data === '\r' || data === '\x0D') {
                    // 处理回车键，添加换行
                    this.terminal.writeln('');
                } else if (data === '\x08' || data === '\x7F') {
                    // 处理退格键，删除最后一个字符
                    this.terminal.write('\b \b');
                } else if (printable) {
                    // 处理可打印字符
                    this.terminal.write(data);
                }
            });

        },
    },
};
</script>

<style scoped>
.terminal {
    width: 100%;
    height: 100%;
}

.terminalSys {
    width: 100%;
    height: 100%;
}
</style>
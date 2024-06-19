export default function createWebSocketConfig() {
    return {
        // reconnection: false, // 自动重连
        // reconnectionAttempts: Infinity, // 重连次数
        // reconnectionDelay: 3000, // 重连间隔
        format: 'json',
        connectManually: true,
    };
}
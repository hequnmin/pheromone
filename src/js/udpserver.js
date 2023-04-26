
class UDPServer {

    constructor() {
    }

    addServer(host, port) {

        const dgram = require('dgram');
        const server = dgram.createSocket('udp4');
        
        server.bind(port, host);

        // 监听消息事件
        server.on('message', (buffer, remoteInfo) => {
            const msg = `来自${remoteInfo.address}:${remoteInfo.port}的消息: ${buffer}`;
            console.log(msg);
            win.webContents.send('service-message', msg);
        });

        // 监听错误事件
        server.on('error', (err) => {
            const msg = `监听发生错误：\n${err.stack}`;
            console.log(msg);
            server.close();
        });

        // 监听服务器绑定事件
        server.on('listening', () => {
            const msg = `监听已启动...`;
            console.log(msg);
            win.webContents.send('service-message', msg);
        });

        this.servers.push(server);
    }

    removeServer(host, port) {

    }

}

UDPServer.servers = [];
module.exports = UDPServer;
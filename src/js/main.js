
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const dgram = require('dgram');

// 创建一个UDP服务器对象
const server = dgram.createSocket('udp4');

let win, aboutWin;
let localhosts = [];

const createWindow = () => {
    win = new BrowserWindow({
        width: 1024,
        height: 768,
        minWidth: 300,
        minHeight: 300,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            plugins: true,
            nodeIntegration: true
        },
        //frame: false
    });

    win.loadFile(path.join(__dirname, '../index.html'));

    //win.webContents.openDevTools();

    win.on('closed', () => {
        win = null;
        aboutWin = null;
    })

}

app.on('ready', () => {

    // 获取本地IP
    const os = require('os');
    let network = os.networkInterfaces();
    for (const devName in network) {
        let netList = network[devName];
        for (var i = 0; i < netList.length; i++) {
            let { address, family, internal } = netList[i];
            if (family === 'IPv4' && address !== '127.0.0.1' && !internal) {
                localhosts.push(address);
            }
        }
    }

})

app.whenReady().then(() => {

    //ipcMain.on('set-title', handleSetTitle);

    // 使用 ipcMain.on API 设置一个 IPC 监听器，接收渲染器进程ipcRenderer.send发送的消息
    //ipcMain.on('service-start', onServiceStart);    //单向
    ipcMain.handle('service-start', handleServiceStart);    //双向
    ipcMain.handle('service-stop', handleServiceStop);

    ipcMain.on('service-message', (_event, value) => {
        console.log("message.");
    });

    createWindow();

    app.on('activate', () => {
        // 在 macOS 系统内, 如果没有已开启的应用窗口
        // 点击托盘图标时通常会重新创建一个新窗口
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })


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

    async function handleServiceStart(event, args) {

        const { host } = args;
        const { port } = args;
    
        const server = new dgram.createSocket('udp4');
    
        // 绑定服务器到指定的地址和端口
        server.bind(port, host);
        const msg = `绑定服务器：${host}:${port}`;
        console.log(msg);
    
        return true;
    }
    
    async function handleServiceStop(event, args) {
        const { host } = args;
        const { port } = args;
    
        server.close();
        const msg = `关闭服务器：${host}:${port}`;
        console.log(msg);
    
        return true;
    }
    

})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

// function handleSetTitle (event, title) {
//     const webContents = event.sender
//     const win = BrowserWindow.fromWebContents(webContents)
//     win.setTitle(title)
// }

// function onServiceStart(event, args) {

//     const { host } = args;
//     const { port } = args;

//     // 绑定服务器到指定的地址和端口
//     server.bind(port, host);

//     const msg = `服务器：${host}:${port}`;
//     console.log(msg);
//     win.webContents.send('service-message', msg);
// }

// async function handleServiceStart(event, args) {

//     const { host } = args;
//     const { port } = args;

//     const server = new dgram.createSocket('udp4');

//     // 绑定服务器到指定的地址和端口
//     server.bind(port, host);
//     const msg = `绑定服务器：${host}:${port}`;
//     console.log(msg);

//     return true;
// }

// async function handleServiceStop(event, args) {
//     const { host } = args;
//     const { port } = args;

//     server.close();
//     const msg = `关闭服务器：${host}:${port}`;
//     console.log(msg);

//     return true;
// }

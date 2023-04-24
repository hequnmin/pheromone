// preload.js
const { contextBridge, ipcRenderer } = require('electron');

// 所有的 Node.js API接口 都可以在 preload 进程中被调用.
// 它拥有与Chrome扩展一样的沙盒。
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }
  
    for (const dependency of ['chrome', 'node', 'electron']) {
      replaceText(`${dependency}-version`, process.versions[dependency])
    }
  })


contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: (title) => ipcRenderer.send('set-title', title)
})


//使用 ipcRenderer.send API 发送消息，然后使用 ipcMain.on API 接收
contextBridge.exposeInMainWorld('serviceAPI', {
    start: (args) => ipcRenderer.send('service-start', args),   //渲染器进程到主进程（单向）
    message: (callback) => ipcRenderer.on('service-message', callback)
})


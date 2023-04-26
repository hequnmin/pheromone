
// 将console.log打印至页面
const logger = document.getElementById('log');
console.log = function (message) {
    if (typeof message == 'object') {
        logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />';
    } else {
        logger.innerHTML += message + '<br />';
    }
}


const _start = document.getElementById('btnServiceStart');
const _stop = document.getElementById('btnServiceStop');

_start.addEventListener('click', () => {

    const args = { host: '127.0.0.1', port: 65432 };
    
    //window.serviceAPI.start(args);  //主进程到渲染器进程（单向）
    const promise = window.serviceAPI.start(args);  //（双向）
    
    promise.then(result => {
        if (result) {
            const msg = `${args.host}:${args.port} 服务已开启...`;
            console.log(msg);
            _start.disabled = true;
            _stop.disabled = false;
        } else {
            const msg = `${args.host}:${args.port} 服务开启失败！${err}`;
            console.log(msg);
        }
    }).catch(err => {
        const msg = `${args.host}:${args.port} 服务开启失败！${err}`;
        console.log(msg);
    });

});

_stop.addEventListener('click', () => {
    const args = { host: '127.0.0.1', port: 65432 };
    const promise = window.serviceAPI.stop(args);
    promise.then(result => {
        if (result) {
            const msg = `${args.host}:${args.port} 服务已停止！`;
            console.log(msg);
            _start.disabled = false;
            _stop.disabled = true;
        } else {
            const msg = `${args.host}:${args.port} 服务停止失败！`;
            console.log(msg);
        }
    }).catch(err => {
        const msg = `${args.host}:${args.port} 服务停止失败！${err}`;
        console.log(msg);
    });
});

window.serviceAPI.message((event, value) => {
    console.log(value);
});


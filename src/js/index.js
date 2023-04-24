
(function() {


    class Service {
        constructor() {

        }

        run() {
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
            
            _start.addEventListener('click', () => {
                _start.disabled = true;
    
                const args = { host: '127.0.0.1', port: 65432 };
                
                //主进程到渲染器进程（单向）
                window.serviceAPI.start(args);
            });

            window.serviceAPI.message((event, value) => {
                console.log(value);
            });

        }
    }

    const application = new Service();
    application.run();

})();
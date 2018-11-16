let mysqlPool: any = null;
let socketServers: Array<any> = new Array();
let server: any = null;
let eventMap: Map<string, any> = new Map<string, any>();

module.exports.push = (socket: any) => {
    socketServers.push(socket);
}

module.exports.remove = (uuid: string) => {

    let i = 0;
    for (; i < socketServers.length; i++) {
        let socketClient: any = socketServers[i];
        if (socketClient.getUuid() === uuid) {
            break;
        }
    }
    socketServers.splice(i, 1);
}

module.exports.get = (uuid: string) => {
    for (let i = 0; i < socketServers.length; i++) {
        let socketClient: any = socketServers[i];
        if (socketClient.getUuid() === uuid) {
            return socketClient;
        }
    }
}

module.exports.set = (uuid: string, socket: any) => {
    let i = 0;
    for (; i < socketServers.length; i++) {
        let socketClient: any = socketServers[i];
        if (socketClient.getUuid() === uuid) {
            break;
        }
    }
    socketServers[i] = socket;
}

module.exports.getAll = () => {
    return socketServers;
}

module.exports.setPool = (pool: any) => {
    mysqlPool = pool
}

module.exports.getPool = () => {
    return mysqlPool;
}

module.exports.setServer = (httpServer: any) => {
    server = httpServer;
}

module.exports.getServer = () => {
    return server;
}

module.exports.on = (key: string, fn: any) => {
    eventMap.set(key, fn);
}

module.exports.emit = (key: string, result: any) => {
    let fn = eventMap.get(key);
    if (fn && typeof fn === 'function') {
        fn(result);
    }
}
let mysqlPool: any = null;
let socketServers: Array<any> = new Array();
let server: any = null;
let eventMap: Map<string, any> = new Map<string, any>();
let configObj: any = null;

let setConfig = (config: object) => {
    configObj = config;
}

let getConfig = () => {
    return configObj;
}

let pushSocketServer = (socket: any) => {
    socketServers.push(socket);
}

let removeSocketServer = (uuid: string) => {

    let i = 0;
    for (; i < socketServers.length; i++) {
        let socketClient: any = socketServers[i];
        if (socketClient.getUuid() === uuid) {
            break;
        }
    }
    socketServers.splice(i, 1);
}

let getSocketServer = (uuid: string) => {
    for (let i = 0; i < socketServers.length; i++) {
        let socketClient: any = socketServers[i];
        if (socketClient.getUuid() === uuid) {
            return socketClient;
        }
    }
}

let setSocketServer = (uuid: string, socket: any) => {
    let i = 0;
    for (; i < socketServers.length; i++) {
        let socketClient: any = socketServers[i];
        if (socketClient.getUuid() === uuid) {
            break;
        }
    }
    socketServers[i] = socket;
}

let getAllSocketServer = () => {
    return socketServers;
}

let setPool = (pool: any) => {
    mysqlPool = pool
}

let getPool = () => {
    return mysqlPool;
}

let setHttpServer = (httpServer: any) => {
    server = httpServer;
}

let getHttpServer = () => {
    return server;
}

let on = (key: string, fn: any) => {
    eventMap.set(key, fn);
}

let emit = (key: string, result: any) => {
    let fn = eventMap.get(key);
    if (fn && typeof fn === 'function') {
        fn(result);
    }
}

export {
    setConfig, getConfig, pushSocketServer, removeSocketServer, getSocketServer, setSocketServer, getAllSocketServer, setPool, getPool, setHttpServer, getHttpServer, on, emit
}
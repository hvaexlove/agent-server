const http = require('http');
const req = require('require-yml');
const mysql = require('mysql');
const WebSocket = require('ws');
import * as Koa from 'koa';
import * as koaBody from 'koa-body';
import router from './controller/router';
import { initLog4js, getLog } from './utils/log_utils';
import { getParm } from './utils/parm_utils';
import { initErrorHandler } from './error/error_handler';
import BusinessException from './error/business_exception';
import { setConfig, getConfig, pushSocketServer, setPool, setHttpServer, getHttpServer } from './global';
import { Request } from './protocol/service';
import SocketServiceImpl from './service/impl/socket_service_impl';
import { SocketService } from './service/socket_service';

class Main {

    constructor() {
        this.init();
    }

    init() {
        console.log('AgentServer v1.0.0');
        console.log('Copyright (c) 2018 Agent Inc.');
        initErrorHandler();
        this.initConfig();
        this.initLog();
        this.initHttpServer();
        this.initWebSocket();
        this.initMySQL();
    }

    initConfig() {
        console.log('initConfig...');
        let configPath = getParm('-c');
        if (!configPath || configPath === '') {
            throw new BusinessException('configPath不能为空!', 0);
        }
        let configObj = req(configPath);
        if (!configObj) {
            throw new BusinessException('config解析有误,请检查路径是否正确!', 0);
        }
        setConfig(configObj);
    }

    initLog() {
        console.log('initLog...');
        initLog4js();
    }

    initHttpServer() {
        console.log('initHttpServer...');
        const log = getLog('main.ts');
        const app = new Koa();
        app.use(async (ctx, next) => {
            log.info(`Process ${ctx.request.method} ${ctx.request.url} ${ctx.request.path}`);
            let startTime = new Date().getTime();
            let execTime = null;
            await next();
            if (ctx.request.header.origin) {
                ctx.set('Access-Control-Allow-Origin', ctx.request.header.origin);
                ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With, from, X-Custom-Header');
                ctx.set('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,PATCH,OPTIONS');
                ctx.set('Access-Control-Allow-Credentials', 'true');
            } else {
                ctx.set('Access-Control-Allow-Origin', '*');
                ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With, from, X-Custom-Header');
                ctx.set('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,PATCH,OPTIONS');
                ctx.set('Access-Control-Allow-Credentials', 'true');
            }
            execTime = new Date().getTime() - startTime;
            ctx.response.set('X-Response-Time', execTime.toString());
        });
        app.use(async (ctx, next) => {
            if (ctx.method === 'OPTIONS') {
                ctx.status = 200;
            } else {
                await next();
            }
        });
        app.use(koaBody());
        app.use(router.routes())
        app.use(router.allowedMethods());

        let server = http.createServer(app.callback()).listen(process.env.PORT || getConfig().server_port);
        setHttpServer(server);
        log.info(`http server listening on 0.0.0.0:${getConfig().server_port}`);
    }
    
    initWebSocket() {
        console.log('initWebSocket...');
        const log = getLog('main.ts');
        let server = getHttpServer();
        const wss = new WebSocket.Server( { server } );
        wss.on('connection', (ws: any) => {
            let socketServer: SocketService = new SocketServiceImpl().connection(ws);
            pushSocketServer(socketServer);
        });
        log.info(`socket server listening on 0.0.0.0:${getConfig().server_port}`);
    }

    initMySQL() {
        console.log('initMySQL...');
        setPool(mysql.createPool({
            connectionLimit : 10,
            host            : getConfig().db_server,
            user            : getConfig().user,
            password        : getConfig().password,
            database        : getConfig().database
        }));
    }

}

new Main();
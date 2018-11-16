const http = require('http');
import * as Koa from 'koa';
import * as koaBody from 'koa-body';
import router from './controller/router';
const req = require('require-yml');
const mysql = require('mysql');
const LogUtils = require('./utils/log_utils');
const ParmUtils = require('./utils/parm_utils');
const ErrorHandler = require('./error/error_handler');
import BusinessException from './error/business_exception';
const WebSocket = require('ws');
var config = require('./config');
var global = require('./global');
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
        ErrorHandler.initErrorHandler();
        this.initConfig();
        this.initLog();
        this.initHttpServer();
        this.initWebSocket();
        this.initMySQL();
    }

    initConfig() {
        console.log('initConfig...');
        let configPath = ParmUtils.getParm('-c');
        if (!configPath || configPath === '') {
            throw new BusinessException('configPath不能为空!', 0);
        }
        let configObj = req(configPath);
        if (!configObj) {
            throw new BusinessException('config解析有误,请检查路径是否正确!', 0);
        }
        config.set(configObj);
    }

    initLog() {
        console.log('initLog...');
        LogUtils.initLog();
    }

    initHttpServer() {
        console.log('initHttpServer...');
        const log = LogUtils.getLog('main.ts');
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

        let server = http.createServer(app.callback()).listen(process.env.PORT || config.get().server_port);
        global.setServer(server);
        log.info(`http server listening on 0.0.0.0:${config.get().server_port}`);
    }
    
    initWebSocket() {
        console.log('initWebSocket...');
        const log = LogUtils.getLog('main.ts');
        let server = global.getServer();
        const wss = new WebSocket.Server( { server } );
        wss.on('connection', (ws: any) => {
            let socketServer: SocketService = new SocketServiceImpl().connection(ws);
            global.push(socketServer);
        });
        log.info(`socket server listening on 0.0.0.0:${config.get().server_port}`);
    }

    initMySQL() {
        console.log('initMySQL...');
        global.setPool(mysql.createPool({
            connectionLimit : 10,
            host            : config.get().db_server,
            user            : config.get().user,
            password        : config.get().password,
            database        : config.get().database
        }));
    }

}

new Main();
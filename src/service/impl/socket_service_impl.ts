import { SocketService } from '../socket_service';
import { Request } from '../../protocol/service';
import { OptionService } from '../option_service';
import OptionServiceImpl from './option_service_impl';
import { AgentService } from '../agent_service';
import AgentServiceImpl from './agent_service_impl';
const LogUtils = require('../../utils/log_utils');
const MapUtils = require('../../utils/map_utils');
const IdUtils = require('../../utils/id_utils');
var global = require('../../global');

class SocketServiceImpl implements SocketService {

    private socket: any = null;
    private log: any = LogUtils.getLog('socket_service_impl.ts');
    private uuid: string = null;
    private setTimeoutId:any = null;
    private optionService: OptionService = new OptionServiceImpl();
    private agentService: AgentService = new AgentServiceImpl();

    constructor() {

    }
    
    public connection(socket: any) :SocketService {
        this.socket = socket;
        this.socket.on('message', (req: string) :void => {
            this.onMessage(req);
        });
        this.socket.on('close', () :void => {
            this.onClose();
        });
        this.heartbeatCheck();
        return this;
    }

    private onMessage(req: string) :void {
        let msg: Request = JSON.parse(req);
        let headerMap: Map<string, any> = MapUtils.jsonToMap(msg.header);
        msg.headerMap = headerMap;
        let uuid = headerMap.get('uuid');
        this.uuid = uuid;
        this.log.info('this log is onMessage: ', msg);
        this.optionService.action(msg);
    }

    private onClose() :void {
        console.log('disconnected');
        if (this.uuid) {
            this.agentService.updateStatus(this.uuid, 0);
            this.clearHeartbeatCheck();
            global.remove(this.uuid);
        }
    }

    public send(req: Request) :void {
        this.socket.send(JSON.stringify(req));
    }

    public sendSimpleMsg(target: string, body: any) :void {
        let req: Request = {
            id: IdUtils.getId(),
            target: target,
            from: null,
            type: 'json',
            encode: 'utf-8',
            header: null,
            headerMap: null,
            body: JSON.stringify(body),
            version: 'v1.0',
            timeout: 3000
        }
        this.send(req);
    }

    public syncSendSimpleMsg(target: string, body: any) :Promise<any> {
        return new Promise((resolve, reject) => {
            let rejectTime: any = null;
            let req: Request = {
                id: IdUtils.getId(),
                target: target,
                from: null,
                type: 'json',
                encode: 'utf-8',
                header: null,
                headerMap: null,
                body: JSON.stringify(body),
                version: 'v1.0',
                timeout: 3000
            }
            this.send(req);
            global.on(req.id, (result: any) => {
                if (rejectTime) {
                    clearTimeout(rejectTime);
                }
                let execResult = JSON.parse(result);
                resolve(execResult.result);
            });
            rejectTime = setTimeout(() => {
                resolve('响应超时!')
            }, 10000);
        });
    }

    public getUuid() :string {
        return this.uuid;
    }

    public clearHeartbeatCheck() {
        if (this.setTimeoutId) {
            clearTimeout(this.setTimeoutId);
        }
    }

    public heartbeatCheck() {
        this.setTimeoutId = setTimeout(() => {
            if (this.uuid) {
                this.agentService.updateStatus(this.uuid, 0);
                global.remove(this.uuid);
            }
        }, 30000);
    }

}

export default SocketServiceImpl;
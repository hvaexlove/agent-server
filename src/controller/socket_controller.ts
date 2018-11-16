import BaseController from './base_controller';
import { SocketService } from '../service/socket_service';
import { AgentService } from '../service/agent_service';
import { Agent } from '../model/agent_model';
import { SendMsgVo } from '../model/send_msg_vo';
import AgentServiceImpl from '../service/impl/agent_service_impl';
const LogUtils = require('../utils/log_utils');
var global = require('../global');

class SocketController extends BaseController {

    private router: any = null;
    private agentService: AgentService = new AgentServiceImpl();
    private log: any = LogUtils.getLog('socket_controller.ts');

    constructor(routerPath: any) {
        super();
        this.router = routerPath;
        this.router.post('/api/socket/list', async (ctx: any, next: any) => {
            await this.list(ctx);
        });
        this.router.post('/api/socket/send/:id', async (ctx: any, next: any) => {
            await this.send(ctx);
        });
    }

    async list(ctx: any) {
        let agentList = await this.agentService.list(ctx.request.body.pageIndex, ctx.request.body.pageSize);
        super.success(ctx, agentList);
    }

    async send(ctx: any) {
        let uuid = ctx.params.id
        let reqBody: SendMsgVo = ctx.request.body;
        let agentList: Array<any> = await this.agentService.getByUuid(uuid);
        this.log.info('this log is http request body: ', reqBody);
        agentList = JSON.parse(JSON.stringify(agentList));
        if (!agentList || agentList.length == 0) {
            super.error(ctx, '找不到agent!');
            return;
        }
        let agent: Agent = agentList[0];
        if (agent.status !== 1) {
            super.error(ctx, '请检查agent是否正常启动!');
            return;
        }
        let socketService: SocketService = global.get(uuid);
        if (!socketService) {
            super.error(ctx, '请检查agent是否正常连接!');
            return;
        }
        let result = await socketService.syncSendSimpleMsg(reqBody.target, reqBody.body);
        super.success(ctx, result);
    }
}

export default SocketController;
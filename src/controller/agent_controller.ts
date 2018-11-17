import BaseController from './base_controller';
import { AgentService } from '../service/agent_service';
import AgentServiceImpl from '../service/impl/agent_service_impl';
import { getLog } from '../utils/log_utils';

class AgentController extends BaseController {

    private router: any = null;
    private agentService: AgentService = new AgentServiceImpl();
    private log: any = getLog('agent_controller.ts');

    constructor(routerPath: any) {
        super();
        this.router = routerPath;
        this.router.get('/api/agent/install/:osType', async (ctx: any, next: any) => {
            await this.install(ctx);
        });
    }

    async install(ctx: any) {
        let shell: string = await this.agentService.install(ctx.params.osType)
        super.successText(ctx, shell);
    }
}

export default AgentController;
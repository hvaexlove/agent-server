import { OptionService } from '../option_service';
import { AgentService } from '../agent_service';
import AgentServiceImpl from './agent_service_impl';
import { Request } from '../../protocol/service';
const LogUtils = require('../../utils/log_utils');

class OptionServiceImpl implements OptionService {

    private log: any = LogUtils.getLog('option_service_impl.ts');
    private agentService: AgentService = new AgentServiceImpl();

    constructor() {
        
    }

    public action(req: Request) : void {
        switch (req.target) {
            case '/register':
                this.agentService.register(req);
            break;
            case '/heartbeat':
                this.agentService.heartbeat(req);
            break;
            case '/report':
                this.agentService.report(req);
            break;
            default:
                this.log.info(req);
            break;
        }
    }

}

export default OptionServiceImpl;
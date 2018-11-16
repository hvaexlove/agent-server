import { AgentService } from '../agent_service';
import { Request } from '../../protocol/service';
import BaseService from '../base_service';
import AgentDao from '../../dao/agent_dao';
import { Agent } from '../../model/agent_model';

const NodeUuid = require('node-uuid');
const DateUtils = require('../../utils/date_utils');
const LogUtils = require('../../utils/log_utils');
var config = require('../../config');
var global = require('../../global');

class AgentServiceImpl extends BaseService implements AgentService {

    private log: any = LogUtils.getLog('agent_service_impl.ts');
    private agentDao: any = new AgentDao();

    constructor() {
        super();
    }

    public async updateStatus(uuid: string, status: number) : Promise<any> {
        let agent: Agent = {
            uuid: uuid,
            status: status,
            gmt_modified: DateUtils.getDate()
        };
        await this.agentDao.updateStatusByUuid(agent);
    }

    public async list(pageIndex: number = 1, pageSize: number = 10): Promise<any> {
        let start = (pageIndex - 1) * pageSize;
        let agentList: Array<any> = await this.agentDao.list(start, pageSize);
        let count: Array<any> = await this.agentDao.count();
        agentList = JSON.parse(JSON.stringify(agentList));
        count = JSON.parse(JSON.stringify(count));
        return {list: agentList, total: count[0].count};
    }

    public async getByUuid(uuid: string): Promise<any> {
        return this.agentDao.getByUuid(uuid);
    }

    public async register(req: Request) : Promise<any> {
        let agent: Agent = JSON.parse(req.body);
        let oldAgentList: Array<any> = await this.agentDao.getByUuid(agent.uuid);
        oldAgentList = JSON.parse(JSON.stringify(oldAgentList));
        if (!oldAgentList || oldAgentList.length == 0) {
            agent.gmt_create = DateUtils.getDate();
            agent.gmt_modified = DateUtils.getDate();
            await this.agentDao.add(agent);
        } else {
            let oldAgent: Agent = oldAgentList[0];
            let updateAgent: Agent = Object.assign(oldAgent, agent);
            updateAgent.gmt_modified = DateUtils.getDate();
            await this.agentDao.update(updateAgent);
        }
    }

    public async heartbeat(req: Request) : Promise<any> {
        let uuid: string = req.headerMap.get('uuid');
        let socketService: any = global.get(uuid);
        socketService.clearHeartbeatCheck();
        socketService.heartbeatCheck();
    }

    public async install(osType: string): Promise<any> {
        switch(osType) {
            case 'linux':
                return await this.linuxInstallShell();
            case 'macos':
                return await this.macosInstallShell();
            case 'win':
                return await this.winInstallShell();
        }
    }

    public async report(req: Request) : Promise<any> {
        let reqId = req.req_id;
        global.emit(reqId, req.body);
    }

    private linuxInstallShell() :Promise<string> {
        return new Promise((resolve, reject) => {
            let shell = `#!/bin/sh
export PATH=/sbin:/bin:/usr/sbin:/usr/bin:/usr/local/sbin:/usr/local/bin
                                    
SERVER="${config.get().domain}"
PORT="${process.env.PORT || config.get().server_port}"
UUID="${NodeUuid.v4()}"
AGENT_DOWNLOAD_URL="${config.get().linux_agent_download_url}"
USER_HOME=$(echo $(cd ~ && pwd))
AGENT_DIR="\${USER_HOME}/agent"
            
Install_Agent(){
            
    STEP='Install_Agent'
    echo "[+] Installing agent ..."
            
    mkdir -p \${USER_HOME}/tmp
    mkdir -p \${AGENT_DIR}
            
    if [ ! -f \${USER_HOME}/tmp/agent.tar.gz ];then
        curl -L "\${AGENT_DOWNLOAD_URL}" -o \${USER_HOME}/tmp/agent.tar.gz
    fi
            
    if [ ! -f \${USER_HOME}/tmp/agent.tar.gz  ];then
        echo "sidecar source file not found ..."
        Clean_Install_Pkg
        exit 1
    fi
            
    tar -xzf \${USER_HOME}/tmp/agent.tar.gz -C \${USER_HOME}/tmp/
    if [ ! -d \${USER_HOME}/tmp/agent_linux ] || [ ! -f \${USER_HOME}/tmp/agent_linux/main-linux ];then
        echo "sidecar source file decompression error ..."
        Clean_Install_Pkg
        exit 1
    fi
    if [ ! -f \${AGENT_DIR}/main-linux ];then
        mv \${USER_HOME}/tmp/agent_linux/* \${AGENT_DIR}/
        Clean_Install_Pkg
    fi
            
}
            
Config_Agent(){
            
    STEP='Config_Agent'
    echo "[+] config agent..."
            
    if [ -d \${AGENT_DIR} ] && [ -f \${AGENT_DIR}/config.yml ];then
        sed -i "s|uuid:.*|uuid: \${UUID}|" \${AGENT_DIR}/config.yml
        sed -i "s|server:.*|server: \${SERVER}|" \${AGENT_DIR}/config.yml
        sed -i "s|port:.*|port: \${PORT}|" \${AGENT_DIR}/config.yml
    fi
            
}
            
Start_Agent(){
            
    STEP='Start_Agent'
    echo "[+] start agent..."
            
    $\{AGENT_DIR}/main-linux -c \${AGENT_DIR}/config.yml -> .agent.log &
}
            
Clean_Install_Pkg(){

    STEP='Clean_Install_Pkg'
    echo "[-] clean agent pkg..."

    [ -f \${USER_HOME}/tmp/agent.tar.gz ] && rm -f \${USER_HOME}/tmp/agent.tar.gz
    [ -d \${USER_HOME}/tmp/agent ] && rm -rf \${USER_HOME}/tmp/agent
}
            
Install_Agent
Config_Agent
Start_Agent
Clean_Install_Pkg`

            resolve(shell);
        });
    }

    private macosInstallShell() :Promise<string> {
        return new Promise((resolve, reject) => {
            let shell = `#!/bin/sh
export PATH=/sbin:/bin:/usr/sbin:/usr/bin:/usr/local/sbin:/usr/local/bin
                                    
SERVER="${config.get().domain}"
PORT="${process.env.PORT || config.get().server_port}"
UUID="${NodeUuid.v4()}"
AGENT_DOWNLOAD_URL="${config.get().linux_agent_download_url}"
USER_HOME=$(echo $(cd ~ && pwd))
AGENT_DIR="\${USER_HOME}/agent"
            
Install_Agent(){
            
    STEP='Install_Agent'
    echo "[+] Installing agent ..."
            
    mkdir -p \${USER_HOME}/tmp
    mkdir -p \${AGENT_DIR}
            
    if [ ! -f \${USER_HOME}/tmp/agent.tar.gz ];then
        curl -L "\${AGENT_DOWNLOAD_URL}" -o \${USER_HOME}/tmp/agent.tar.gz
    fi
            
    if [ ! -f \${USER_HOME}/tmp/agent.tar.gz  ];then
        echo "sidecar source file not found ..."
        Clean_Install_Pkg
        exit 1
    fi
            
    tar -xzf \${USER_HOME}/tmp/agent.tar.gz -C \${USER_HOME}/tmp/
    if [ ! -d \${USER_HOME}/tmp/agent_linux ] || [ ! -f \${USER_HOME}/tmp/agent_linux/main-linux ];then
        echo "sidecar source file decompression error ..."
        Clean_Install_Pkg
        exit 1
    fi
    if [ ! -f \${AGENT_DIR}/main-linux ];then
        mv \${USER_HOME}/tmp/agent_linux/* \${AGENT_DIR}/
        Clean_Install_Pkg
    fi
            
}
            
Config_Agent(){
            
    STEP='Config_Agent'
    echo "[+] config agent..."
            
    if [ -d \${AGENT_DIR} ] && [ -f \${AGENT_DIR}/config.yml ];then
        sed -i "" "s|uuid:.*|uuid: \${UUID}|" \${AGENT_DIR}/config.yml
        sed -i "" "s|server:.*|server: \${SERVER}|" \${AGENT_DIR}/config.yml
        sed -i "" "s|port:.*|port: \${PORT}|" \${AGENT_DIR}/config.yml
    fi
            
}
            
Start_Agent(){
            
    STEP='Start_Agent'
    echo "[+] start agent..."
            
    $\{AGENT_DIR}/main-linux -c \${AGENT_DIR}/config.yml -> .agent.log &
}
            
Clean_Install_Pkg(){

    STEP='Clean_Install_Pkg'
    echo "[-] clean agent pkg..."

    [ -f \${USER_HOME}/tmp/agent.tar.gz ] && rm -f \${USER_HOME}/tmp/agent.tar.gz
    [ -d \${USER_HOME}/tmp/agent ] && rm -rf \${USER_HOME}/tmp/agent
}
            
Install_Agent
Config_Agent
Start_Agent
Clean_Install_Pkg`

            resolve(shell);
        });
    }

    private winInstallShell() :Promise<string> {
        return new Promise((resolve, reject) => {
            resolve(null);
        });
    }

}

export default AgentServiceImpl;
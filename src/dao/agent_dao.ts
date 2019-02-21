import { getPool } from '../global';
import { getLog } from '../utils/log_utils';
import { Agent } from '../model/agent_model';

class AgentDao {

    private log: any = getLog('agent_dao.ts');

    constructor() {
        
    }

    /**
     * 添加agent到数据库
     * @param agent 对象
     */
    public add(agent: Agent) :Promise<any> {
        return new Promise((resolve, reject) => {
            getPool().query('INSERT agent (`uuid`, `status`, `host_name`, `os_type`, `os_platform`, `os_version`, `os_totalmem`, `os_arch`, `remark`, `version`, `ip`, `gmt_create`, `gmt_modified`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
                , [agent.uuid, agent.status, agent.host_name, agent.os_type, agent.os_platform, agent.os_version, agent.os_totalmem, agent.os_arch, agent.remark, agent.version, agent.ip, agent.gmt_create, agent.gmt_modified]
                , (error: any, results: any, fields: any) => {
                    if (error) throw error;
                    resolve(results);
                }
            );
        });
    }

    /**
     * 修改agent到数据库
     * @param agent 对象
     */
    public update(agent: Agent) :Promise<any> {
        return new Promise((resolve, reject) => {
            getPool().query('UPDATE agent SET `status` = ?, `host_name` = ?, `os_type` = ?, `os_platform` = ?, `os_version` = ?, `os_totalmem` = ?, `os_arch` = ?, `remark` = ?, `version` = ?, `ip` = ?, `gmt_modified` = ? WHERE `id` = ?'
                , [agent.status, agent.host_name, agent.os_type, agent.os_platform, agent.os_version, agent.os_totalmem, agent.os_arch, agent.remark, agent.version, agent.ip, agent.gmt_modified, agent.id]
                , (error: any, results: any, fields: any) => {
                    if (error) throw error;
                    resolve(results);
                }
            );
        });
    }

    /**
     * 修改agent到数据库
     * @param agent 对象
     */
    public updateStatusByUuid(agent: Agent) :Promise<any> {
        return new Promise((resolve, reject) => {
            getPool().query('UPDATE agent SET `status` = ?, `gmt_modified` = ? WHERE `uuid` = ?'
                , [agent.status, agent.gmt_modified, agent.uuid]
                , (error: any, results: any, fields: any) => {
                    if (error) throw error;
                    resolve(results);
                }
            );
        });
    }

    /**
     * 分页查询agent信息
     * @param start 起始位
     * @param limit 页大小
     */
    public list(start: number, limit: number) :Promise<any> {
        return new Promise((resolve, reject) => {
            getPool().query('SELECT * FROM agent LIMIT ?, ?'
                , [start, limit]
                , (error: any, results: any, fields: any) => {
                    if (error) throw error;
                    resolve(results);
                }
            );
        });
    }

    /**
     * 聚合查询
     */
    public count() :Promise<any> {
        return new Promise((resolve, reject) => {
            getPool().query('SELECT COUNT(1) AS count FROM agent'
                , []
                , (error: any, results: any, fields: any) => {
                    if (error) throw error;
                    resolve(results);
                }
            );
        });
    }

    /**
     * 通过id 查询agent信息
     * @param id agentId
     */
    public getById(id: number) :Promise<any> {
        return new Promise((resolve, reject) => {
            getPool().query('SELECT * FROM agent WHERE `id` = ?'
                , [id]
                , (error: any, results: any, fields: any) => {
                    if (error) throw error;
                    resolve(results);
                }
            );
        });
    }

    /**
     * 通过uuid 查询agent信息
     * @param uuid agent uuid
     */
    public getByUuid(uuid: string) :Promise<any> {
        return new Promise((resolve, reject) => {
            getPool().query('SELECT * FROM agent WHERE `uuid` = ?'
                , [uuid]
                , (error: any, results: any, fields: any) => {
                    if (error) throw error;
                    resolve(results);
                }
            );
        });
    }

}

export default AgentDao;
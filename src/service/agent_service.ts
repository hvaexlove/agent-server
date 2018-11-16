import { Request } from '../protocol/service';

export interface AgentService {
    
    /**
     * 修改agent状态
     * @param req 修改agent状态
     */
    updateStatus(uuid: string, status: number): Promise<any>;

    /**
     * 分页查询agent信息
     * @param pageIndex 当前页
     * @param pageSize 页大小
     */
    list(pageIndex?: number, pageSize?: number): Promise<any>;

    /**
     * 根据uuid查询agent信息
     * @param uuid uuid
     */
    getByUuid(uuid: string): Promise<any>;

    /**
     * agent register
     * @param req req接入后 立即执行注册业务
     */
    register(req: Request): Promise<any>;

    /**
     * agent 心跳处理 10s一次
     * @param req 心跳请求
     */
    heartbeat(req: Request): Promise<any>;

    /**
     * 一键安装agent
     * @param osType 系统类型
     */
    install(osType: string): Promise<any>;
    
    /**
     * report 请求响应
     * @param req 请求
     */
    report(req: Request): Promise<any>;

}
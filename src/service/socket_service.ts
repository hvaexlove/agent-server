import { Request } from '../protocol/service';

export interface SocketService {
    
    /**
     * agent连接业务
     * @param socket socket连接实例
     */
    connection(socket: any) : void;

    /**
     * 发送消息
     * @param request 消息体
     */
    send(socket: Request) : void;

    /**
     * 发送简单消息
     * @param target 目标地址
     * @param body 消息内容
     */
    sendSimpleMsg(target: string, body: any) :void;

    /**
     * 发送简单消息
     * @param target 目标地址
     * @param body 消息内容
     */
    syncSendSimpleMsg(target: string, body: any) :Promise<any>;

    /**
     * 获取当前socket连接的uuid
     * @returns uuid
     */
    getUuid() : string;

}
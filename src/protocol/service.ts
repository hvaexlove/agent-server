export interface Request {
    // 请求id 全局唯一
    id: string;
    // 响应agent发来的请求id
    req_id?: string;
    // 目标指令
    target: string;
    // 来源ip
    from: string;
    // 请求内容类型
    type: string;
    // 请求内容编码格式
    encode: string;
    // 请求头
    header: string;
    // 请求头Map
    headerMap: Map<string, any>;
    // 请求内容
    body: string;
    // 请求版本号
    version: string;
    // 超时时长
    timeout: number;
}
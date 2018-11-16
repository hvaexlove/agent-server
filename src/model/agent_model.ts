export interface Agent {
    
    // 主键 id 自增
    id?: number;
    // uuid
    uuid?: string;
    // 状态 0:停止 1:运行中 2:异常
    status?: number;
    // 主机名称
    host_name?: string;
    // os类型,linux，windows等
    os_type?: string;
    // os完整的名称
    os_platform?: string;
    // os版本
    os_version?: string;
    // os内存
    os_totalmem?: string;
    // cpu架构
    os_arch?: string;
    // 备注
    remark?: string;
    // agent版本
    version?: string;
    // ip地址
    ip?: string
    // 创建时间
    gmt_create?: string;
    // 修改时间
    gmt_modified?: string;

}
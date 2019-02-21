export interface Version {
    
    // 主键 id 自增
    id?: number;
    // 版本名称
    name?: string;
    // url
    url?: string;
    // 是否全量包 0:增量二进制 1:全量压缩包
    is_full?: string;
    // md5
    md5?: string;
    // os类型
    os_type?: string;
    // 创建时间
    gmt_create?: string;
    // 修改时间
    gmt_modified?: string;

}
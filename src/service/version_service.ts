export interface VersionService {
    
    /**
     * 分页查询agent信息
     * @param pageIndex 当前页
     * @param pageSize 页大小
     */
    list(pageIndex?: number, pageSize?: number): Promise<any>;

    /**
     * 通过id 查询 版本信息
     * @param id id
     */
    getById(id: number): Promise<any>;

}
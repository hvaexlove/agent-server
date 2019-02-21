import { getPool } from '../global';
import { getLog } from '../utils/log_utils';
import { Version } from '../model/version_model';

class VersionDao {

    private log: any = getLog('version_dao.ts');

    constructor() {
        
    }

    /**
     * 添加 version 到数据库
     * @param version 对象
     */
    public add(version: Version) :Promise<any> {
        return new Promise((resolve, reject) => {
            getPool().query('INSERT version (`name`, `url`, `is_full`, `md5`, `os_type`, `gmt_create`, `gmt_modified`) VALUES (?, ?, ?, ?, ?, ?, ?)'
                , [version.name, version.url, version.is_full, version.md5, version.os_type, version.gmt_create, version.gmt_modified]
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
            getPool().query('SELECT * FROM version LIMIT ?, ?'
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
            getPool().query('SELECT COUNT(1) AS count FROM version'
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
            getPool().query('SELECT * FROM version WHERE `id` = ?'
                , [id]
                , (error: any, results: any, fields: any) => {
                    if (error) throw error;
                    resolve(results);
                }
            );
        });
    }

}

export default VersionDao;
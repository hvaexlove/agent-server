const NodeUuid = require('node-uuid');
import { VersionService } from '../version_service';
import BaseService from '../base_service';
import VersionDao from '../../dao/version_dao';
import { Version } from '../../model/version_model';
import { getDate } from '../../utils/date_utils';
import { getLog } from '../../utils/log_utils';

class VersionServiceImpl extends BaseService implements VersionService {

    private log: any = getLog('version_service_impl.ts');
    private versionDao: any = new VersionDao();

    constructor() {
        super();
    }

    public async list(pageIndex?: number, pageSize?: number): Promise<any> {
        let start = (pageIndex - 1) * pageSize;
        let agentList: Array<any> = await this.versionDao.list(start, pageSize);
        let count: Array<any> = await this.versionDao.count();
        agentList = JSON.parse(JSON.stringify(agentList));
        count = JSON.parse(JSON.stringify(count));
        return {list: agentList, total: count[0].count};
    }

    public async getById(id: number): Promise<any> {
        return this.versionDao.getById(id);
    }
    
}

export default VersionServiceImpl;
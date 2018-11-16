import { Request } from '../protocol/service';

export interface OptionService {
    
    /**
     * 请求分发
     * @param req req接入分配对应业务
     */
    action(req: Request) : void;

}
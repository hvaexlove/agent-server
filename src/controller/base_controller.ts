export default class BaseController {

    public success(ctx: any, data: any) {
        let obj = {
            code: 0,
            data: data
        };
        let resultStr = JSON.stringify(obj);
        ctx.type = 'application/json'
        ctx.body = resultStr;
    }

    public successText(ctx: any, data: string) {
        ctx.body = data;
    }

    public error(ctx: any, msg: string) {
        let obj = {
            code: -1,
            data: msg
        };
        let resultStr = JSON.stringify(obj);
        ctx.type = 'application/json'
        ctx.body = resultStr;
    }
    
}
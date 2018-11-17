import BusinessException from './business_exception';
/**
 * 吃住所有异常 进行分类处理
 */
let initErrorHandler = () => {
    process.on('uncaughtException', (error) => {
        if (error instanceof BusinessException) {
            console.log(error.getMessage());
            if (error.getCode() === -1) {
                process.exit(error.getCode());
            }
        } else {
            console.log(error);
        }
    });
}

export {
    initErrorHandler
}
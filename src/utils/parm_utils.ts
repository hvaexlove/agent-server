/**
 * args: 参数
 * return: 参数对应的value
 */
let getParm = (args: string) :string => {
    let argsList:Array<string> = process.argv.splice(2);
    let argsIndex = argsList.indexOf(args);
    return argsList[argsIndex + 1];
};

export {
    getParm
}
let configObj: any = null;

module.exports.set = (config: object) => {
    configObj = config;
}

module.exports.get = () => {
    return configObj;
}
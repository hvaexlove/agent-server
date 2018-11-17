/**
 * map: map
 * return: json
 */
let mapToJson = (map: Map<any, any>) :string => {
    let obj = Object.create(null);
    for (let[k,v] of map) {
      obj[k] = v;
    }
    return JSON.stringify(obj);
};

/**
 * str: json字符串
 * return: map
 */
let jsonToMap = (str: string) :Map<any, any> => {
    let mapObj = JSON.parse(str);
    let strMap = new Map();
    for (let k of Object.keys(mapObj)) {
        strMap.set(k,mapObj[k]);
    }
    return strMap;
};

export {
    mapToJson, jsonToMap
}
/**
 * return: 参数对应的value
 */

function random(num: number) :string {
    let rnd = '';
    for(let i = 0; i < num; i++) {
        rnd += Math.floor(Math.random() * 10);
    }
    return rnd;
}

exports.getId = () :string => {
    let date: Date = new Date();
    let year: number = date.getFullYear();
    let month: number = date.getMonth()+1;
    let day: number = date.getDate();
    let hour: number = date.getHours();
    let minute: number = date.getMinutes();
    let second: number = date.getSeconds();
    let randomStr: string = random(5);
    let idStr: string = `${year}${month}${day}${hour}${minute}${second}${randomStr}`;
    return idStr;
};

exports.random = (num: number) :string => {
    return random(num);
};
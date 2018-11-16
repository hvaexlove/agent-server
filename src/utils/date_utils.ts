exports.getDate = () :string => {
    let date: Date = new Date();
    let year: number = date.getFullYear();
    let month: number = date.getMonth()+1;
    let day: number = date.getDate();
    let hour: number = date.getHours();
    let minute: number = date.getMinutes();
    let second: number = date.getSeconds();
    let dateStr: string = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    return dateStr;
};
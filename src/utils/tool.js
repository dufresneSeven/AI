function deepClone(obj){
    let cloneObj = Array.isArray(obj)?[]:{};
    for(let key in obj){
        if(obj.hasOwnProperty(key)){
            let ts = Object.prototype.toString.call(obj[key]).slice(8,-1)
            if(['Array','Object'].indexOf(ts)!=-1){
                cloneObj[key] = deepClone(obj[key])
            }else{
                cloneObj[key] = obj[key]
            }
        }
    }
    return cloneObj;
}

export default deepClone;
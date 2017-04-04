
export function perOfNum(per: number, num: number): number {
    return Math.round(per * num / 100);
}

export function randomNum(min: number, max: number): number {
    return Math.floor( Math.random() * (max - min + 1) ) + min;
}

export function merge(
    target: {[key: string]: any}, 
    ...objs: {[key: string]: any}[]
): {[key: string]: any} {

    let obj, prop, val;

    for (let i = 0; i < objs.length; ++i) {
        obj = objs[i];
        for (prop in obj) {
            val = obj[prop];
            if (typeof val === 'object') {
                if (typeof target[prop] !== 'object') {
                    target[prop] = {};
                }
                merge(target[prop], val);
            } else {
                target[prop] = val;
            }
        }
    }

    return target;
}
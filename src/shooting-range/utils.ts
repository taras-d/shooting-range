
export function perOfNum(per: number, num: number): number {
    return Math.round(per * num / 100);
}

export function randomNum(min: number, max: number): number {
    return Math.round( Math.random() * (max - min) ) + min;
}
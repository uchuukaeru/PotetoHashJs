const regTail = new RegExp("([0-9a-f]{2})$")

/**
 * 
 * @param {number} h 
 * @param {number} l 
 * @param {number} s 
 * @returns {{red: number, green: number, blue: number}}
 */
const HLS2RGB = (h, l, s) => {
    const MAX = 2.55 * (l + l * (s / 100));
    const MIN = 2.55 * (l - l * (s / 100));

    if (h >= 240 && h < 300){
        const red = ((h - 240) / 60) * (MAX - MIN) + MIN;
        return {
            red: Math.floor(red),
            green: Math.floor(MIN),
            blue: Math.floor(MAX)
        }
    } else if (h >= 300 && h < 360) {
        const blue = ((360 - h) / 60) * (MAX - MIN) + MIN;
        return {
            red: Math.floor(MAX),
            green: Math.floor(MIN),
            blue: Math.floor(blue)
        }
    }
}

/**
 * 
 * @param {boolean} roasted 
 * @param {string} data 
 * @returns {{red: number, green: number, blue: number}}
 */
export const createColor = (isRoasted, data) => {
    const exec = regTail.exec(data);
    if (exec === null){
        return {
            red: 255,
            green: 255,
            blue: 255
        };
    }
    const s = 100;
    let l = 49;
    let h = 262;
    const binNum = parseInt(exec[1], 16).toString(2).padStart(8, '0');
    const binH = binNum.slice(2);
    h += parseInt(binH, 2);
    if (isRoasted){
        const binLRoast = binNum.substring(0,3);
        l -= (10 + parseInt(binLRoast, 2));
    }
    return HLS2RGB(h, l, s);
}

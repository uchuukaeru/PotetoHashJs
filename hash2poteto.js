const regHead = new RegExp("^([0-9a-f]{12})")
/**
 * @param {string} data 
 * @param {number} iw 
 * @returns {boolean[][]}
 */
export const createPoteto = (data, iw) => {
    /** @type {boolean[][]} */
    const imagelist = new Array(iw);
    for (let j = 0; j < iw; j++) {
        imagelist[j] = new Array(iw).fill(false);
    }
    const exec = regHead.exec(data);
    if (exec === null) {
        return imagelist;
    }
    const shapeStr = exec[1];

    Array.prototype.forEach.call(shapeStr, function(s, index) {
        const binNum = parseInt(s, 16).toString(2).padStart(4, '0');
        const posi = binNum[0];
        const shape = parseInt(binNum.slice(-3), 2) !== 0? parseInt(binNum.slice(-3), 2): 1;
        
        /** @type {boolean[]} */
        const line = new Array(iw).fill(false);
        const shiftNum = (8 - shape) / 2;
        const startShiftNum = posi === "1"? Math.floor(shiftNum) : Math.ceil(shiftNum);

        for (let j = startShiftNum; j < shape + startShiftNum; j++) {
            line[4 + j] = true;
        }
        imagelist[2 + index] = line;
    });

    return imagelist;
}
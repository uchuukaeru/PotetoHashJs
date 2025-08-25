import {createPoteto} from "./hash2poteto.js"

const regTail = new RegExp("([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$")

/**
 * 
 * @param {string} data 
 * @param {number} r 
 */
export const encodeImageData = (data, r = 8) => {
    const iw = 16;
    const imagelist = createPoteto(data, iw);

    const qw = iw * r;
    const idata = new Uint8ClampedArray(qw * qw * 4);

    const regColor = regTail.exec(data);
    const red = regColor === null? 255 : parseInt(regColor[1], 16);
    const green = regColor === null? 255 : Math.floor(parseInt(regColor[2], 16) / 2);
    const blue = regColor === null? 255 : parseInt(regColor[3], 16);

    for (let i = 0; i < iw; i++){
        for (let j = 0; j < iw; j++){
            const c = imagelist[i][j];
            for(let p = 0; p < r * r; p++){
                const x = i * r + Math.floor(p / r);
                const y = j * r + (p % r);
                idata[(x + y * qw) *4 + 0] = c * red;
                idata[(x + y * qw) *4 + 1] = c * green;
                idata[(x + y * qw) *4 + 2] = c * blue;
                idata[(x + y * qw) *4 + 3] = 255;
            }
        }
    }
    return new ImageData(idata, qw, qw);
}

class PotetoHash extends HTMLElement {
    /**
     * 
     * @param {string} value 
     * @param {number} pixelsize 
     */
    constructor(value, pixelsize) {
        super();
        value = this.getAttribute("value") || value;
        this.pixelsize = this.getAttribute("pixelsize") || pixelsize;
        this.canvas = document.createElement("canvas");
        this.canvas.style.imageRendering = "pixelated";
        this.g = this.canvas.getContext("2d");
        this.appendChild(this.canvas);

        if (value) {
            this.value = value;
        } else {
            this.value = document.location.toString();
            window.addEventListener("hashchange", () => this.value = document.location.toString(), false);
        }
    }

    /**
     * @param {string} value
     */
    set value(value){
        // console.log("poteto : set value")
        const imgdata = encodeImageData(value, this.pixelsize);
        this.canvas.width = this.canvas.height = imgdata.width;
        // console.log(imgdata, imgdata.height)
        this.g.putImageData(imgdata, 0, 0);
    }
}
customElements.define('poteto-hash', PotetoHash);
export {PotetoHash};
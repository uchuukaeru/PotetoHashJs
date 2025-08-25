import {createPoteto} from "./hash2poteto.js"
import {createColor} from "./createColor.js"

/**
 * 
 * @param {string} data
 * @param {boolean} isRoasted
 * @param {number} r 
 */
export const encodeImageData = (data, isRoasted, r = 8) => {
    const iw = 16;
    const imagelist = createPoteto(data, iw);

    const qw = iw * r;
    const idata = new Uint8ClampedArray(qw * qw * 4);

    const color = createColor(isRoasted, data);
    const red = color["red"];
    const green = color["green"];
    const blue = color["blue"];

    for (let i = 0; i < iw; i++){
        for (let j = 0; j < iw; j++){
            const c = imagelist[i][j];
            for(let p = 0; p < r * r; p++){
                const x = i * r + Math.floor(p / r);
                const y = j * r + (p % r);
                idata[(x + y * qw) *4 + 0] = c? red : 255;
                idata[(x + y * qw) *4 + 1] = c? green : 255;
                idata[(x + y * qw) *4 + 2] = c? blue : 255;
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
     * @param {string} isRoasted
     * @param {number} pixelsize 
     */
    constructor(value, isRoasted, pixelsize) {
        super();
        value = this.getAttribute("value") || value;
        isRoasted = this.getAttribute("is_roasted") === "true" || isRoasted === "true";
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

        if (isRoasted) {
            this.isRoasted = isRoasted === "true";
        } else {
            this.isRoasted = false
        }
    }

    /**
     * @param {string} value
     */
    set value(value){
        const isRoastedBool = this.getAttribute("is_roasted") === "ture";
        const imgdata = encodeImageData(value, isRoastedBool, this.pixelsize);
        this.canvas.width = this.canvas.height = imgdata.width;
        this.g.putImageData(imgdata, 0, 0);
        this.setAttribute("value", value);
    }

    /**
     * @param {string} isRoasted
     */
    set isRoasted(isRoasted){
        const isRoastedBool = isRoasted === "true";
        const value = this.getAttribute("value");
        const imgdata = encodeImageData(value, isRoastedBool, this.pixelsize);
        this.canvas.width = this.canvas.height = imgdata.width;
        this.g.putImageData(imgdata, 0, 0);
        this.setAttribute("is_roasted", isRoastedBool);
    }
}
customElements.define('poteto-hash', PotetoHash);
export {PotetoHash};
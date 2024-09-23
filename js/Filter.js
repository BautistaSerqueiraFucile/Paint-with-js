export { Filter };

class Filter {

    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
    }

    glow() {
        let imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        let data = imageData.data;
        let index = 0;
        let factorBrillo = 2;

        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                index = (x + (y * canvas.width)) * 4;
                data[index] = Math.min(255, data[index] * factorBrillo);
                data[index + 1] = Math.min(255, data[index + 1] * factorBrillo);
                data[index + 2] = Math.min(255, data[index + 2] * factorBrillo);
            }
        }

        this.ctx.putImageData(imageData, 0, 0);
    }

    negative() {
        let imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        let data = imageData.data;
        let index = 0;

        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                index = (x + (y * canvas.width)) * 4;
                data[index] = 255 - data[index];
                data[index + 1] = 255 - data[index + 1];
                data[index + 2] = 255 - data[index + 2];
            }
        }

        this.ctx.putImageData(imageData, 0, 0);
    }

    binarization() {
        let imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        let data = imageData.data;
        let valorBinario = 0;
        let umbral = 128;

        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {

                const index = (x + (y * canvas.width)) * 4;
                const r = data[index];
                const g = data[index + 1];
                const b = data[index + 2];

                // Convert to gray scale
                const gray = (r + g + b) / 3;
                if (gray >= umbral) {
                    valorBinario = 255;
                } else valorBinario = 0;

                data[index] = valorBinario;
                data[index + 1] = valorBinario;
                data[index + 2] = valorBinario;
            }
        }
        this.ctx.putImageData(imageData, 0, 0);
    }

    sepia() {
        let imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        let data = imageData.data;

        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {

                const index = (x + (y * canvas.width)) * 4;
                const r = data[index];
                const g = data[index + 1];
                const b = data[index + 2];

                // Apply sepia formula
                const nuevoR = 0.393 * r + 0.769 * g + 0.189 * b;
                const nuevoG = 0.349 * r + 0.686 * g + 0.168 * b;
                const nuevoB = 0.272 * r + 0.534 * g + 0.131 * b;

                data[index] = Math.min(255, nuevoR);
                data[index + 1] = Math.min(255, nuevoG);
                data[index + 2] = Math.min(255, nuevoB);
            }
        }
        this.ctx.putImageData(imageData, 0, 0);
    }

    borderDetection() {
        let imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        let data = imageData.data;

        const kernelx =
            [[-1, 0, 1],
            [-2, 0, 2],
            [-1, 0, 1]];
        const kernely =
            [[-1, -2, -1],
            [0, 0, 0],
            [1, 2, 1]];

        for (let y = 1; y < canvas.height - 1; y++) {
            for (let x = 1; x < canvas.width - 1; x++) {

                let magX = 0, magY = 0;

                for (let ky = 0; ky < 3; ky++) {
                    for (let kx = 0; kx < 3; kx++) {
                        const index = (((y + ky) * this.canvas.width) + (x + kx)) * 4; 
                        const r = data[index];
                        const g = data[index + 1];
                        const b = data[index + 2];

                        // Convert to gray scale
                        const gray = (r + g + b) / 3;

                        magX += gray * kernelx[ky][kx];
                        magY += gray * kernely[ky][kx];
                    }
                }
                const color = Math.sqrt((magX * magX) + (magY * magY));

                const index = (x + (y * canvas.width)) * 4;
                data[index] = color;
                data[index + 1] = color;
                data[index + 2] = color;
            }
        }
        this.ctx.putImageData(imageData, 0, 0);
    }

    blur() {
        let imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        let data = imageData.data;

        let kernel = [
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1]
        ];

        for (let y = 0; y < this.canvas.height; y++) {
            for (let x = 0; x < this.canvas.width; x++) {
                let r = 0;
                let g = 0;
                let b = 0;
                let indice = 0;
                let cont = 0;
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        let nuevoIndiceX = x + i - Math.floor(3 / 2);
                        let nuevoIndiceY = y + i - Math.floor(3 / 2);

                        if (nuevoIndiceX >= 0 && nuevoIndiceX < this.canvas.width && nuevoIndiceY >= 0 && nuevoIndiceY < this.canvas.height) {
                            cont++;
                            indice = (nuevoIndiceX + (nuevoIndiceY * this.canvas.width)) * 4;

                            let k = kernel[i][j];

                            r += data[indice] * k;
                            g += data[indice + 1] * k;
                            b += data[indice + 2] * k;
                        }
                    }
                }

                indice = (x + (y * this.canvas.width)) * 4;

                data[indice] = r / cont;
                data[indice + 1] = g / cont;
                data[indice + 2] = b / cont;
            }
        }
        this.ctx.putImageData(imageData, 0, 0);
    }

    saturation() {
        let imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        let data = imageData.data;
        let saturationValue = 2;

        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {

                const index = (x + (y * canvas.width)) * 4;
                const r = data[index];
                const g = data[index + 1];
                const b = data[index + 2];

                // Convert to gray scale
                const gray = (r + g + b) / 3;

                data[index] = gray + (r - gray) * saturationValue;
                data[index + 1] = gray + (g - gray) * saturationValue;
                data[index + 2] = gray + (b - gray) * saturationValue;
            }
        }

        this.ctx.putImageData(imageData, 0, 0);
    }
}




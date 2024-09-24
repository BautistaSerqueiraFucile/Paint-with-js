import { Brush } from "./Brush.js";
import { Filter } from "./Filter.js";

/** @type { HTMLCanvasElement} */
let canvas = document.getElementById('canvas');
/** @type {CanvasRenderingContext2D} */
let ctx = canvas.getContext('2d');

//default configuration for brush
let mouseDown = false;
let color = document.querySelector("#color");
let size = document.querySelector("#size");
let brush = new Brush(ctx, 0, 0, color.value, size.value);
let eraser = document.querySelector("#eraser");

//button to administrate image 
let image_up = document.querySelector("#upload");
let image_down = document.querySelector("#download");
let del = document.querySelector("#del");

//image config
let img = new Image();

//filter config
let filter = new Filter(ctx, canvas);
let apply_filter = document.querySelector("#filter");
let select_filter = document.querySelector("#filter-select");



document.addEventListener('DOMContentLoaded', main);

function main() {
    //start canvas on white background
        ctx.fillStyle = "#FFFFFF"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

    canvas.addEventListener('mousedown', (e) => { //control mouse status for drawing
        mouseDown = true;
        let pos = getMousePos(e);
        brush.setPosition(pos.x, pos.y);
        brush.draw(pos.x, pos.y);
        brush.setPosition(pos.x, pos.y);
    });

    canvas.addEventListener('mousemove', (e) => { //control mouse status for drawing
        let pos = getMousePos(e);
        if (mouseDown) {
            brush.draw(pos.x, pos.y);
            brush.setPosition(pos.x, pos.y);
        }
    });

    document.addEventListener('mouseup', (e) => { //control mouse status for drawing
        mouseDown = false;
    });

    color.addEventListener('input', (e) => {
        brush.setColor(color.value);
    });

    eraser.addEventListener('click', (e) => { // set color of the brush for eraser
        brush.setColor("rgb(255,255,255)");
    });

    size.addEventListener('input', (e) => {
        if(size.value == 1){
            brush.setSize(size.value);
        }
        else brush.setSize((size.value * 3));
    });

    del.addEventListener('click', (e) => { //this function resets canvas to white color
        image_up.value = "";
        ctx.fillStyle = "#FFFFFF"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    });

    image_down.addEventListener('click', (e)=> { //this function downloads an image to users pc
        const dataURL = canvas.toDataURL('image/png');
        image_down.href = dataURL;
    });

    image_up.addEventListener('change', (e) => { // read uploaded image and adapt it to canvas size
        let file = image_up.files[0];
        let filereader = new FileReader();

        filereader.readAsDataURL(file);
        filereader.onload = (e) => {
            (img.src = e.target.result);
        }

        img.onload = () => {
            let anchoImagen = img.width;
            let altoImagen = img.height;

            const escala = Math.min(canvas.width / anchoImagen, canvas.height / altoImagen); // this calculates aspect ratio 

            const nuevoAncho = anchoImagen * escala; 
            const nuevoAlto = altoImagen * escala;

            ctx.drawImage(img, (canvas.width - nuevoAncho) / 2,
                (canvas.height - nuevoAlto) / 2, nuevoAncho, nuevoAlto);
        };
    });

    apply_filter.addEventListener('click', (e)=>{ // filter select control
        switch(select_filter.value){
            case 'glow':
                filter.glow();
            break;
            case 'negative':
                filter.negative();
            break;
            case 'binarization':
                filter.binarization();
            break;
            case 'sepia':
                filter.sepia();
            break;
            case 'saturation':
                filter.saturation();
            break;
            case 'border':
                filter.borderDetection();
            break;
            case 'blur':
                filter.blur();
            break;
            case 'sharpening':
                filter.sharpening();
            break;
        }
    })

    function getMousePos(e) {
        let x = e.offsetX;
        let y = e.offsetY;
        return { x, y };
    };
}


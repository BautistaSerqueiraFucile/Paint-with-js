export { Brush };

class Brush {

    constructor(ctx, x, y, color, size) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = size;
        this.ctx.lineCap = 'round';
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    draw(x, y) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y);
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
    }

    setColor(color){
        this.ctx.strokeStyle = color;
    }

    setSize(size){
        this.ctx.lineWidth = size;
    }

}



export function Gun(ctx, x, y, width, height, fill) {

    this.ctx = ctx;

    this.width = width;
    this.height = height;

    this.fill = fill;

    this.moveX(x);
    this.moveY(y);
}

Gun.prototype.moveX = function(x) {
    this.x = x;
    this.left = x;
    this.right = x + this.width;
}

Gun.prototype.moveWithinX = function(x) {
    this.moveX(x);
    if (this.left < 0) {
        this.moveX(0);
    } else if (this.right > this.ctx.canvas.width) {
        this.moveX(this.ctx.canvas.width - this.width);
    }
}

Gun.prototype.moveY = function(y) {
    this.y = y;
    this.top = y;
    this.bottom = y + this.height;
}

Gun.prototype.draw = function() {
    this.ctx.fillStyle = this.fill;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
}

export function Stats(ctx, x, y, fontSize, fill) {

    this.ctx = ctx;

    this.x = x;
    this.y = y;

    this.fontSize = fontSize;
    this.fill = fill;

    this.text = '';

    this.clear();
}

Stats.prototype.prepareText = function() {
    this.text = 
        'Shoots: ' + this.shoots + 
        ' / Hits: ' + this.hit + 
        ' / Miss: ' + this.miss;
}

Stats.prototype.clear = function() {

    this.shoots = 0;
    this.hit = 0;
    this.miss = 0;

    this.prepareText();
}

Stats.prototype.draw = function() {

    this.prepareText();

    var ctx = this.ctx;
    ctx.font = this.fontSize + 'px sans-serif';
    ctx.fillStyle = this.fill;
    ctx.textBaseline = 'top';
    ctx.fillText(this.text, this.x, this.y);
}
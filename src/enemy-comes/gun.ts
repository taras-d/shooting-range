
import { Component } from './component';

export interface GunOptions {
    fill: string;
}

export class Gun extends Component {

    public left: number;
    public right: number;
    public top: number;
    public bottom: number;

    constructor(
        ctx: CanvasRenderingContext2D, 
        x: number,
        y: number, 
        public width: number, 
        public height: number,
        public options: GunOptions
    ) {
        super(ctx, x, y);
        this.moveX(x);
        this.moveY(y);
    }

    moveX(x: number) {
        this.x = x;
        this.left = x;
        this.right = x + this.width;
    }

    moveXWithin(x: number) {

        this.moveX(x);

        let ctx = this.ctx;

        if (this.left < 0) {
            this.moveX(0);
        } else if (this.right > ctx.canvas.width) {
            this.moveX(ctx.canvas.width - this.width);
        }
    }

    moveY(y: number) {
        this.y = y;
        this.top = y;
        this.bottom = y + this.height;
    }

    draw() {

        let opts = this.options,
            ctx = this.ctx;

        ctx.fillStyle = opts.fill;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

}
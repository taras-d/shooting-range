
import { Component } from './component';

export enum BulletStatus { None, Miss, Hit };

export interface BulletOptions {
    fill: string;
}

export class Bullet extends Component {

    public status = BulletStatus.None;

    public left: number;
    public right: number;
    public top: number;
    public bottom: number;

    constructor(
        ctx: CanvasRenderingContext2D, 
        x: number, 
        y: number, 
        public radius: number, 
        public options: BulletOptions
    ) {
        super(ctx, x, y);
        this.moveX(x);
        this.moveY(y);
    }


    moveX(x) {
        this.x = x;
        this.left = x - this.radius;
        this.right = x + this.radius;
    }

    moveY(y) {
        this.y = y;
        this.top = y - this.radius;
        this.bottom = y + this.radius;
    }

    draw () {
        
        let ctx = this.ctx,
            opts = this.options;

        ctx.fillStyle = opts.fill;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

}
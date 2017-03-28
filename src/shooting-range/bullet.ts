import { Component } from './component';

export enum BulletStatus { None, Miss, Hit };

export interface BulletOptions {
    fill: string;
}

export class Bullet extends Component {

    status = BulletStatus.None;

    constructor(
        ctx: CanvasRenderingContext2D, 
        x: number, 
        y: number, 
        public radius: number, 
        public options: BulletOptions
    ) {
        super(ctx, x, y);
    }

    draw(): void {
        
        let ctx = this.ctx,
            opts = this.options;

        ctx.fillStyle = opts.fill;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

}
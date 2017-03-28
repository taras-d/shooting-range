
import { RectComponent } from './component';

export interface GunOptions {
    fill: string;
}

export class Gun extends RectComponent {

    constructor(
        ctx: CanvasRenderingContext2D, 
        x: number,
        y: number, 
        width: number, 
        height: number,
        public options: GunOptions
    ) {
        super(ctx, x, y, width, height);
    }

    moveTo(x: number): void {

        let ctx = this.ctx,
            leftMin = 0,
            leftMax = ctx.canvas.width - this.width;

        if (x < leftMin) {
            x = leftMin;
        } else if (x > leftMax) {
            x = leftMax;
        }

        this.x = x;
    }

    draw(): void {

        let opts = this.options,
            ctx = this.ctx;

        ctx.fillStyle = opts.fill;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

}
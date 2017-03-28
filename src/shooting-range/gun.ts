
import { RectComponent } from './component';

export interface GunOptions {
    fill: string;
    aim: boolean;
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

        if (opts.aim) {
            this.drawAim();
        }
    }

    drawAim(): void {

        let ctx = this.ctx,
            opts = this.options,
            x = Math.round(this.x + this.width / 2);

        ctx.save();

        ctx.strokeStyle = opts.fill;
        ctx.setLineDash([12, 12]);
        ctx.beginPath();
        ctx.moveTo(x, this.y);
        ctx.lineTo(x, 0);
        ctx.stroke();

        ctx.restore();
    }

}
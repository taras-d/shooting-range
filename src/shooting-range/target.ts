import { RectComponent } from './component';
import { Bullet, BulletStatus } from './bullet';
import { perOfNum, randomNum } from './utils';

export class TargetOptions {
    fill: string;
    life: { 
        fill: string;
    }
}

export class Target extends RectComponent {

    life: number;
    lifeFontSize: number;

    constructor(
        ctx: CanvasRenderingContext2D, 
        x: number, 
        y: number, 
        width: number, 
        height: number, 
        public options: TargetOptions
    ) {

        super(ctx, x, y, width, height);

        this.life = randomNum(1, 3);
        this.lifeFontSize = perOfNum(4, width);
    }

    draw(): void {

        let ctx = this.ctx,
            opts = this.options;

        ctx.fillStyle = opts.fill;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        if (this.life > 1) {
            this.drawLifeIndicator();
        }
    }

    drawLifeIndicator(): void {

        let x = this.x + this.width / 2,
            y = this.y + this.height / 2,
            ctx = this.ctx,
            opts = this.options;

        ctx.fillStyle = opts.life.fill;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.font = `${this.lifeFontSize} sans-serif`;
        ctx.fillText(this.life + '', x, y);
    }

    active(): boolean {
        return this.life > 0;
    }

    hitByBullet(bullet: Bullet): boolean {

        if (bullet.status !== BulletStatus.None) {
            return false;
        }

        let tLeft = this.x,
            tRight = this.x + this.width,
            tBottom = this.y + this.height;

        let bLeft = bullet.x - bullet.radius,
            bRight = bullet.x + bullet.radius,
            bTop = bullet.y - bullet.radius;

        return (
            bTop <= tBottom &&
            (
                (bLeft >= tLeft && bLeft <= tRight) ||
                (bRight >= tLeft && bRight <= tRight)
            )
        );
    }

}
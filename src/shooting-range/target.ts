import { RectComponent } from './component';
import { Bullet, BulletStatus } from './bullet';

export class TargetOptions {
    fill: string;
}

export class Target extends RectComponent {

    hit: boolean = false;

    constructor(
        ctx: CanvasRenderingContext2D, 
        x: number, 
        y: number, 
        width: number, 
        height: number, 
        public options: TargetOptions
    ) {
        super(ctx, x, y, width, height);
    }

    draw(): void {

        let ctx = this.ctx,
            opts = this.options;

        ctx.fillStyle = opts.fill;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    hitByBullet(bullet: Bullet): boolean {

        let tLeft = this.x,
            tRight = this.x + this.width,
            tBottom = this.y + this.height;

        let bLeft = bullet.x - bullet.radius,
            bRight = bullet.x + bullet.radius,
            bTop = bullet.y - bullet.radius;

        return (
            bullet.status === BulletStatus.None &&
            bTop <= tBottom &&
            (
                (bLeft >= tLeft && bLeft <= tRight) ||
                (bRight >= tLeft && bRight <= tRight)
            )
        );
    }

}
import { Component } from './component';
import { Bullet, BulletStatus } from './bullet';

export class EnemyOptions {
    fill: string;
}

export class Enemy extends Component {

    dead: boolean = false;

    left: number;
    right: number;
    top: number;
    bottom: number;

    constructor(
        ctx: CanvasRenderingContext2D, 
        x: number, 
        y: number, 
        public width: number, 
        public height: number, 
        public options: EnemyOptions
    ) {
        super(ctx, x, y);
        this.moveX(x);
        this.moveY(y);
    }


    moveX(x) {
        this.x = x;
        this.left = x;
        this.right = x + this.width;
    }

    moveY(y) {
        this.y = y;
        this.top = y;
        this.bottom = y + this.height;
    }

    draw() {

        let ctx = this.ctx,
            opts = this.options;

        ctx.fillStyle = opts.fill;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    hitByBullet(bullet: Bullet): boolean {
        return (
            bullet.status === BulletStatus.None &&
            bullet.top <= this.bottom &&
            (
                (bullet.left >= this.left && bullet.left <= this.right) ||
                (bullet.right >= this.left && bullet.right <= this.right)
            )
        );
    }

}
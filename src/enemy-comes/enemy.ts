
import { BulletResult } from './bullet';

export function Enemy(ctx, x, y, width, height, fill) {

    this.ctx = ctx;

    this.width = width;
    this.height = height;

    this.fill = fill;

    this.dead = false;

    this.moveX(x);
    this.moveY(y);
}

Enemy.prototype.moveX = function(x) {
    this.x = x;
    this.left = x;
    this.right = x + this.width;
}

Enemy.prototype.moveY = function(y) {
    this.y = y;
    this.top = y;
    this.bottom = y + this.height;
}

Enemy.prototype.draw = function() {
    this.ctx.fillStyle = this.fill;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
}

Enemy.prototype.hitByBullet = function(bullet) {
    return (
        bullet.result === BulletResult.None &&
        bullet.top <= this.bottom &&
        (
            (bullet.left >= this.left && bullet.left <= this.right) ||
            (bullet.right >= this.left && bullet.right <= this.right)
        )
    );
}
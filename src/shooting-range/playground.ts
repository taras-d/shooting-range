import { GameOptions } from './game';
import { Gun, GunOptions } from './gun';
import { Bullet, BulletStatus, BulletOptions } from './bullet';
import { Target, TargetOptions } from './target';
import { Stats, StatsOptions } from './stats';
import { perOfNum } from './utils';

export class Playground {

    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;

    width: number;
    height: number;

    gameOver: boolean;

    gun: Gun;
    gunStep: number;

    bullets: Bullet[];
    bulletsLen: number;
    bulletStep: number;

    targets: Target[];
    targetsLen: number;
    closestTarget: Target;

    stats: Stats;

    constructor(public options: GameOptions, public parent: HTMLElement) {

        this.width = options.screen.width;
        this.height = options.screen.height;

        this.gunStep = perOfNum(1.7, this.width);
        this.bulletStep = perOfNum(1, this.height);

        this.createCanvas();
        this.createStats();
        this.createGun();
    }

    newGame(): void {

        this.gameOver = false;

        this.bullets = [];
        this.bulletsLen = 0;

        this.targets = [];
        this.targetsLen = 0;
        this.closestTarget = null;

        this.stats.update(0, 0, 0);

        this.createTargets();

        this.draw();
    }

    createCanvas(): void {

        let canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.parent.appendChild(canvas);
    }

    createStats = function(): void {

        let x = perOfNum(2, this.width),
            y = perOfNum(95, this.height),
            fontSize = perOfNum(2.5, this.height);

        this.stats = new Stats(
            this.ctx, x, y, fontSize, this.options.stats );
    }

    createGun(): void {

        let stats = this.stats;

        let width = perOfNum(6, this.width),
            height = perOfNum(6, this.width),
            x = Math.round( (this.width / 2) - (width / 2) ),
            y = Math.round( stats.y - stats.fontSize - height );
            
        this.gun = new Gun(
            this.ctx, x, y, width, height, this.options.gun );
    }

    createBullet(): void {

        let gun = this.gun,
            bullets = this.bullets;

        let x = gun.x + gun.width / 2,
            y = gun.y,
            radius = perOfNum(1, this.width);

        bullets.push(
            new Bullet(this.ctx, x, y, radius, this.options.bullet )
        );

        this.bulletsLen = bullets.length;
    }

    createTargets(): void {

        let targets = this.targets,
            targetsLen = this.targetsLen,
            targetsInRow = 12;
        
        let gap = perOfNum(1.8, this.width),
            size = Math.round( (this.width - gap) / targetsInRow ),
            x = gap,
            y = gap,
            width = size - gap,
            height = size - gap;

        // Shift down old targets
        for (let i = 0, target: Target; i < targetsLen; ++i) {
            target = targets[i];
            if (target.active()) {
                target.y = (target.y + target.height + gap);
                target.draw();
            }
        }

        // Add new targets
        for (let i = 0; i < targetsInRow; ++i) {
            targets.push(
                new Target(
                    this.ctx, x, y, width, height, this.options.target )
            );
            x += (width + gap);
        }

        this.targetsLen = targets.length;
    }

    clear(): void {
        this.ctx.fillStyle = this.options.bg.fill;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    draw(): void {

        this.clear();

        this.drawGun();
        this.drawBullets();
        this.drawTargets();
        this.drawStats();

        this.checkGameOver();
        if (this.gameOver) {
            this.drawGameOver();
        }
    }

    drawGun(): void {
        this.gun.draw();
    }

    drawBullets(): void {

        let bullets = this.bullets,
            bulletsLen = this.bulletsLen;

        let bullet,
            bulletStep = this.bulletStep;
        
        for (let i = 0; i < bulletsLen; ++i) {

            bullet = bullets[i];

            // Skip bullets with status Hit or Miss
            if (bullet.status === BulletStatus.Hit ||
                bullet.status === BulletStatus.Miss)  {
                continue;
            }

            // Set bullet status to Miss if bullet out of canvas
            if (bullet.y + bullet.radius <= 0) {
                bullet.status = BulletStatus.Miss;
                continue;
            }

            // Move and draw bullet
            bullet.y -= bulletStep;
            bullet.draw();
        }
    }

    drawTargets(): void {

        let targets = this.targets,
            targetsLen = this.targetsLen,
            target: Target;
        
        let bullets = this.bullets,
            bulletsLen = this.bulletsLen,
            bullet: Bullet;

        let closestTarget = targets[0];

        for (let i = 0; i < targetsLen; ++i) {

            target = targets[i];

            // Skip inactive targets
            if (!target.active()) {
                continue;
            }

            // Check if bullet hit target
            for (let j = 0; j < bulletsLen; ++j) {
                bullet = bullets[j];
                if (target.hitByBullet(bullet)) {
                    --target.life;
                    bullet.status = BulletStatus.Hit;
                    break;
                }
            }

            // Draw active targets and save closest target
            if (target.active()) {
                target.draw();
                if (target.y + target.height > closestTarget.y + closestTarget.height) {
                    closestTarget = target;
                }
            }
        }

        this.closestTarget = closestTarget;
    }

    drawStats(): void {

        let bullets = this.bullets,
            bulletsLen = this.bulletsLen,
            bulletStatus: BulletStatus;

        let stats = this.stats,
            hits = 0,
            miss = 0;

        for (let i = 0; i < bulletsLen; ++i) {

            bulletStatus = bullets[i].status;

            if (bulletStatus === BulletStatus.Hit) {
                ++hits;
            } else if (bulletStatus === BulletStatus.Miss) {
                ++miss;
            }
        }

        stats.update(bulletsLen, hits, miss);
        stats.draw();
    }

    drawGameOver(): void {

        let ctx = this.ctx;

        ctx.save();

        // Transparent cover
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Game over text
        let fontSize = this.width * 0.1;
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.font = fontSize + 'px sans-serif';
        ctx.fillText('Game Over', this.width / 2, this.height / 2);

        // Stats text
        fontSize /= 3;
        ctx.textBaseline = 'top';
        ctx.font = fontSize + 'px sans-serif';
        ctx.fillText(this.stats.text, this.width / 2, this.height / 2);

        ctx.restore();
    }

    checkGameOver(): void {
        let closest = this.closestTarget;
        this.gameOver = (
            closest && closest.y + closest.height >= this.gun.y );
    }

    moveGunRight(): void {
        let gun = this.gun;
        gun.moveTo( gun.x + this.gunStep );
    }

    moveGunLeft(): void {
        let gun = this.gun;
        gun.moveTo( gun.x - this.gunStep );
    }

    destroy(): void {
        this.parent.removeChild(this.canvas);
    }

}
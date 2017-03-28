import { Gun } from './gun';
import { Bullet, BulletStatus } from './bullet';
import { Target } from './target';
import { Stats } from './stats';

export function Battle(options) {

    this.options = options;

    this.width = options.width;
    this.height = options.height;

    this.bulletStep = this.width * 0.01;

    this.createCanvas();
    this.createStats();
    this.createGun();
}

Battle.prototype.newBattle = function() {

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

Battle.prototype.createCanvas = function() {

    var canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.options.parent.appendChild(canvas);
}

Battle.prototype.createStats = function() {

    var x = this.perOfNum(2, this.width),
        y = this.perOfNum(95, this.height),
        fontSize = this.perOfNum(2.5, this.height);

    this.stats = new Stats(this.ctx, x, y, {
        fontSize: fontSize,
        fontFamily: 'sans-serif',
        fill: this.options.statsFill
    });
}

Battle.prototype.createGun = function() {

    var stats = this.stats;

    var width = this.perOfNum(6, this.width),
        height = this.perOfNum(6, this.width),
        x = Math.round( (this.width / 2) - (width / 2) ),
        y = Math.round( stats.y - stats.options.fontSize - height );
        
    this.gun = new Gun(this.ctx, x, y, width, height, {
        fill: this.options.gunFill
    });
}

Battle.prototype.createBullet = function() {

    var gun = this.gun,
        bullets = this.bullets;

    var x = gun.x + gun.width / 2,
        y = gun.y,
        radius = this.perOfNum(1, this.width);

    bullets.push(
        new Bullet(this.ctx, x, y, radius, {
            fill: this.options.bulletFill
        })
    );

    this.bulletsLen = bullets.length;
}

Battle.prototype.createTargets = function() {

    var targets = this.targets,
        targetsLen = this.targetsLen,
        targetsInRow = 12,
        targetFill = this.options.enemyFill;
    
    var gap = this.perOfNum(1.8, this.width),
        size = Math.round( (this.width - gap) / targetsInRow ),
        x = gap,
        y = gap,
        width = size - gap,
        height = size - gap;

    // Shift down old targets
    for (var i = 0, target; i < targetsLen; ++i) {
        target = targets[i];
        if (!target.hit) {
            target.y = (target.y + target.height + gap);
            target.draw();
        }
    }

    // Add new targets
    for (var i = 0; i < targetsInRow; ++i) {
        targets.push(
            new Target(this.ctx, x, y, width, height, {
                fill: this.options.targetFill
            })
        );
        x += (width + gap);
    }

    this.targetsLen = targets.length;
}

Battle.prototype.clear = function() {
    this.ctx.fillStyle = this.options.bgFill;
    this.ctx.fillRect(0, 0, this.width, this.height);
}

Battle.prototype.draw = function() {

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

Battle.prototype.drawGun = function() {
    this.gun.draw();
}

Battle.prototype.drawBullets = function() {

    var bullets = this.bullets,
        bulletsLen = this.bulletsLen;

    var bullet,
        bulletStep = this.bulletStep;
    
    for (var i = 0; i < bulletsLen; ++i) {

        bullet = bullets[i];

        // Skip bullets with status Hit or Miss
        if (bullet.status === BulletStatus.Hit ||
            bullet.status === BulletStatus.Miss)  {
            continue;
        }

        // Set bullet status to Miss if bullet out of canvas
        if (bullet.bottom <= 0) {
            bullet.status = BulletStatus.Miss;
            continue;
        }

        // Move and draw bullet
        bullet.y -= bulletStep;
        bullet.draw();
    }
}

Battle.prototype.drawTargets = function() {

    var targets = this.targets,
        targetsLen = this.targetsLen,
        target;
    
    var bullets = this.bullets,
        bulletsLen = this.bulletsLen,
        bullet,
        hitBullet;

    var closestTarget = targets[0];

    for (var i = 0; i < targetsLen; ++i) {

        target = targets[i];

        // Skip hit targets
        if (target.hit) {
            continue;
        }

        // Check if bullet hit target
        hitBullet = null;
        for (var j = 0; j < bulletsLen; ++j) {
            bullet = bullets[j];
            if (target.hitByBullet(bullet)) {
                hitBullet = bullet;
                break;
            }
        }

        // Bullet hit target
        if (hitBullet) {
            target.hit = true;
            hitBullet.status = BulletStatus.Hit;
            continue;
        }

        // Draw target
        target.draw();

        // Save closest
        if (target.y + target.height > closestTarget.y + closestTarget.height) {
            closestTarget = target;
        }
    }

    this.closestTarget = closestTarget;
}

Battle.prototype.drawStats = function() {

    var bullets = this.bullets,
        bulletsLen = this.bulletsLen,
        bulletStatus;

    var stats = this.stats,
        hits = 0,
        miss = 0;

    for (var i = 0; i < bulletsLen; ++i) {

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

Battle.prototype.drawGameOver = function() {

    var ctx = this.ctx;

    ctx.save();

    // Transparent cover
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, this.width, this.height);
    
    // Game over text
    var fontSize = this.width * 0.1;
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

Battle.prototype.checkGameOver = function() {
    this.gameOver = (
        this.closestTarget &&
        this.closestTarget.y + this.closestTarget.height >= this.gun.y
    );
}

Battle.prototype.destroy = function() {
    this.options.parent.removeChild(this.canvas);
}

Battle.prototype.perOfNum = function(per, num) {
    return Math.floor(per * num / 100);
}
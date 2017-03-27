import { Gun } from './gun';
import { Bullet, BulletResult } from './bullet';
import { Enemy } from './enemy';
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

    this.enemies = [];
    this.enemiesLen = 0;
    this.nearestEnemy = null;

    this.stats.clear();

    this.createEnemies();

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
        new Bullet(
            this.ctx, x, y, radius, this.options.bulletFill )
    );

    this.bulletsLen = bullets.length;
}

Battle.prototype.createEnemies = function() {

    var enemies = this.enemies,
        enemiesLen = this.enemiesLen,
        enemiesInRow = 12,
        enemyFill = this.options.enemyFill;
    
    var gap = this.perOfNum(1.8, this.width),
        size = Math.round( (this.width - gap) / enemiesInRow ),
        x = gap,
        y = gap,
        width = size - gap,
        height = size - gap;

    // Shift down old enemies
    for (var i = 0, enemy; i < enemiesLen; ++i) {
        enemy = enemies[i];
        if (!enemy.dead) {
            enemy.moveY( enemy.bottom + gap );
            enemy.draw();
        }
    }

    // Add new enemies
    for (var i = 0; i < enemiesInRow; ++i) {
        enemies.push(
            new Enemy(
                this.ctx, x, y, width, height, enemyFill )
        );
        x += (width + gap);
    }

    this.enemiesLen = enemies.length;
}

Battle.prototype.clear = function() {
    this.ctx.fillStyle = this.options.bgFill;
    this.ctx.fillRect(0, 0, this.width, this.height);
}

Battle.prototype.draw = function() {

    this.clear();

    this.drawGun();
    this.drawBullets();
    this.drawEnemies();
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

        // Skip bullets with result Hit or Miss
        if (bullet.result === BulletResult.Hit ||
            bullet.result === BulletResult.Miss)  {
            continue;
        }

        // Set bullet result to Miss if bullet out of canvas
        if (bullet.bottom <= 0) {
            bullet.result = BulletResult.Miss;
            continue;
        }

        // Move and draw bullet
        bullet.moveY( bullet.y - bulletStep );
        bullet.draw();
    }
}

Battle.prototype.drawEnemies = function() {

    var enemies = this.enemies,
        enemiesLen = this.enemiesLen,
        enemy;
    
    var bullets = this.bullets,
        bulletsLen = this.bulletsLen,
        bullet,
        hitBullet;

    var nearestEnemy = enemies[0];

    for (var i = 0; i < enemiesLen; ++i) {

        enemy = enemies[i];

        // Skip dead enemies
        if (enemy.dead) {
            continue;
        }

        // Check if bullet hit enemy
        hitBullet = null;
        for (var j = 0; j < bulletsLen; ++j) {
            bullet = bullets[j];
            if (enemy.hitByBullet(bullet)) {
                hitBullet = bullet;
                break;
            }
        }

        // Bullet hit enemy
        if (hitBullet) {
            enemy.dead = true;
            hitBullet.result = BulletResult.Hit;
            continue;
        }

        // Draw enemy
        enemy.draw();

        // Save nearest enemy
        if (enemy.bottom > nearestEnemy.bottom) {
            nearestEnemy = enemy;
        }
    }

    this.nearestEnemy = nearestEnemy;
}

Battle.prototype.drawStats = function() {

    var stats = this.stats;

    var bullets = this.bullets,
        bulletsLen = this.bulletsLen,
        bulletResult;

    stats.clear();

    for (var i = 0; i < bulletsLen; ++i) {

        bulletResult = bullets[i].result;

        if (bulletResult === BulletResult.Hit) {
            ++stats.hit;
        } else if (bulletResult === BulletResult.Miss) {
            ++stats.miss;
        }

        stats.shoots += 1;
    }

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
        this.nearestEnemy &&
        this.nearestEnemy.bottom >= this.gun.top
    );
}

Battle.prototype.destroy = function() {
    this.options.parent.removeChild(this.canvas);
}

Battle.prototype.perOfNum = function(per, num) {
    return Math.floor(per * num / 100);
}
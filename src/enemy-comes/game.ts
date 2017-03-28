import { Battle } from './battle';

export function Game(options) {

    this.battle = new Battle(options);

    this.canvas = this.battle.canvas;
    this.canvasRect = this.canvas.getBoundingClientRect();

    this.bindMethods();
    this.newGame();
}

Game.prototype.bindMethods = function() {

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);

    this.onFrameUpdate = this.onFrameUpdate.bind(this);
    this.onNewEnemies = this.onNewEnemies.bind(this);
    this.onBulletsQueue = this.onBulletsQueue.bind(this);
}

Game.prototype.newGame = function() {

    this.battle.newBattle();

    // Mouse events
    this.canvas.addEventListener('mousemove', this.onMouseMove);
    this.canvas.addEventListener('mousedown', this.onMouseDown);
    this.canvas.addEventListener('mouseup', this.onMouseUp);
    
    // Frame
    this.framePerSecond = 50;
    this.frameId = setInterval(this.onFrameUpdate, 1000 / this.framePerSecond);

    // New enemies
    this.newEnemiesMs = 2000;
    this.newEnemiesId = setInterval(this.onNewEnemies, this.newEnemiesMs);

    // Bullets queue
    this.bulletsQueueMs = 150;
}

Game.prototype.stopGame = function() {

    this.canvas.removeEventListener('mousemove', this.onMouseMove);
    this.canvas.removeEventListener('mousedown', this.onMouseDown);
    this.canvas.removeEventListener('mouseup', this.onMouseUp);

    clearInterval(this.frameId);
    clearInterval(this.newEnemiesId);
    clearInterval(this.bulletsQueueId);
}

Game.prototype.onFrameUpdate = function() {
    this.battle.draw();
    if (this.battle.gameOver) {
        this.stopGame();
    }
}

Game.prototype.onNewEnemies = function() {
    this.battle.createTargets();
}

Game.prototype.onBulletsQueue = function() {
    this.battle.createBullet();
}

Game.prototype.onMouseMove = function(event) {

    var gun = this.battle.gun,
        x = Math.round( event.clientX - this.canvasRect.left - gun.width / 2 );

    gun.moveTo(x);
    gun.draw();
}

Game.prototype.onMouseDown = function(event) {

    this.battle.createBullet();

    clearInterval(this.bulletsQueueId);

    this.bulletsQueueId = setInterval(
        this.onBulletsQueue, this.bulletsQueueMs );
}

Game.prototype.onMouseUp = function(event) {
    clearInterval(this.bulletsQueueId);
}

Game.prototype.destroy = function() {
    this.stopGame();
    this.battle.destroy();
}

import { Playground, PlaygroundOptions } from './playground';

export class Game {

    playground: Playground;

    canvas: HTMLCanvasElement;
    canvasRect: ClientRect;

    framePerSecond: number;
    frameId: number;

    newTargetsMs: number;
    newTargetsId: number;

    bulletsQueueMs: number;
    bulletsQueueId: number;

    constructor(options: PlaygroundOptions) {

        let playground = new Playground(options);

        this.playground = playground;
        this.canvas = playground.canvas;
        this.canvasRect = playground.canvas.getBoundingClientRect();

        this.bindMethods();
        this.newGame();
    }

    bindMethods(): void {

        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);

        this.onFrameUpdate = this.onFrameUpdate.bind(this);
        this.onNewTargets = this.onNewTargets.bind(this);
        this.onBulletsQueue = this.onBulletsQueue.bind(this);
    }

    newGame(): void {

        this.playground.newGame();

        // Mouse events
        this.canvas.addEventListener('mousemove', this.onMouseMove);
        this.canvas.addEventListener('mousedown', this.onMouseDown);
        this.canvas.addEventListener('mouseup', this.onMouseUp);
        
        // Frame
        this.framePerSecond = 50;
        this.frameId = setInterval(this.onFrameUpdate, 1000 / this.framePerSecond);

        // New enemies
        this.newTargetsMs = 2000;
        this.newTargetsId = setInterval(this.onNewTargets, this.newTargetsMs);

        // Bullets queue
        this.bulletsQueueMs = 150;
    }

    stopGame(): void {

        this.canvas.removeEventListener('mousemove', this.onMouseMove);
        this.canvas.removeEventListener('mousedown', this.onMouseDown);
        this.canvas.removeEventListener('mouseup', this.onMouseUp);

        clearInterval(this.frameId);
        clearInterval(this.newTargetsId);
        clearInterval(this.bulletsQueueId);
    }

    onFrameUpdate(): void {
        this.playground.draw();
        if (this.playground.gameOver) {
            this.stopGame();
        }
    }

    onNewTargets(): void {
        this.playground.createTargets();
    }

    onBulletsQueue(): void {
        this.playground.createBullet();
    }

    onMouseMove(event: MouseEvent): void {
        let gun = this.playground.gun;
        gun.moveTo( Math.round( event.clientX - this.canvasRect.left - gun.width / 2 ) );
        gun.draw();
    }

    onMouseDown(event: MouseEvent): void {

        this.playground.createBullet();

        clearInterval(this.bulletsQueueId);
        this.bulletsQueueId = setInterval( this.onBulletsQueue, this.bulletsQueueMs );
    }

    onMouseUp(event: MouseEvent): void {
        clearInterval(this.bulletsQueueId);
    }

    destroy(): void {
        this.stopGame();
        this.playground.destroy();
    }

}

window['ShootingRange'] = Game;
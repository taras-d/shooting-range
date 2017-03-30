import { Playground, PlaygroundOptions } from './playground';

export enum Key { 
    Space = 32, 
    Left = 37,
    Up = 38,
    Right = 39
}

export class Game {

    playground: Playground;

    canvas: HTMLCanvasElement;
    canvasRect: ClientRect;

    FPS: number = 50;
    frameId: number;

    newTargetsDelay: number = 3000;
    newTargetsId: number;

    fireDelay: number = 150;
    fireId: number;

    keys = [];

    constructor(options: PlaygroundOptions) {

        let pg = new Playground(options);

        this.playground = pg;
        this.canvas = pg.canvas;
        this.canvasRect = pg.canvas.getBoundingClientRect();

        this.bindMethods();
        this.newGame();
    }

    bindMethods(): void {

        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);

        this.onNewFrame = this.onNewFrame.bind(this);
        this.onNewTargets = this.onNewTargets.bind(this);
    }

    newGame(): void {

        this.playground.newGame();

        // Mouse events
        this.canvas.addEventListener('mousemove', this.onMouseMove);
        this.canvas.addEventListener('mousedown', this.onMouseDown);
        this.canvas.addEventListener('mouseup', this.onMouseUp);

        // Keyboard events
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
        
        // Frame interval
        this.frameId = setInterval(this.onNewFrame, 1000 / this.FPS);

        // New targets interval
        this.newTargetsId = setInterval(this.onNewTargets, this.newTargetsDelay);
    }

    stopGame(): void {

        let canvas = this.canvas;

        canvas.removeEventListener('mousemove', this.onMouseMove);
        canvas.removeEventListener('mousedown', this.onMouseDown);
        canvas.removeEventListener('mouseup', this.onMouseUp);

        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);

        clearInterval(this.frameId);
        clearInterval(this.newTargetsId);
        clearInterval(this.fireId);
    }

    startFire(): void {

        if (this.fireId) {
            return;
        }

        let pg = this.playground;

        // Create first bullet
        pg.createBullet();

        // Create next bullets with interval
        clearInterval(this.fireId);
        this.fireId = setInterval(() => pg.createBullet(), this.fireDelay);
    }

    stopFire(): void {
        clearInterval(this.fireId);
        this.fireId = null;
    }

    onNewFrame(): void {

        let pg = this.playground,
            keys = this.keys;

        if (keys[Key.Left]) {
            pg.moveGunLeft();
        } else if (keys[Key.Right]) {
            pg.moveGunRight();
        }

        pg.draw();

        if (pg.gameOver) {
            this.stopGame();
        }
    }

    onNewTargets(): void {
        this.playground.createTargets();
    }

    onMouseMove(event: MouseEvent): void {
        let gun = this.playground.gun;
        gun.moveTo( Math.round( event.clientX - this.canvasRect.left - gun.width / 2 ) );
    }

    onMouseDown(event: MouseEvent): void {
        this.startFire();
    }

    onMouseUp(event: MouseEvent): void {
        this.stopFire();
    }

    onKeyDown(event: KeyboardEvent): void {

        let key = event.keyCode || event.which;
        this.keys[key] = true;

        if (key === Key.Space || key === Key.Up) {
            this.startFire();
        }
    }

    onKeyUp(event: KeyboardEvent): void {

        let key = event.keyCode || event.which;
        this.keys[key] = false;

        if (key === Key.Space || key === Key.Up) {
            this.stopFire();
        }
    }

    destroy(): void {
        this.stopGame();
        this.playground.destroy();
    }

}

window['ShootingRange'] = Game;
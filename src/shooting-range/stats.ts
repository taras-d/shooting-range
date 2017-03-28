import { Component } from './component';

export interface StatsOptions {
    fontFamily: string;
    fill: string;
}

export class Stats extends Component {

    text: string;

    constructor(
        ctx: CanvasRenderingContext2D, 
        x: number, 
        y: number, 
        public fontSize: number,
        public options: StatsOptions
    ) {
        super(ctx, x, y);
        this.update(0, 0, 0);
    }

    update(shoots: number, hits: number, miss: number): void {
        this.text = `Shoots: ${shoots} / Hits: ${hits} / Miss: ${miss}`;
    }

    draw(): void {

        let ctx = this.ctx,
            opts = this.options;

        ctx.font = `${this.fontSize}px ${opts.fontFamily}`;
        ctx.fillStyle = opts.fill;
        ctx.textBaseline = 'top';
        ctx.fillText(this.text, this.x, this.y);
    }

}
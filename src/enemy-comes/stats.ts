import { Component } from './component';

export interface StatsOptions {
    fontSize: number;
    fontFamily: string;
    fill: string;
}

export class Stats extends Component {

    private text: string;

    shoots: number;
    hits: number;
    miss: number;

    constructor(
        ctx: CanvasRenderingContext2D, 
        x: number, 
        y: number, 
        public options: StatsOptions
    ) {
        super(ctx, x, y);
        this.clear();
    }

    prepareText() {
        this.text = `Shoots: ${this.shoots} / Hits: ${this.hits} / Miss: ${this.miss}`;
    }

    clear() {

        this.shoots = 0;
        this.hits = 0;
        this.miss = 0;

        this.prepareText();
    }

    draw() {

        this.prepareText();

        let ctx = this.ctx,
            opts = this.options;

        ctx.font = `${opts.fontSize} ${opts.fontFamily}`;
        ctx.fillStyle = opts.fill;
        ctx.textBaseline = 'top';
        ctx.fillText(this.text, this.x, this.y);
    }

}
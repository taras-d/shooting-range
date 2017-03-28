
export class Component {

    constructor(
        protected ctx: CanvasRenderingContext2D,
        public x: number,
        public y: number
    ) {

    }

}

export class RectComponent extends Component {

    constructor(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        public width: number,
        public height: number
    ) {
        super(ctx, x, y);
    }

}
import { GL } from "../../../utils/logic/game_logic";
import { Bullet } from "../bullet/bullet";
interface Box2D {
    x0: number,
    y0: number,
    x1: number,
    y1: number
}
/**
 * A weak shield that only supports one hit
 */
export class Shield {
    _shieldLayout: Box2D[][] = []
    constructor(
        public parts: number, // increased number of parts increses detail, one part
        // means only one block
        public x: number,
        public y: number,
        public width: number,
        public height: number,

    ) {
        this.buildShieldLayout()
    }

    private buildShieldLayout() {
        this.calculateLayout(this.parts)
        this.extrudeBoxes()
    }

    private calculateLayout(n: number) {
        if (n === 1) {
            this._shieldLayout.push([{ x0: this.x, x1: this.x + this.width, y0: this.y, y1: 0 }]); // y1 needs to be filled later
            return;
        } else if (n === 2) {
            // build a 1x2 matrix
            const box1: Box2D = { x0: this.x, x1: Math.floor(this.x + this.width / 2), y0: this.y, y1: 0 };
            const box2: Box2D = { x0: box1.x1, x1: Math.floor(box1.x1 + this.width / 2), y0: this.y, y1: 0 };
            this._shieldLayout.push([box1, box2]);
            return;
        } else if (n === 3) {
            // build a 1x3 matrix
            const box1: Box2D = { x0: this.x, x1: Math.floor(this.x + this.width / 3), y0: this.y, y1: 0 };
            const box2: Box2D = { x0: box1.x1, x1: Math.floor(box1.x1 + this.width / 3), y0: this.y, y1: 0 };
            const box3: Box2D = { x0: box2.x1, x1: Math.floor(box2.x1 + this.width / 3), y0: this.y, y1: 0 };
            this._shieldLayout.push([box1, box2, box3]);
            return;
        } else {
            const sqrt = Math.sqrt(n);
            if (Number.isInteger(sqrt)) {
                for (let i = 0; i < sqrt; i++)
                    this.calculateLayout(sqrt);
                return;
            }
            let n2 = Number.parseInt(`${n}`);
            let isInt, sqrt2;
            do {
                sqrt2 = Math.sqrt(n2);
                isInt = Number.isInteger(sqrt2);
                !isInt && n2--;
            } while (!isInt);
            this.calculateLayout(sqrt2);
            this.calculateLayout(n - n2);
        }

    }

    private extrudeBoxes() {
        const h = Math.floor(this.height / this._shieldLayout.length);
        this._shieldLayout.forEach((e, i) => {
            const li = this._shieldLayout[i - 1];
            let li1 = li ? li[0] : undefined;
            e.forEach(i => {
                i.y0 = (li1?.y1 ?? i.y0);
                i.y1 = (li1?.y1 ?? i.y0) + h;
            });
        });
    }
    /**
     * Draws a shield on the field
     * @param ctx 
     */
    drawShield(ctx: CanvasRenderingContext2D) {
        this._shieldLayout.forEach(r => {
            r.forEach(c => {
                ctx.beginPath();
                ctx.rect(c.x0, c.y0, c.x1 - c.x0, c.y1 - c.y0);
                ctx.fillStyle = '#5f7';
                ctx.fill();
                ctx.closePath();
            })
        })
    }

    /**
     * Checks if a bullet collides with the shield, reducing its health
     * @param bullet 
     */
    checkCollision(bullet: Bullet) {
        for (let r of this._shieldLayout) {
            const index = r.findIndex(block => GL.collX(block.x0, block.x1, bullet.posX, bullet.posX + bullet.size) &&
                GL.collX(block.y0, block.y1, bullet.posY, bullet.posY + bullet.size));
            if (index >= 0) {
                const el = r.slice()[index];
                r.splice(index, 1);
                return el;
            }
        }
    }

}
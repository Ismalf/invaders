
export class Ship {
    
    constructor(
        public color: any | undefined = '',
        public posX: number = 0,
        public posY: number = 0,
        public size: number = 0,
        public type: string = '', // player or enemy
        public health: number = 0,
        public speed: number = 0,
        public points: number = 0,
        public dir?: string,
    ) {

    }

    drawShip(ctx: CanvasRenderingContext2D) {
        switch (this.type) {
            case 'player': return this._drawPlayerShip(ctx);
            case 'enemy': return this._drawEnemyShip(ctx);
            default: return ctx
        }
    }

    private _drawEnemyShip(ctx: CanvasRenderingContext2D) {
        const baseH = this.size / 3 // lower end of the ship
        const bodyH = this.size / 3 // middle part
        const bodyW = this.size / 2 // middle part
        const clawH = this.size / 4 // claws or front part
        ctx.beginPath()
        ctx.rect(this.posX, this.posY, this.size, baseH)
        ctx.rect(this.posX + this.size / 2 - bodyW / 2, this.posY + baseH, bodyW, bodyH)
        ctx.rect(this.posX, this.posY + baseH + bodyH, clawH, clawH)
        ctx.rect(this.posX + this.size - clawH, this.posY + baseH + bodyH, clawH, clawH)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.closePath()
        return ctx
    }

    private _drawPlayerShip(ctx: CanvasRenderingContext2D) {
        const baseH = this.size / 3 // lower end of the ship
        const canonH = this.size / 3 // middle part
        ctx.beginPath()
        ctx.rect(this.posX + this.size / 2 - this.size / 8, this.posY, this.size / 4, canonH) // draw cannon
        ctx.rect(this.posX, this.posY + canonH, this.size, baseH)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.closePath()
        return ctx
    }
}

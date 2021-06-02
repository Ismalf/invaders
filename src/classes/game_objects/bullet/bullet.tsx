export class Bullet {
    constructor(
        public color: string = '',
        public dir: string = 'up',
        public vel: number = 0,
        public posX: number = 0,
        public posY: number = 0,
        public size: number = 0,
        public dmg: number = 0
    ) { }

    draw(ctx: CanvasRenderingContext2D){
        ctx.beginPath()
        ctx.rect(this.posX, this.posY, this.size, this.size)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.closePath()
    }
}
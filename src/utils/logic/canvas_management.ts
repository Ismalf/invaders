import { Bullet } from "../../classes/game_objects/bullet/bullet";
import { Shield } from "../../classes/game_objects/shield/shield";
import { Ship } from "../../classes/game_objects/ship/ship";

export class CM {
    /**
     * Cleans the canvas so a new frame can be rendered
     */
    static clean(ctx: CanvasRenderingContext2D, playgroundWidth: number, playgroundHeight: number) {
        ctx.clearRect(0, 0, playgroundWidth, playgroundHeight);
        ctx.beginPath()
        ctx.rect(0, 0, playgroundWidth, playgroundHeight)
        ctx.fillStyle = '#000';
        ctx.fill()
        ctx.closePath()
    }

    /**
     * Draws a new frame
     * @param bullets bullets on screen
     * @param enemies enemies on screen
     */
    static draw(bullets: Bullet[], ships: Ship[], ctx: CanvasRenderingContext2D, shields: Shield[]) {
        ships.forEach(s => s?.drawShip(ctx));
        bullets.forEach(b => b?.draw(ctx));
        shields.forEach(s => s.drawShield(ctx));
    }
}
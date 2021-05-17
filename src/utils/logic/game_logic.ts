import { Bullet } from "../../components/bullet/bullet"
import { Shield } from "../../components/shield/shield"
import { Ship } from "../../components/ship/ship"

/**
 * Game Logic class container
 */
export class GL {
    /**
     * Checks collission on the Y axis between a target and a "moving" element
     * @param y11 target element original Y coordinate
     * @param y12 target element original Y coordinate plus the element's size (height)
     * @param y21 moving element original Y coordinate
     * @param y22 moving element original Y coordinate plus the element's size (height)
     * @returns 
     */
    static collY = (y11: number, y12: number, y21: number, y22: number) =>
        (y21 >= y11 && y21 <= y12) || (y22 >= y11 && y22 <= y12)

    /**
     * Checks collission on the X axis between a target and a "moving" element
     * @param x11 target element original X coordinate
     * @param x12 target element original X coordinate plus the element's size (width)
     * @param x21 moving element original X coordinate
     * @param x22 moving element original X coordinate plus the element's size (width)
     * @returns 
     */
    static collX = (x11: number, x12: number, x21: number, x22: number) =>
        (x21 >= x11 && x21 <= x12) || (x22 >= x11 && x22 <= x12)

    /**
     * Clears all the bullets that are either outside of the screen or have damaged a ship
     * @param bullets 
     * @returns 
     */
    static cleanBullets(bullets: Array<Bullet>, playgroundHeight: number) {
        // Erase bullets out of screen
        return bullets.filter(b => b.posY <= playgroundHeight && b.posY + b.size >= 0 && b.dmg > 0)
    }

    /**
     * Clears all enemy ships that are either out of the screen or have 0 health points
     * @param enemies 
     * @returns 
     */
    static cleanEnemies(enemies: Array<Ship>, playgroundHeight: number) {
        const count = enemies.filter(e => e.posY + e.size > playgroundHeight).length;
        return { enemies: enemies.filter(e => e.posY + e.size <= playgroundHeight && e.health > 0), count };
    }

    /**
     * Decides whether an enemy is able or not to shoot at the player
     * @param i 
     * @param enemies 
     * @returns 
     */
    static isAbleToShoot(i: number, enemies: Ship[], player: Ship) {
        if (i >= enemies.length) return false;
        const enemy = enemies[i];
        const intrr = enemies.filter((v, index) => index !== i).find(e => GL.collX(enemy.posX, enemy.posX + enemy.size, e.posX, e.posX + e.size) && enemy.posY < e.posY + e.size);
        return !intrr && GL.collX(enemy.posX, enemy.posX + enemy.size, player.posX - player.speed, player.posX + player.size + player.speed);
    }

    static shootShields(i: number, enemies: Ship[], shields: Shield[]) {
        if (i >= enemies.length) return false;
        const enemy = enemies[i];
        const intrr = enemies.filter((v, index) => index !== i).find(e => GL.collX(enemy.posX, enemy.posX + enemy.size, e.posX, e.posX + e.size) && enemy.posY < e.posY + e.size);
        return !intrr && shields.some(s => s._shieldLayout.some(r => r.some(b => (GL.collX(enemy.posX, enemy.posX + enemy.size, b.x0, b.x1)))));
    }

}
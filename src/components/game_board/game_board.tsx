import React from 'react';
import './game_board.css';
import { Ship } from '../ship/ship';
import { Bullet } from '../bullet/bullet'
interface GameState {
    wave: number,
    enemyLimit: number,
    score: number,
    maxScore: number,
    playerLives: number,
    hasLost: boolean,
    loopId: any
}

interface GameProps {
    shotTimeOut: number,
    frameRate: number,
    playgroundWidth: number,
    playgroundHeight: number,
    enemyGenerator?: GeneratorFunction
}

class GameBoard extends React.Component<GameProps, GameState>{

    /**
     * Array of generators to populate screen with different patterns of enemies
     */
    enemyGen: Array<Generator> = [];
    /**
     * Activated when right arrow is pressed or device is tilted to the east
     */
    isMovinRight: boolean = false;
    /**
     * Activated when left arrow is pressed or device is tilted to the west
     */
    isMovinLeft: boolean = false;
    /**
     * Activated when up arrow is pressed or a touch is detected on device screen
     */
    isShooting: boolean = false;
    /**
     * Index of the current enemy generator working
     */
    generatorRunning: number = 0;
    /**
     * Populated with the enemy ships that had shot, to prevent multi shots from the same enemy
     * while keeping the number of bullets to a certain limit
     */
    enemiesShot: number[] = [];

    readonly BULLET_SPEED: number = 5;
    readonly BULLET_DMG: number = 100;
    readonly ENEMY_HP: number = 100;
    readonly ENEMY_SPEED: number = 0.1;
    readonly PLAYER_SPEED: number = 2;
    readonly VERTICAL_OFFSET: number = 5;
    readonly ENEMY_SHOT_INTERVAL: number = 1000;
    readonly ENEMY_SPEED_BOOST_INTERVAL: number = 10000;
    readonly LIMIT_OF_ENEMY_SHIPS_ON_SCREEN: number = 100;
    readonly PLAYER_SIZE = 32;

    /**
     * Object representing the player on the screen
     */
    player: Ship = new Ship();
    /**
     * Array of bullets on the screen, filled when player or enemy fires
     */
    bullets: Bullet[] = [];
    /**
     * List of enemies created by the enemy generator array
     */
    enemies: Ship[] = [];
    /**
     * Reference to the canvas in which the game is drawn
     */
    btfld: HTMLCanvasElement;
    /**
     * Context to create 2d graphics
     */
    ctx: CanvasRenderingContext2D;
    /**
     * Timeout to prevent the player from spaming bullets
     */
    nextShotIn: number;
    /**
     * Timeout to prevent the enemy from spaming bullets
     */
    nextEnemyShotIn: number;
    /**
     * Timeout to increase the enemy speed
     * @param props 
     */
    nextSpeedBoostIn: number;


    constructor(props: GameProps) {
        super(props);
        this.nextShotIn = 0
        this.nextEnemyShotIn = 0
        this.nextSpeedBoostIn = this.ENEMY_SPEED_BOOST_INTERVAL
        this.state = {
            wave: 1,
            enemyLimit: this.LIMIT_OF_ENEMY_SHIPS_ON_SCREEN,
            maxScore: 0,
            score: 0,
            playerLives: 3,
            hasLost: false,
            loopId: 0
        }

        this.btfld = document.getElementById('battleField') as HTMLCanvasElement
        this.ctx = this.btfld?.getContext('2d') as CanvasRenderingContext2D
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.handleKeyUp = this.handleKeyUp.bind(this)
        this.handleAccelerometer = this.handleAccelerometer.bind(this)
        this.handleTapDown = this.handleTapDown.bind(this)
        this.handleTapUp = this.handleTapUp.bind(this)
    }

    componentDidMount() {
        this.initalizeVars()
        window.addEventListener('keydown', this.handleKeyDown)
        window.addEventListener('keyup', this.handleKeyUp)
        window.addEventListener('devicemotion', this.handleAccelerometer);
        window.addEventListener('touchstart', this.handleTapDown);
        window.addEventListener('touchend', this.handleTapUp);
        this.btfld = document.getElementById('battleField') as HTMLCanvasElement
        this.ctx = this.btfld?.getContext('2d') as CanvasRenderingContext2D
        this.ctx.scale(1, 1)
        this.initGame()
    }

    /**
     * Locates the player at an initial position within the canvas,
     * also prepares the enemy generators
     */
    initalizeVars() {
        const initialXPos = this.props.playgroundWidth / 2 - this.PLAYER_SIZE / 2; // minus half the ship width
        const initialYPos = this.props.playgroundHeight - this.PLAYER_SIZE; // minus the ship height
        this.player = new Ship('#00ff00', initialXPos, initialYPos, 32, 'player', 100, 1)
        this.bullets = Array(0);
        this.enemies = Array(0);
        this.enemyGen = Array(0);
        this.generatorRunning = 0;

        this.isMovinLeft = false
        this.isMovinRight = false
        this.isShooting = false
        this.enemyGen.push(this.buildShip(this.PLAYER_SIZE, 4 * (Math.floor(this.props.playgroundWidth / (this.PLAYER_SIZE + 10)) - 1), 'r', 35))
    }

    /**
     * Called when the player presses a key (COMPUTER ONLY)
     * @param ev KeyboardEvent
     */
    handleKeyDown(ev: KeyboardEvent) {
        switch (ev.key) {
            case 'ArrowRight':
                this.isMovinLeft = false
                this.isMovinRight = true
                break;
            case 'ArrowLeft':
                this.isMovinLeft = true
                this.isMovinRight = false
                break;
            case 'ArrowUp':
                this.isShooting = true;
                break;
        }
    }

    /**
     * Called when the player stops pressing a key (COMPUTER ONLY)
     * @param ev 
     */
    handleKeyUp(ev: KeyboardEvent) {
        switch (ev.key) {
            case 'ArrowRight':
                this.isMovinRight = false
                break;
            case 'ArrowLeft':
                this.isMovinLeft = false
                break;
            case 'ArrowUp':
                this.isShooting = false
                break;
        }

    }

    /**
     * Keeps track of the device acceleration on the x axis to move the ship left or right
     * @param ev 
     * @returns void, prevents of running unnecessary code if no accelerometer x value is found
     */
    handleAccelerometer(ev: DeviceMotionEvent) {
        const el = document.getElementById('debug')
        if (el) {
            el.innerHTML = `x: ${ev.accelerationIncludingGravity?.x} y:${ev.accelerationIncludingGravity?.y} z:${ev.accelerationIncludingGravity?.z}`
        }
        const x = ev.accelerationIncludingGravity?.x
        if (!x) return
        if (x > 0) {
            this.isMovinLeft = true;
            this.isMovinRight = false;
        } else if (x < 0) {
            this.isMovinRight = true;
            this.isMovinLeft = false;
        }
    }

    /**
     * When the player stops tapping on the screen, the player ship stops shooting
     * @param ev 
     */
    handleTapUp(ev: TouchEvent) { this.isShooting = false }

    /**
     * When the player starts tapping on the screen, the player ship starts shooting
     * @param ev 
     */
    handleTapDown(ev: TouchEvent) { this.isShooting = true }

    /**
     * Starts the game loop, performing drawing and collision detection calculations
     */
    initGame() {
        const ex = () => {
            const loopId = setInterval(() => {
                this.clean()
                if (this.nextSpeedBoostIn === 0) {
                    this.enemies.forEach(s => s.speed += 0.05)
                    this.nextSpeedBoostIn = this.ENEMY_SPEED_BOOST_INTERVAL
                    setTimeout(() => this.nextSpeedBoostIn = 0, this.ENEMY_SPEED_BOOST_INTERVAL)
                }
                const { posX, posY, size } = this.player
                this.isShooting && this.bullets.push(...this.generateBullets(posX + size / 2, posY - size))
                // const e = this.enemies.length < this.state.enemyLimit ? this.generateEnemies() : this.enemies
                const e = this.enemies
                const { bullets, enemies } = this.moveEls(e);
                this.draw(bullets, enemies);
                this.bullets = bullets
                this.enemies = enemies
            }, 1000 / this.props.frameRate);
            this.setState({ loopId }) // So it can stop
        }
        const prep = () => setTimeout(() => {
            const n = this.enemyGen[0].next()
            if (!n.done) {
                this.clean()
                this.enemies.push(n.value as Ship)
                this.draw(this.bullets, this.enemies)
                prep()
            } else {
                setTimeout(() => this.nextSpeedBoostIn = 0, this.ENEMY_SPEED_BOOST_INTERVAL)
                ex()
            }
        }, 100)

        prep()

    }

    /**
     * Cleans the canvas so a new frame can be rendered
     */
    clean() {
        this.ctx.clearRect(0, 0, this.props.playgroundWidth, this.props.playgroundHeight);
        this.ctx.beginPath()
        this.ctx.rect(0, 0, this.props.playgroundWidth, this.props.playgroundHeight)
        this.ctx.fillStyle = '#000';
        this.ctx.fill()
        this.ctx.closePath()
    }

    /**
     * Draws a new frame
     * @param bullets bullets on screen
     * @param enemies enemies on screen
     */
    draw(bullets: Bullet[], enemies: Ship[]) {
        this.player.drawShip(this.ctx)
        for (let e of enemies) {
            e?.drawShip(this.ctx)
        }
        for (let b of bullets) {
            b?.draw(this.ctx)
        }
    }

    moveEls(e: Array<Ship>) {
        const bullets = this.bullets.slice()
        const enemies = this.enemies.slice()
        // = this.checkBulletCollision(this.bullets, e, this.player)
        if (!enemies.length) {
            clearInterval(this.state.loopId)
            this.clean()
            this.initalizeVars()
            this.initGame()
            return { bullets: [], enemies: [] }
        }
        // Player Position
        // const newCount = state.nextShotIn > 0 ? state.nextShotIn - 1 : 0
        let nextPos = this.player.posX;
        if (this.isMovinLeft && nextPos - 1 > 0) { // dont exit playground from the left
            nextPos -= this.PLAYER_SPEED; // move 1 unit to the left
        } else if (this.isMovinRight && nextPos + 1 + this.player.size < this.props.playgroundWidth) { // dont exit playground from the right
            nextPos += this.PLAYER_SPEED; // move 1 unit to the right
        }
        this.player.posX = nextPos
        const enemiesBulletCount = bullets.filter(b => b.dir === 'down').length
        enemiesBulletCount === 0 && this.enemiesShot.splice(0)


        //#region Individual movement Example
        /* enemies.forEach((e, i) => {
            if (e.dir === 'r') {
                if (e.posX + e.size >= this.props.playgroundWidth) { // at the right end of screen
                    e.posY += e.size + this.VERTICAL_OFFSET // 10 pixel offset 
                    e.dir = 'l'
                } else {
                    e.posX += e.speed // move 1 unit
                }
            } else {
                if (e.posX <= 0) { // at the left end of screen
                    e.posY += e.size + this.VERTICAL_OFFSET // 10 pixel offset 
                    e.dir = 'r'
                } else {
                    e.posX -= e.speed // move 1 unit
                }
            }
            if (enemiesBulletCount < 5
                && this.isAbleToShoot(i, enemies)
                && !this.enemiesShot.includes(i)) {
                bullets.push(...this.generateBullets(e.posX + e.size / 2, e.posY + e.size, 'down', true))
                this.enemiesShot.push(i)
            }
        }) */
        //#endregion

        //#region swarm movement
        const moveDown = enemies.every(s => s.dir === 'r') ? enemies.some(s => s.posX + s.size >= this.props.playgroundWidth) : enemies.some(s => s.posX <= 0)
        if (moveDown) {
            enemies.forEach(s => { s.posY += s.size + this.VERTICAL_OFFSET; s.dir = s.dir === 'r' ? 'l' : 'r' })
        } else {
            enemies.forEach(s => s.posX += s.dir === 'r' ? s.speed : -s.speed)
        }
        const ship = enemies.find((s, i) => this.isAbleToShoot(i, enemies) && !this.enemiesShot.includes(i))
        const shipI = enemies.findIndex((s, i) => this.isAbleToShoot(i, enemies) && !this.enemiesShot.includes(i))
        if (ship && shipI >= 0 && this.nextEnemyShotIn === 0) {
            bullets.push(...this.generateBullets(ship.posX + ship.size / 2, ship.posY + ship.size, 'down', true))
            this.enemiesShot.push(shipI)
            this.nextEnemyShotIn = this.ENEMY_SHOT_INTERVAL
            setTimeout(() => this.nextEnemyShotIn = 0, this.ENEMY_SHOT_INTERVAL)
        }
        //#endregion

        // Move bullets - before moving bullet check if it collides and move the corresponding space to avoid
        // detecting collisions after they happened
        bullets.forEach(b => {
            const maxTravel = this.checkBulletCollision(b, enemies, this.player)
            if (b.dir === 'up') {
                b.posY -= maxTravel ?? b.vel
            } else if (b.dir === 'down') {
                b.posY += maxTravel ?? b.vel
            }
        })
        return { bullets: this.cleanBullets(bullets), enemies: this.cleanEnemies(enemies) }
    }

    /**
     * Decides whether an enemy is able or not to shoot at the player
     * @param i 
     * @param enemies 
     * @returns 
     */
    isAbleToShoot(i: number, enemies: Ship[]) {
        if (i >= enemies.length) return false
        const enemy = enemies[i]
        const intrr = enemies.filter((v, index) => index !== i).find(e => this.collX(enemy.posX, enemy.posX + enemy.size, e.posX, e.posX + e.size) && enemy.posY < e.posY + e.size)
        return !intrr && this.collX(enemy.posX, enemy.posX + enemy.size, this.player.posX - this.player.speed, this.player.posX + this.player.size + this.player.speed)
    }

    /**
     * Checks collission on the Y axis between a target and a "moving" element
     * @param y11 target element original Y coordinate
     * @param y12 target element original Y coordinate plus the element's size (height)
     * @param y21 moving element original Y coordinate
     * @param y22 moving element original Y coordinate plus the element's size (height)
     * @returns 
     */
    collY = (y11: number, y12: number, y21: number, y22: number) => (y21 >= y11 && y21 <= y12) || (y22 >= y11 && y22 <= y12)

    /**
     * Checks collission on the X axis between a target and a "moving" element
     * @param x11 target element original X coordinate
     * @param x12 target element original X coordinate plus the element's size (width)
     * @param x21 moving element original X coordinate
     * @param x22 moving element original X coordinate plus the element's size (width)
     * @returns 
     */
    collX = (x11: number, x12: number, x21: number, x22: number) => (x21 >= x11 && x21 <= x12) || (x22 >= x11 && x22 <= x12)

    checkBulletCollision(b: Bullet, enemies: Array<Ship>, player: Ship) {
        if (b.dir === 'up') { // bullets against enemies                
            const index = enemies.findIndex(e => this.collX(e.posX, e.posX + e.size, b.posX, b.posX + b.size)
                && this.collY(e.posY, e.posY + e.size, b.posY + b.vel, b.posY + b.size + b.vel,)) // check Y collision with the speed
            if (index >= 0) {
                const enemy = Object.assign({}, enemies[index]) as Ship
                enemy.health -= b.dmg
                if (enemy.health <= enemies[index].health / 2) {
                    enemy.color = '#ff3333'
                }
                if (enemy.health <= 0) {
                    this.setState({ score: this.state.score + (enemy.points ?? 0) })
                }
                enemies[index] = new Ship(enemy.color, enemy.posX, enemy.posY, enemy.size, enemy.type, enemy.health, enemy.speed, enemy.points, enemy.dir)
                b.dmg = 0
                // calculate distance that can be travelled before hitting the target
                return b.posY - enemy.posY + enemy.size
            }
        } else { // bullets agains player
            if (this.collX(player.posX, player.posX + player.size, b.posX, b.posX + b.size) && this.collY(player.posY, player.posY + player.size, b.posY, b.posY + b.size)) {
                let playerLives = this.state.playerLives
                let hasLost = !--playerLives ? true : false
                hasLost && clearInterval(this.state.loopId)
                this.setState({ playerLives, hasLost })
                b.dmg = 0
            }
        }
        return null
    }

    /**
     * Returns a new bullet to be drawn on the screen, if hte bullet is shot by the player
     * a time limitation is set to prevent bullet spaming
     * @param fatherx Where to draw the bullet on the x axis
     * @param fathery Where to draw the bullet on the y axis
     * @param dir Indicates the direction that the bullets travels (up or down)
     * @param isEnemy Indicates if the bullet is fired by an enemy
     * @returns 
     */
    generateBullets(fatherx: number, fathery: number, dir?: string, isEnemy?: boolean) {
        if (this.nextShotIn !== 0 && !isEnemy) return [];
        const size = 10
        !isEnemy && setTimeout(() => this.nextShotIn = 0, this.props.shotTimeOut);
        !isEnemy && (this.nextShotIn = this.props.shotTimeOut)
        return [new Bullet('#ff0000', dir ?? 'up', this.BULLET_SPEED, fatherx - size / 2, fathery, size, this.BULLET_DMG)]
    }

    /**
     * Clears all the bullets that are either outside of the screen or have damaged a ship
     * @param bullets 
     * @returns 
     */
    cleanBullets(bullets: Array<Bullet>) {
        // Erase bullets out of screen
        return bullets.filter(b => b.posY <= this.props.playgroundHeight && b.posY + b.size >= 0 && b.dmg > 0)
    }

    /**
     * Clears all enemy ships that are either out of the screen or have 0 health points
     * @param enemies 
     * @returns 
     */
    cleanEnemies(enemies: Array<Ship>) {
        return enemies.filter(e => e.posY + e.size <= this.props.playgroundHeight && e.health > 0)
    }

    /**
     * Uses one of the generators set to build enemies and returns a new enemy ship to be drawn
     * @returns 
     */
    generateEnemies() {
        const enemies = this.enemies.slice() // Enemy array copy
        const last_gen_enemy = enemies[enemies.length - 1]
        if ((last_gen_enemy && last_gen_enemy.posX > 0 && last_gen_enemy.posX + last_gen_enemy.size < this.props.playgroundWidth)
            || !last_gen_enemy) {

            const gen = this.enemyGen[this.generatorRunning].next() // Enemy Generator
            if (!gen.done) {
                enemies.push(gen.value as Ship)
            }
            this.generatorRunning = this.generatorRunning + 1 < this.enemyGen.length ? this.generatorRunning + 1 : 0

        }
        return enemies
    }

    /**
     * Generator that builds a series of enemy ships
     * @param size the size (WxH) of the sprites to generate
     * @param limit the amount of enemies to generate
     * @param dir the direction that the enemies will move
     * @param posY the y axis where the enemies will start moving
     */
    * buildShip(size: number, limit: number, dir: string, posY: number): Generator<Ship> {
        const enemiesPerRow = Math.floor(this.props.playgroundWidth / (size + 10)) - 1
        const spacing = Math.floor((this.props.playgroundWidth - enemiesPerRow * (size + 10)) / enemiesPerRow / 2)
        let posYNewRow = posY
        let posXNewShip = 0
        console.log(spacing)
        const xoffset = posXNewShip
        for (let i = 0, j = 0; i < limit; i++, j++) {
            if (j === enemiesPerRow) {
                posYNewRow += size + this.VERTICAL_OFFSET
                posXNewShip = xoffset as number
                j = 0
            }
            posXNewShip += 5 + spacing// left Margin
            let enemy: Ship = new Ship('#ffffff', posXNewShip, posYNewRow, size, 'enemy', this.ENEMY_HP, this.ENEMY_SPEED, 500, dir,)
            posXNewShip += size + 5 + spacing// right Margin
            yield enemy
        }
    }

    render() {
        return (
            <div style={{ position: 'relative', width: this.props.playgroundWidth, height: this.props.playgroundHeight }}>
                <canvas id="battleField" width={this.props.playgroundWidth} height={this.props.playgroundHeight}></canvas>
                <div className='GameStatus'>
                    <div>Lives: {this.state.playerLives}</div>
                    <div>Wave: {this.state.wave}</div>
                    <div>Score: {this.state.score}</div>
                </div>
                {/* <div id="debug" style={{ color: 'red', position: 'absolute', top: 0, left: 0, zIndex: 2 }}></div> */}
            </div>
        )
    }
}

export default GameBoard;
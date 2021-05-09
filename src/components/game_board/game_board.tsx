import React from 'react';
import './game_board.css';
import { Ship } from '../ship/ship';
import { Bullet } from '../bullet/bullet'
interface GameState {
    wave: number,
    enemyLimit: number,
    score: number,
    maxScore: number,
    playerLives: number
}

interface GameProps {
    shotTimeOut: number,
    frameRate: number,
    playgroundWidth: number,
    playgroundHeight: number,
    enemyGenerator?: GeneratorFunction
}

class GameBoard extends React.Component<GameProps, GameState>{

    enemyGen: Array<Generator> = [];
    isMovinRight: boolean = false;
    isMovinLeft: boolean = false;
    isShooting: boolean = false;
    generatorRunning: number = 0;
    enemiesShot: number[] = [];
    readonly BULLET_SPEED: number = 5;
    readonly BULLET_DMG: number = 25;
    readonly ENEMY_SPEED: number = 2;
    readonly PLAYER_SPEED: number = 2;
    readonly VERTICAL_OFFSET: number = 5;
    readonly LIMIT_OF_ENEMY_SHIPS_ON_SCREEN: number = 100;
    readonly PLAYER_SIZE = 32;

    player: Ship = new Ship();
    bullets: Bullet[] = [];
    enemies: Ship[] = [];
    btfld: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    nextShotIn: number;


    constructor(props: GameProps) {
        super(props);
        this.nextShotIn = 0
        this.state = {
            wave: 1,
            enemyLimit: this.LIMIT_OF_ENEMY_SHIPS_ON_SCREEN,
            maxScore: 0,
            score: 0,
            playerLives: 3
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

    initalizeVars() {
        const initialXPos = this.props.playgroundWidth / 2 - this.PLAYER_SIZE / 2; // minus half the ship width
        const initialYPos = this.props.playgroundHeight - this.PLAYER_SIZE; // minus the ship height
        this.player = new Ship('#00ff00', initialXPos, initialYPos, 32, 'player', 100, 1)
        this.bullets = Array(0);
        this.enemies = Array(0);
        this.generatorRunning = 0;
        this.isMovinLeft = false
        this.isMovinRight = false
        this.isShooting = false
        this.enemyGen.push(this.buildShip(this.PLAYER_SIZE, 4, 'r', 35), this.buildShip(this.PLAYER_SIZE, 4, 'l', this.PLAYER_SIZE + this.VERTICAL_OFFSET + 35))



    }

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

    handleTapUp(ev: TouchEvent) {
        this.isShooting = false
    }
    
    handleTapDown(ev: TouchEvent) {
        this.isShooting = true
    }

    initGame() {

        setInterval(() => {
            this.clean()
            const { posX, posY, size } = this.player
            this.isShooting && this.bullets.push(...this.generateBullets(posX + size / 2, posY - size))
            const e = this.enemies.length < this.state.enemyLimit ? this.generateEnemies() : this.enemies
            const { bullets, enemies } = this.moveEls(e);
            this.draw(bullets, enemies);
            this.bullets = bullets
            this.enemies = enemies
        }, 1000 / this.props.frameRate);
    }

    clean() {
        this.ctx.clearRect(0, 0, this.props.playgroundWidth, this.props.playgroundHeight);
        this.ctx.beginPath()
        this.ctx.rect(0, 0, this.props.playgroundWidth, this.props.playgroundHeight)
        this.ctx.fillStyle = '#000';
        this.ctx.fill()
        this.ctx.closePath()
    }

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
        const { bullets, enemies } = this.checkBulletCollision(this.bullets, e, this.player)
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
        // Move bullets


        enemies.forEach((e, i) => {
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
        })
        bullets.forEach(b => {
            if (b.dir === 'up') {
                b.posY -= b.vel
            } else if (b.dir === 'down') {
                b.posY += b.vel
            }
        })
        return { bullets, enemies }
    }

    isAbleToShoot(i: number, enemies: Ship[]) {
        if (i >= enemies.length) return false
        const enemy = enemies[i]
        const intrr = enemies.filter((v, index) => index !== i).find(e => this.collX(enemy.posX, enemy.posX + enemy.size, e.posX, e.posX + e.size))
        return !intrr && this.collX(enemy.posX, enemy.posX + enemy.size, this.player.posX, this.player.posX + this.player.size)
    }

    collY = (y11: number, y12: number, y21: number, y22: number) => (y21 >= y11 && y21 <= y12) || (y22 >= y11 && y22 <= y12)
    collX = (x11: number, x12: number, x21: number, x22: number) => (x21 >= x11 && x21 <= x12) || (x22 >= x11 && x22 <= x12)

    checkBulletCollision(bs: Array<Bullet>, es: Array<Ship>, player: Ship) {
        const bullets = this.cleanBullets(bs.slice())
        const enemies = es.slice()
        bullets.forEach(b => {
            if (b.dir === 'up') { // bullets against enemies                
                const index = enemies.findIndex(e => this.collX(e.posX, e.posX + e.size, b.posX, b.posX + b.size)
                    && this.collY(e.posY, e.posY + e.size, b.posY, b.posY + b.size,))
                if (index >= 0) {
                    const enemy = Object.assign({}, enemies[index]) as Ship
                    enemy.health -= b.dmg
                    if (enemy.health <= enemies[index].health / 2) {
                        enemy.color = '#ff3333'
                        enemy.speed += 0.2
                    }
                    if (enemy.health <= 0) {
                        this.setState({ score: this.state.score + (enemy.points ?? 0) })
                    }
                    enemies[index] = new Ship(enemy.color, enemy.posX, enemy.posY, enemy.size, enemy.type, enemy.health, enemy.speed, enemy.points, enemy.dir)
                    b.dmg = 0
                }
            } else { // bullets agains player
                if (this.collX(player.posX, player.posX + player.size, b.posX, b.posX + b.size) && this.collY(player.posY, player.posY + player.size, b.posY, b.posY + b.size)) {
                    this.setState({ playerLives: this.state.playerLives - 1 })
                    b.dmg = 0
                }
            }
        })
        return { bullets, enemies: this.cleanEnemies(enemies) }
    }

    generateBullets(fatherx: number, fathery: number, dir?: string, isEnemy?: boolean) {
        if (this.nextShotIn !== 0 && !isEnemy) return [];
        const size = 10
        !isEnemy && setTimeout(() => this.nextShotIn = 0, this.props.shotTimeOut);
        !isEnemy && (this.nextShotIn = this.props.shotTimeOut)
        return [new Bullet('#ff0000', dir ?? 'up', this.BULLET_SPEED, fatherx - size / 2, fathery, size, this.BULLET_DMG)]
    }

    cleanBullets(bullets: Array<Bullet>) {
        // Erase bullets out of screen
        return bullets.filter(b => b.posY <= this.props.playgroundHeight && b.posY + b.size >= 0 && b.dmg > 0)
    }

    cleanEnemies(enemies: Array<Ship>) {
        return enemies.filter(e => e.posY + e.size <= this.props.playgroundHeight && e.health > 0)
    }

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

    * buildShip(size: number, limit: number, dir: string, posY: number): Generator<Ship> {
        for (let i = 0; i < limit; i++) {
            let enemy: Ship = new Ship(
                '#ffffff',
                dir === 'r' ? -size : this.props.playgroundWidth,
                posY,
                size,
                'enemy',
                50,
                this.ENEMY_SPEED,
                500,
                dir,
            )
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
                <div id="debug" style={{ color: 'red', position: 'absolute', top: 0, left: 0, zIndex: 2 }}></div>
            </div>
        )
    }
}

export default GameBoard;
import React from 'react';
import './game_board.css';
import { Ship } from '../../../classes/game_objects/ship/ship';
import { Bullet } from '../../../classes/game_objects/bullet/bullet';
import { GL } from '../../../utils/logic/game_logic';
import { CM } from '../../../utils/logic/canvas_management';
import { Shield } from '../../../classes/game_objects/shield/shield';
import Transition from '../../animations/transition';
import * as game_settings from '../../../utils/configs/game_settings.json';
import { Redirect } from 'react-router';

interface GameState {
    wave: number,
    enemyLimit: number,
    score: number,
    maxScore: number,
    hit: boolean,
    playerLives: number,
    hasLost: boolean,
    loopId: any,
    shieldsDeployed: boolean
}

interface GameProps { }

class GameBoard extends React.Component<GameProps, GameState>{

    //#region attributes
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
    /**
     * Group of shields refreshed every new game
     */
    shields: Shield[] = [];
    /**
     * How tall is the screen in which the game is being played
     */
    playgroundHeight: number;
    /**
     * The width of the screen in which the game is being played
     */
    playgroundWidth: number;
    //#endregion

    constructor(props: GameProps) {
        super(props);
        this.nextShotIn = 0
        this.nextEnemyShotIn = 0
        this.nextSpeedBoostIn = game_settings['ENEMY_SPEED_BOOST_INTERVAL']
        this.state = {
            hit: false,
            wave: 1,
            enemyLimit: game_settings['LIMIT_OF_ENEMY_SHIPS_ON_SCREEN'],
            maxScore: 0,
            score: 0,
            playerLives: 3,
            hasLost: false,
            loopId: 0,
            shieldsDeployed: false
        }
        this.playgroundHeight = window.innerHeight;
        this.playgroundWidth = window.innerWidth < 420 ? window.innerWidth : 420;
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
        const initialXPos = this.playgroundWidth / 2 - game_settings['PLAYER_SIZE'] / 2; // minus half the ship width
        const initialYPos = this.playgroundHeight - game_settings['PLAYER_SIZE']; // minus the ship height
        this.player = new Ship('#00ff00', initialXPos, initialYPos, 32, 'player', 100, 1)
        this.bullets = Array(0);
        this.enemies = Array(0);
        this.enemyGen = Array(0);
        this.generatorRunning = 0;
        if (!this.state.shieldsDeployed) {
            this.shields = Array(0);
            const maxShieldWidth = Math.floor(this.playgroundWidth / 6);
            const numberOfShields = 3;
            const spacing = Math.floor((this.playgroundWidth - numberOfShields * (maxShieldWidth)) / numberOfShields / 2);
            let posx = 0;
            for (let i = 0; i < numberOfShields; i++) {
                posx += spacing;
                this.shields.push(new Shield(9, posx, Math.floor(this.playgroundHeight / 2) + maxShieldWidth + this.player.size, maxShieldWidth, maxShieldWidth))
                posx += spacing + maxShieldWidth;
            }
            this.setState({ shieldsDeployed: true })
        }
        this.isMovinLeft = false;
        this.isMovinRight = false;
        this.isShooting = false;
        this.enemyGen.push(this.buildShip(game_settings['PLAYER_SIZE'], 4 * (Math.floor(this.playgroundWidth / (game_settings['PLAYER_SIZE'] + 10)) - 1), 'r', 35));
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
    initGame() { this.prepareGameScreen(); }

    /**
     * Starts the game loop once the initial animation of appearing enemies finishes
     */
    executeGame() {
        const loopId = setInterval(() => {

            // Clears the screen so a new frame can be rendered
            CM.clean(this.ctx, this.playgroundWidth, this.playgroundHeight);

            // Increases the enemies speed once a certain amount of time has passed
            if (this.nextSpeedBoostIn === 0) {
                this.enemies.forEach(s => s.speed += 0.05);
                this.nextSpeedBoostIn = game_settings['ENEMY_SPEED_BOOST_INTERVAL'];
                setTimeout(() => this.nextSpeedBoostIn = 0, game_settings['ENEMY_SPEED_BOOST_INTERVAL']);
            }

            const { posX, posY, size } = this.player;

            // check if the player is shooting and generate new bullets
            this.isShooting && this.bullets.push(...this.generateBullets(posX + size / 2, posY - size));

            // move all the elements on screen to their new position
            const { bullets, enemies } = this.moveEls();

            // render the new frame
            CM.draw(bullets, [...enemies, this.player], this.ctx, this.shields);

            // update the bullets and enemies
            this.bullets = bullets;
            this.enemies = enemies;
        }, 1000 / game_settings['frame_rate']);
        this.setState({ loopId }); // Set the loop ID so it can be stopped once the player looses
    }

    /**
     * Plays the animation of the enemy ships appearing on the screen.
     * Once all the ships are in place the game loop starts 
     */
    prepareGameScreen() {
        setTimeout(() => {
            const n = this.enemyGen[0].next();
            if (!n.done) {
                CM.clean(this.ctx, this.playgroundWidth, this.playgroundHeight);
                this.enemies.push(n.value as Ship);
                CM.draw(this.bullets, [...this.enemies, this.player], this.ctx, this.shields);
                this.prepareGameScreen();
            } else {
                // Waits for x time to increase the enemy ships speed
                setTimeout(() => this.nextSpeedBoostIn = 0, game_settings['ENEMY_SPEED_BOOST_INTERVAL']);
                this.executeGame();
            }
        }, 100)
    }

    /**
     * Performs calculations to move game objects 
     * @returns the updated enemies and bullets
     */
    moveEls() {
        const bullets = this.bullets.slice();
        const enemies = this.enemies.slice();
        if (!enemies.length) {
            clearInterval(this.state.loopId);
            CM.clean(this.ctx, this.playgroundWidth, this.playgroundHeight);
            this.setState({ wave: this.state.wave + 1 });
            this.initalizeVars();
            this.initGame();
            return { bullets: [], enemies: [] };
        }
        // Player Position
        // const newCount = state.nextShotIn > 0 ? state.nextShotIn - 1 : 0
        let nextPos = this.player.posX;
        if (this.isMovinLeft && nextPos - 1 > 0) { // dont exit playground from the left
            nextPos -= game_settings['PLAYER_SPEED']; // move 1 unit to the left
        } else if (this.isMovinRight && nextPos + 1 + this.player.size < this.playgroundWidth) { // dont exit playground from the right
            nextPos += game_settings['PLAYER_SPEED']; // move 1 unit to the right
        }
        this.player.posX = nextPos;

        // If there are no bullets from enemies clean the enemies shot array
        bullets.filter(b => b.dir === 'down').length === 0 && this.enemiesShot.splice(0);

        //#region swarm movement

        // Move down if at least one enemy ship is at the border of the screen
        const moveDown = enemies.every(s => s.dir === 'r') ? enemies.some(s => s.posX + s.size >= this.playgroundWidth) : enemies.some(s => s.posX <= 0)
        if (moveDown) {
            // checks if there is enough space for the enemy ships to decend due to the shields
            // on the field
            const canMoveDown = enemies.every(e => this.shields.every(s => s._shieldLayout.every(r => r.every(c => e.posY + e.size < c.y0 - e.size))))
            if (canMoveDown) {
                // If it is possible moves the enemies down and changes the direction in which they move
                enemies.forEach(s => { s.posY += 5 + game_settings['VERTICAL_OFFSET']; s.dir = s.dir === 'r' ? 'l' : 'r' });
            } else {
                // If it is not possible, enemies start to aim at the shields standing on the field
                enemies.forEach((ship, i) => {
                    if (this.nextEnemyShotIn === 0 && GL.shootShields(i, enemies, this.shields) && !this.enemiesShot.includes(i)) {
                        bullets.push(...this.generateBullets(ship.posX + ship.size / 2, ship.posY + ship.size, 'down', true));
                        this.enemiesShot.push(i);
                        this.nextEnemyShotIn = game_settings['ENEMY_SHOT_INTERVAL'];
                        setTimeout(() => this.nextEnemyShotIn = 0, game_settings['ENEMY_SHOT_INTERVAL']);
                    }
                    ship.dir = ship.dir === 'r' ? 'l' : 'r';
                })
            }
        } else {
            // If not just keep moving in the same direction
            enemies.forEach(s => s.posX += s.dir === 'r' ? s.speed : -s.speed);
        }
        const shipI = enemies.findIndex((s, i) => GL.isAbleToShoot(i, enemies, this.player) && !this.enemiesShot.includes(i));
        if (shipI >= 0 && this.nextEnemyShotIn === 0) {
            const ship = enemies[shipI];
            bullets.push(...this.generateBullets(ship.posX + ship.size / 2, ship.posY + ship.size, 'down', true));
            this.enemiesShot.push(shipI);
            this.nextEnemyShotIn = game_settings['ENEMY_SHOT_INTERVAL'];
            setTimeout(() => this.nextEnemyShotIn = 0, game_settings['ENEMY_SHOT_INTERVAL']);
        }
        //#endregion

        // Move bullets - before moving bullet check if it collides and move the corresponding space to avoid
        // detecting collisions after they happened
        bullets.forEach(b => {
            const maxTravel = this.checkBulletCollision(b, enemies, this.player, this.shields);
            if (b.dir === 'up') {
                b.posY -= maxTravel ?? b.vel;
            } else if (b.dir === 'down') {
                b.posY += maxTravel ?? b.vel;
            }
        })

        let cenemiesRes = GL.cleanEnemies(enemies, this.playgroundHeight);
        if (cenemiesRes.count) this.setState({ playerLives: this.state.playerLives - 1 });
        return { bullets: GL.cleanBullets(bullets, this.playgroundHeight), enemies: cenemiesRes.enemies };
    }

    /**
     * Calculates if a bullet collides with a ship (wheter its an enemy or the player) 
     * or a shield
     * 
     * @param b bullet to check collision
     * @param enemies enemies on screen
     * @param player player 
     * @param shields list of shields on screen
     * @returns the distance that can be travelled by the bullet
     */
    checkBulletCollision(b: Bullet, enemies: Array<Ship>, player: Ship, shields: Shield[]) {
        for (let s of shields) {
            const block = s.checkCollision(b);
            if (block) {
                b.dmg = 0;
                // calculate distance that can be travelled before hitting the target
                const d = b.posY - block.y1;
                return d >= 0 ? d : 0;
            }
        }
        if (b.dir === 'up') { // bullets against enemies                
            const index = enemies.findIndex(e => GL.collX(e.posX, e.posX + e.size, b.posX, b.posX + b.size)
                && GL.collY(e.posY, e.posY + e.size, b.posY + b.vel, b.posY + b.size + b.vel,));// check Y collision with the speed
            if (index >= 0) {
                const enemy = Object.assign({}, enemies[index]) as Ship;
                enemy.health -= b.dmg;
                if (enemy.health <= enemies[index].health / 2) {
                    enemy.color = '#ff3333';
                }
                if (enemy.health <= 0) {
                    this.setState({ score: this.state.score + (enemy.points ?? 0) });
                }
                enemies[index] = new Ship(enemy.color, enemy.posX, enemy.posY, enemy.size, enemy.type, enemy.health, enemy.speed, enemy.points, enemy.dir);
                b.dmg = 0;
                // calculate distance that can be travelled before hitting the target
                const d = b.posY - enemy.posY + enemy.size;
                return d >= 0 ? d : 0;
            }
        } else { // bullets agains player
            if (GL.collX(player.posX, player.posX + player.size, b.posX, b.posX + b.size) && GL.collY(player.posY, player.posY + player.size, b.posY, b.posY + b.size)) {
                let playerLives = this.state.playerLives;
                let hasLost = !--playerLives ? true : false;
                hasLost && clearInterval(this.state.loopId);
                !hasLost && setTimeout(() => this.setState({ hit: false }), 200)
                this.setState({ playerLives, hasLost, hit: true });
                b.dmg = 0;
                const d = player.posY - b.posY;
                return d >= 0 ? d : 0;
            }
        }
        return null;
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
        !isEnemy && setTimeout(() => this.nextShotIn = 0, game_settings['shot_timeout']);
        !isEnemy && (this.nextShotIn = game_settings['shot_timeout'])
        return [new Bullet('#ff0000', dir ?? 'up', game_settings['BULLET_SPEED'], fatherx - size / 2, fathery, size, game_settings['BULLET_DMG'])]
    }

    /**
     * Generator that builds a series of enemy ships
     * @param size the size (WxH) of the sprites to generate
     * @param limit the amount of enemies to generate
     * @param dir the direction that the enemies will move
     * @param posY the y axis where the enemies will start moving
     */
    * buildShip(size: number, limit: number, dir: string, posY: number): Generator<Ship> {
        const enemiesPerRow = Math.floor(this.playgroundWidth / (size + 10)) - 1
        const spacing = Math.floor((this.playgroundWidth - enemiesPerRow * (size + 10)) / enemiesPerRow / 2)
        let posYNewRow = posY
        let posXNewShip = 0
        const xoffset = posXNewShip
        for (let i = 0, j = 0; i < limit; i++, j++) {
            if (j === enemiesPerRow) {
                posYNewRow += size + game_settings['VERTICAL_OFFSET']
                posXNewShip = xoffset as number
                j = 0
            }
            posXNewShip += 5 + spacing// left Margin
            let enemy: Ship = new Ship('#ffffff', posXNewShip, posYNewRow, size, 'enemy', game_settings['ENEMY_HP'], game_settings['ENEMY_SPEED'], 500, dir,)
            posXNewShip += size + 5 + spacing// right Margin
            yield enemy
        }
    }

    /**
     * Store the new achieved score in the local storage of the browser
     * to keep record of the high score
     */
    recordScore() {
        const hs = localStorage.getItem('highScore');
        if (!hs) {
            localStorage.setItem('highScore', this.state.score.toString());
        } else {
            let nhs = +hs < this.state.score ? this.state.score : +hs;
            localStorage.setItem('highScore', nhs.toString());
            localStorage.setItem('matchScore', this.state.score.toString());
        }
    }

    render() {
        if (this.state.hasLost) {
            this.recordScore();
            return (
                <Redirect to="/score" />
            )
        }
        return (
            <Transition>
                <div style={{ position: 'relative', width: this.playgroundWidth, height: this.playgroundHeight }} className={'gameboard ' + (this.state.hit ? 'shakingScreen' : '')}>
                    <canvas id="battleField" width={this.playgroundWidth} height={this.playgroundHeight}></canvas>
                    <div className='GameStatus'>
                        <div>Lives: {this.state.playerLives}</div>
                        <div>Wave: {this.state.wave}</div>
                        <div>Score: {this.state.score}</div>
                    </div>
                    {this.state.hit && <div className='shotAlert' style={{ width: this.playgroundWidth + 20, height: this.playgroundHeight }}></div>}
                    {/* <div id="debug" style={{ color: 'red', position: 'absolute', top: 0, left: 0, zIndex: 2 }}></div> */}
                </div>
            </Transition>
        );

    }
}

export default GameBoard;
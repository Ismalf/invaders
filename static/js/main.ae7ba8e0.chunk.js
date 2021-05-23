(this.webpackJsonpspace_invaders=this.webpackJsonpspace_invaders||[]).push([[0],{26:function(e){e.exports=JSON.parse('{"a":60,"b":500}')},38:function(e,t,i){},39:function(e,t,i){},41:function(e,t,i){},49:function(e,t,i){"use strict";i.r(t);var n=i(0),s=i.n(n),o=i(30),r=i.n(o),a=(i(38),i(39),i(2)),h=i(25),l=i.n(h),c=i(21),d=i(15),u=i(4),p=i(5),f=i(13),v=i(12),y=i(11),b=(i(41),function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,s=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0,o=arguments.length>4&&void 0!==arguments[4]?arguments[4]:"",r=arguments.length>5&&void 0!==arguments[5]?arguments[5]:0,a=arguments.length>6&&void 0!==arguments[6]?arguments[6]:0,h=arguments.length>7&&void 0!==arguments[7]?arguments[7]:0,l=arguments.length>8?arguments[8]:void 0;Object(u.a)(this,e),this.color=t,this.posX=i,this.posY=n,this.size=s,this.type=o,this.health=r,this.speed=a,this.points=h,this.dir=l}return Object(p.a)(e,[{key:"drawShip",value:function(e){switch(this.type){case"player":return this._drawPlayerShip(e);case"enemy":return this._drawEnemyShip(e);default:return e}}},{key:"_drawEnemyShip",value:function(e){var t=this.size/3,i=this.size/3,n=this.size/2,s=this.size/4;return e.beginPath(),e.rect(this.posX,this.posY,this.size,t),e.rect(this.posX+this.size/2-n/2,this.posY+t,n,i),e.rect(this.posX,this.posY+t+i,s,s),e.rect(this.posX+this.size-s,this.posY+t+i,s,s),e.fillStyle=this.color,e.fill(),e.closePath(),e}},{key:"_drawPlayerShip",value:function(e){var t=this.size/3,i=this.size/3;return e.beginPath(),e.rect(this.posX+this.size/2-this.size/8,this.posY,this.size/4,i),e.rect(this.posX,this.posY+i,this.size,t),e.fillStyle=this.color,e.fill(),e.closePath(),e}}]),e}()),g=function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"up",n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,s=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0,o=arguments.length>4&&void 0!==arguments[4]?arguments[4]:0,r=arguments.length>5&&void 0!==arguments[5]?arguments[5]:0,a=arguments.length>6&&void 0!==arguments[6]?arguments[6]:0;Object(u.a)(this,e),this.color=t,this.dir=i,this.vel=n,this.posX=s,this.posY=o,this.size=r,this.dmg=a}return Object(p.a)(e,[{key:"draw",value:function(e){e.beginPath(),e.rect(this.posX,this.posY,this.size,this.size),e.fillStyle=this.color,e.fill(),e.closePath()}}]),e}(),j=function(){function e(){Object(u.a)(this,e)}return Object(p.a)(e,null,[{key:"cleanBullets",value:function(e,t){return e.filter((function(e){return e.posY<=t&&e.posY+e.size>=0&&e.dmg>0}))}},{key:"cleanEnemies",value:function(e,t){var i=e.filter((function(e){return e.posY+e.size>t})).length;return{enemies:e.filter((function(e){return e.posY+e.size<=t&&e.health>0})),count:i}}},{key:"isAbleToShoot",value:function(t,i,n){if(t>=i.length)return!1;var s=i[t];return!i.filter((function(e,i){return i!==t})).find((function(t){return e.collX(s.posX,s.posX+s.size,t.posX,t.posX+t.size)&&s.posY<t.posY+t.size}))&&e.collX(s.posX,s.posX+s.size,n.posX-n.speed,n.posX+n.size+n.speed)}},{key:"shootShields",value:function(t,i,n){if(t>=i.length)return!1;var s=i[t];return!i.filter((function(e,i){return i!==t})).find((function(t){return e.collX(s.posX,s.posX+s.size,t.posX,t.posX+t.size)&&s.posY<t.posY+t.size}))&&n.some((function(t){return t._shieldLayout.some((function(t){return t.some((function(t){return e.collX(s.posX,s.posX+s.size,t.x0,t.x1)}))}))}))}}]),e}();j.collY=function(e,t,i,n){return i>=e&&i<=t||n>=e&&n<=t},j.collX=function(e,t,i,n){return i>=e&&i<=t||n>=e&&n<=t};var x,m,O,E,S,w,L,T,_,I,Y=function(){function e(){Object(u.a)(this,e)}return Object(p.a)(e,null,[{key:"clean",value:function(e,t,i){e.clearRect(0,0,t,i),e.beginPath(),e.rect(0,0,t,i),e.fillStyle="#000",e.fill(),e.closePath()}},{key:"draw",value:function(e,t,i,n){t.forEach((function(e){return null===e||void 0===e?void 0:e.drawShip(i)})),e.forEach((function(e){return null===e||void 0===e?void 0:e.draw(i)})),n.forEach((function(e){return e.drawShield(i)}))}}]),e}(),k=function(){function e(t,i,n,s,o){Object(u.a)(this,e),this.parts=t,this.x=i,this.y=n,this.width=s,this.height=o,this._shieldLayout=[],this.buildShieldLayout()}return Object(p.a)(e,[{key:"buildShieldLayout",value:function(){this.calculateLayout(this.parts),this.extrudeBoxes()}},{key:"calculateLayout",value:function(e){if(1!==e)if(2!==e)if(3!==e){var t=Math.sqrt(e);if(Number.isInteger(t))for(var i=0;i<t;i++)this.calculateLayout(t);else{var n,s,o=Number.parseInt("".concat(e));do{s=Math.sqrt(o),!(n=Number.isInteger(s))&&o--}while(!n);this.calculateLayout(s),this.calculateLayout(e-o)}}else{var r={x0:this.x,x1:Math.floor(this.x+this.width/3),y0:this.y,y1:0},a={x0:r.x1,x1:Math.floor(r.x1+this.width/3),y0:this.y,y1:0},h={x0:a.x1,x1:Math.floor(a.x1+this.width/3),y0:this.y,y1:0};this._shieldLayout.push([r,a,h])}else{var l={x0:this.x,x1:Math.floor(this.x+this.width/2),y0:this.y,y1:0},c={x0:l.x1,x1:Math.floor(l.x1+this.width/2),y0:this.y,y1:0};this._shieldLayout.push([l,c])}else this._shieldLayout.push([{x0:this.x,x1:this.x+this.width,y0:this.y,y1:0}])}},{key:"extrudeBoxes",value:function(){var e=this,t=Math.floor(this.height/this._shieldLayout.length);this._shieldLayout.forEach((function(i,n){var s=e._shieldLayout[n-1],o=s?s[0]:void 0;i.forEach((function(e){var i,n;e.y0=null!==(i=null===o||void 0===o?void 0:o.y1)&&void 0!==i?i:e.y0,e.y1=(null!==(n=null===o||void 0===o?void 0:o.y1)&&void 0!==n?n:e.y0)+t}))}))}},{key:"drawShield",value:function(e){this._shieldLayout.forEach((function(t){t.forEach((function(t){e.beginPath(),e.rect(t.x0,t.y0,t.x1-t.x0,t.y1-t.y0),e.fillStyle="#5f7",e.fill(),e.closePath()}))}))}},{key:"checkCollision",value:function(e){var t,i=Object(c.a)(this._shieldLayout);try{for(i.s();!(t=i.n()).done;){var n=t.value,s=n.findIndex((function(t){return j.collX(t.x0,t.x1,e.posX,e.posX+e.size)&&j.collX(t.y0,t.y1,e.posY,e.posY+e.size)}));if(s>=0){var o=n.slice()[s];return n.splice(s,1),o}}}catch(r){i.e(r)}finally{i.f()}}}]),e}(),z=i(6),M=i(7),X=i(1),R=Object(M.b)(x||(x=Object(z.a)(["\n    0% { opacity:0; transform: translateY(20px); }\n    100% { opacity:1; transform: translateY(0);}\n"]))),N=M.a.div(m||(m=Object(z.a)(["\n  animation: "," 1s;\n  height: inherit;\n  width:  inherit;\n  display: inherit;\n  flex: inherit;\n  flex-direction: inherit;\n  align-items: inherit;\n  justify-content: inherit;\n"])),R),A=function(e){var t=e.children;return Object(X.jsx)(N,{children:t})},P=i(26),B=function(e){Object(v.a)(i,e);var t=Object(y.a)(i);function i(e){var n,s;return Object(u.a)(this,i),(s=t.call(this,e)).enemyGen=[],s.isMovinRight=!1,s.isMovinLeft=!1,s.isShooting=!1,s.generatorRunning=0,s.enemiesShot=[],s.BULLET_SPEED=5,s.BULLET_DMG=100,s.ENEMY_HP=100,s.ENEMY_SPEED=.1,s.PLAYER_SPEED=2,s.VERTICAL_OFFSET=5,s.ENEMY_SHOT_INTERVAL=1e3,s.ENEMY_SPEED_BOOST_INTERVAL=1e4,s.LIMIT_OF_ENEMY_SHIPS_ON_SCREEN=100,s.PLAYER_SIZE=32,s.player=new b,s.bullets=[],s.enemies=[],s.btfld=void 0,s.ctx=void 0,s.nextShotIn=void 0,s.nextEnemyShotIn=void 0,s.nextSpeedBoostIn=void 0,s.shields=[],s.playgroundHeight=void 0,s.playgroundWidth=void 0,s.frameRate=void 0,s.shotTimeOut=void 0,s.nextShotIn=0,s.nextEnemyShotIn=0,s.nextSpeedBoostIn=s.ENEMY_SPEED_BOOST_INTERVAL,s.state={hit:!1,wave:1,enemyLimit:s.LIMIT_OF_ENEMY_SHIPS_ON_SCREEN,maxScore:0,score:0,playerLives:3,hasLost:!1,loopId:0,shieldsDeployed:!1},s.playgroundHeight=window.innerHeight,s.playgroundWidth=window.innerWidth<420?window.innerWidth:420,s.frameRate=P.a,s.shotTimeOut=P.b,s.btfld=document.getElementById("battleField"),s.ctx=null===(n=s.btfld)||void 0===n?void 0:n.getContext("2d"),s.handleKeyDown=s.handleKeyDown.bind(Object(f.a)(s)),s.handleKeyUp=s.handleKeyUp.bind(Object(f.a)(s)),s.handleAccelerometer=s.handleAccelerometer.bind(Object(f.a)(s)),s.handleTapDown=s.handleTapDown.bind(Object(f.a)(s)),s.handleTapUp=s.handleTapUp.bind(Object(f.a)(s)),s}return Object(p.a)(i,[{key:"componentDidMount",value:function(){var e;this.initalizeVars(),window.addEventListener("keydown",this.handleKeyDown),window.addEventListener("keyup",this.handleKeyUp),window.addEventListener("devicemotion",this.handleAccelerometer),window.addEventListener("touchstart",this.handleTapDown),window.addEventListener("touchend",this.handleTapUp),this.btfld=document.getElementById("battleField"),this.ctx=null===(e=this.btfld)||void 0===e?void 0:e.getContext("2d"),this.ctx.scale(1,1),this.initGame()}},{key:"initalizeVars",value:function(){var e=this.playgroundWidth/2-this.PLAYER_SIZE/2,t=this.playgroundHeight-this.PLAYER_SIZE;if(this.player=new b("#00ff00",e,t,32,"player",100,1),this.bullets=Array(0),this.enemies=Array(0),this.enemyGen=Array(0),this.generatorRunning=0,!this.state.shieldsDeployed){this.shields=Array(0);for(var i=Math.floor(this.playgroundWidth/6),n=Math.floor((this.playgroundWidth-3*i)/3/2),s=0,o=0;o<3;o++)s+=n,this.shields.push(new k(9,s,Math.floor(this.playgroundHeight/2)+i+this.player.size,i,i)),s+=n+i;this.setState({shieldsDeployed:!0})}this.isMovinLeft=!1,this.isMovinRight=!1,this.isShooting=!1,this.enemyGen.push(this.buildShip(this.PLAYER_SIZE,4*(Math.floor(this.playgroundWidth/(this.PLAYER_SIZE+10))-1),"r",35))}},{key:"handleKeyDown",value:function(e){switch(e.key){case"ArrowRight":this.isMovinLeft=!1,this.isMovinRight=!0;break;case"ArrowLeft":this.isMovinLeft=!0,this.isMovinRight=!1;break;case"ArrowUp":this.isShooting=!0}}},{key:"handleKeyUp",value:function(e){switch(e.key){case"ArrowRight":this.isMovinRight=!1;break;case"ArrowLeft":this.isMovinLeft=!1;break;case"ArrowUp":this.isShooting=!1}}},{key:"handleAccelerometer",value:function(e){var t,i,n,s,o=document.getElementById("debug");o&&(o.innerHTML="x: ".concat(null===(i=e.accelerationIncludingGravity)||void 0===i?void 0:i.x," y:").concat(null===(n=e.accelerationIncludingGravity)||void 0===n?void 0:n.y," z:").concat(null===(s=e.accelerationIncludingGravity)||void 0===s?void 0:s.z));var r=null===(t=e.accelerationIncludingGravity)||void 0===t?void 0:t.x;r&&(r>0?(this.isMovinLeft=!0,this.isMovinRight=!1):r<0&&(this.isMovinRight=!0,this.isMovinLeft=!1))}},{key:"handleTapUp",value:function(e){this.isShooting=!1}},{key:"handleTapDown",value:function(e){this.isShooting=!0}},{key:"initGame",value:function(){var e=this;!function t(){return setTimeout((function(){var i=e.enemyGen[0].next();i.done?(setTimeout((function(){return e.nextSpeedBoostIn=0}),e.ENEMY_SPEED_BOOST_INTERVAL),function(){var t=setInterval((function(){var t;Y.clean(e.ctx,e.playgroundWidth,e.playgroundHeight),0===e.nextSpeedBoostIn&&(e.enemies.forEach((function(e){return e.speed+=.05})),e.nextSpeedBoostIn=e.ENEMY_SPEED_BOOST_INTERVAL,setTimeout((function(){return e.nextSpeedBoostIn=0}),e.ENEMY_SPEED_BOOST_INTERVAL));var i=e.player,n=i.posX,s=i.posY,o=i.size;e.isShooting&&(t=e.bullets).push.apply(t,Object(d.a)(e.generateBullets(n+o/2,s-o)));var r=e.enemies,a=e.moveEls(r),h=a.bullets,l=a.enemies;Y.draw(h,[].concat(Object(d.a)(l),[e.player]),e.ctx,e.shields),e.bullets=h,e.enemies=l}),1e3/e.frameRate);e.setState({loopId:t})}()):(Y.clean(e.ctx,e.playgroundWidth,e.playgroundHeight),e.enemies.push(i.value),Y.draw(e.bullets,[].concat(Object(d.a)(e.enemies),[e.player]),e.ctx,e.shields),t())}),100)}()}},{key:"moveEls",value:function(e){var t=this,i=this.bullets.slice(),n=this.enemies.slice();if(!n.length)return clearInterval(this.state.loopId),Y.clean(this.ctx,this.playgroundWidth,this.playgroundHeight),this.setState({wave:this.state.wave+1}),this.initalizeVars(),this.initGame(),{bullets:[],enemies:[]};var s=this.player.posX;(this.isMovinLeft&&s-1>0?s-=this.PLAYER_SPEED:this.isMovinRight&&s+1+this.player.size<this.playgroundWidth&&(s+=this.PLAYER_SPEED),this.player.posX=s,0===i.filter((function(e){return"down"===e.dir})).length&&this.enemiesShot.splice(0),n.every((function(e){return"r"===e.dir}))?n.some((function(e){return e.posX+e.size>=t.playgroundWidth})):n.some((function(e){return e.posX<=0})))?n.every((function(e){return t.shields.every((function(t){return t._shieldLayout.every((function(t){return t.every((function(t){return e.posY+e.size<t.y0-e.size}))}))}))}))?n.forEach((function(e){e.posY+=5+t.VERTICAL_OFFSET,e.dir="r"===e.dir?"l":"r"})):n.forEach((function(e,s){0===t.nextEnemyShotIn&&j.shootShields(s,n,t.shields)&&!t.enemiesShot.includes(s)&&(i.push.apply(i,Object(d.a)(t.generateBullets(e.posX+e.size/2,e.posY+e.size,"down",!0))),t.enemiesShot.push(s),t.nextEnemyShotIn=t.ENEMY_SHOT_INTERVAL,setTimeout((function(){return t.nextEnemyShotIn=0}),t.ENEMY_SHOT_INTERVAL)),e.dir="r"===e.dir?"l":"r"})):n.forEach((function(e){return e.posX+="r"===e.dir?e.speed:-e.speed}));var o=n.findIndex((function(e,i){return j.isAbleToShoot(i,n,t.player)&&!t.enemiesShot.includes(i)}));if(o>=0&&0===this.nextEnemyShotIn){var r=n[o];i.push.apply(i,Object(d.a)(this.generateBullets(r.posX+r.size/2,r.posY+r.size,"down",!0))),this.enemiesShot.push(o),this.nextEnemyShotIn=this.ENEMY_SHOT_INTERVAL,setTimeout((function(){return t.nextEnemyShotIn=0}),this.ENEMY_SHOT_INTERVAL)}i.forEach((function(e){var i=t.checkBulletCollision(e,n,t.player,t.shields);"up"===e.dir?e.posY-=null!==i&&void 0!==i?i:e.vel:"down"===e.dir&&(e.posY+=null!==i&&void 0!==i?i:e.vel)}));var a=j.cleanEnemies(n,this.playgroundHeight);return a.count&&this.setState({playerLives:this.state.playerLives-1}),{bullets:j.cleanBullets(i,this.playgroundHeight),enemies:a.enemies}}},{key:"checkBulletCollision",value:function(e,t,i,n){var s,o=this,r=Object(c.a)(n);try{for(r.s();!(s=r.n()).done;){var a=s.value.checkCollision(e);if(a){e.dmg=0;var h=e.posY-a.y1;return h>=0?h:0}}}catch(g){r.e(g)}finally{r.f()}if("up"===e.dir){var l=t.findIndex((function(t){return j.collX(t.posX,t.posX+t.size,e.posX,e.posX+e.size)&&j.collY(t.posY,t.posY+t.size,e.posY+e.vel,e.posY+e.size+e.vel)}));if(l>=0){var d,u=Object.assign({},t[l]);if(u.health-=e.dmg,u.health<=t[l].health/2&&(u.color="#ff3333"),u.health<=0)this.setState({score:this.state.score+(null!==(d=u.points)&&void 0!==d?d:0)});t[l]=new b(u.color,u.posX,u.posY,u.size,u.type,u.health,u.speed,u.points,u.dir),e.dmg=0;var p=e.posY-u.posY+u.size;return p>=0?p:0}}else if(j.collX(i.posX,i.posX+i.size,e.posX,e.posX+e.size)&&j.collY(i.posY,i.posY+i.size,e.posY,e.posY+e.size)){var f=this.state.playerLives,v=!--f;setTimeout((function(){return o.setState({hit:!1})}),200),v&&clearInterval(this.state.loopId),this.setState({playerLives:f,hasLost:v,hit:!0}),e.dmg=0;var y=i.posY-e.posY;return y>=0?y:0}return null}},{key:"generateBullets",value:function(e,t,i,n){var s=this;if(0!==this.nextShotIn&&!n)return[];return!n&&setTimeout((function(){return s.nextShotIn=0}),this.shotTimeOut),!n&&(this.nextShotIn=this.shotTimeOut),[new g("#ff0000",null!==i&&void 0!==i?i:"up",this.BULLET_SPEED,e-5,t,10,this.BULLET_DMG)]}},{key:"generateEnemies",value:function(){var e=this.enemies.slice(),t=e[e.length-1];if(t&&t.posX>0&&t.posX+t.size<this.playgroundWidth||!t){var i=this.enemyGen[this.generatorRunning].next();i.done||e.push(i.value),this.generatorRunning=this.generatorRunning+1<this.enemyGen.length?this.generatorRunning+1:0}return e}},{key:"buildShip",value:l.a.mark((function e(t,i,n,s){var o,r,a,h,c,d,u,p;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:o=Math.floor(this.playgroundWidth/(t+10))-1,r=Math.floor((this.playgroundWidth-o*(t+10))/o/2),a=s,c=h=0,d=0,u=0;case 6:if(!(d<i)){e.next=16;break}return u===o&&(a+=t+this.VERTICAL_OFFSET,h=c,u=0),p=new b("#ffffff",h+=5+r,a,t,"enemy",this.ENEMY_HP,this.ENEMY_SPEED,500,n),h+=t+5+r,e.next=13,p;case 13:d++,u++,e.next=6;break;case 16:case"end":return e.stop()}}),e,this)}))},{key:"recordScore",value:function(){var e=localStorage.getItem("highScore");if(e){var t=+e<this.state.score?this.state.score:+e;localStorage.setItem("highScore",t.toString()),localStorage.setItem("matchScore",this.state.score.toString())}else localStorage.setItem("highScore",this.state.score.toString())}},{key:"render",value:function(){return this.state.hasLost?(this.recordScore(),Object(X.jsx)(a.a,{to:"/score"})):Object(X.jsx)(A,{children:Object(X.jsxs)("div",{style:{position:"relative",width:this.playgroundWidth,height:this.playgroundHeight},className:"gameboard "+(this.state.hit?"shakingScreen":""),children:[Object(X.jsx)("canvas",{id:"battleField",width:this.playgroundWidth,height:this.playgroundHeight}),Object(X.jsxs)("div",{className:"GameStatus",children:[Object(X.jsxs)("div",{children:["Lives: ",this.state.playerLives]}),Object(X.jsxs)("div",{children:["Wave: ",this.state.wave]}),Object(X.jsxs)("div",{children:["Score: ",this.state.score]})]}),this.state.hit&&Object(X.jsx)("div",{className:"shotAlert",style:{width:this.playgroundWidth+20,height:this.playgroundHeight}})]})})}}]),i}(s.a.Component),D=M.a.div(O||(O=Object(z.a)(["\n    height:100%;\n    width: 100%;\n    max-width:310px;\n    display:flex;\n    flex-direction:column;\n    align-items:center;\n    justify-content:center;\n    background-color: black;\n"]))),C=M.a.div(E||(E=Object(z.a)(["\n    display:inherit;\n    flex-direction:inherit;\n    align-items:inherit;\n    justify-content:inherit;\n    width: 100%;\n    height: 50%;\n"]))),H=M.a.div(S||(S=Object(z.a)(["\n    width: 70%;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    padding: 4px 16px 4px 16px;\n    border: 1px solid white;\n    color: white;\n    margin: 10px 0;\n    border-radius: 5px;\n    text-decoration: none;\n    font-size: 1.5rem;\n    transition: 0.25s;\n    position: relative;\n    cursor: pointer;\n    label, span{\n        transition: 0.25s;\n        cursor: pointer;\n    } \n    span{\n        margin-left: 0.1em;\n    }\n    :hover{\n        box-shadow: inset 254px 0 0 0 white;\n        color: black;\n    }\n    :hover span{\n        margin-left: 0.3em;\n        transform: rotate(15deg);\n    }\n    :active{\n        box-shadow: inset 254px 0 0 0 white;\n        color: black;\n        transform: scale(1.5);\n    }\n"]))),W=M.a.div(w||(w=Object(z.a)(["\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    width: 80%;\n    max-width: 100px;\n    cursor: pointer;\n"]))),V=M.a.div(L||(L=Object(z.a)(["\n    width:90%;\n    font-size:3em;\n    color:white;\n    text-align: center;\n    cursor: default;\n"]))),G=M.a.div(T||(T=Object(z.a)(["\n    width:90%;\n    font-size:1.5em;\n    color:white;\n    text-align: center;\n    cursor: default;\n"]))),U=M.a.div(_||(_=Object(z.a)(["\n    height: 100%;\n    width: 100%;\n    max-width: 310px;\n    display: grid;\n    grid-template-rows: 100px 70px auto 100px;\n    grid-template-columns: 100%;\n    align-items: center;\n    justify-items: center;\n"]))),F=M.a.div(I||(I=Object(z.a)(["\n    width: 100%;\n    max-height: calc(100%);\n    overflow-y: auto;\n    padding: 5px 0;\n    margin: 5px 0;\n    color: white;\n    font-size: 1.5rem;\n"]))),K=function(e){Object(v.a)(i,e);var t=Object(y.a)(i);function i(e){var n;return Object(u.a)(this,i),(n=t.call(this,e)).redirectTo=function(e){return n.setState({redirectTo:e})},n.state={redirectTo:null},n}return Object(p.a)(i,[{key:"render",value:function(){var e=this;return this.state.redirectTo?Object(X.jsx)(a.a,{push:!0,to:this.state.redirectTo}):Object(X.jsx)(A,{children:Object(X.jsxs)(U,{children:[Object(X.jsx)(V,{children:"Invaders"}),Object(X.jsx)(G,{children:"By: Ismael Mart\xednez"}),Object(X.jsxs)(C,{children:[Object(X.jsx)(G,{style:{margin:"0 auto"},children:"Controls"}),Object(X.jsxs)(F,{children:["On PC: use arrow keys (left and right) to move. Arrow Up is used to shoot.",Object(X.jsx)("br",{}),"On Mobile: tilt your phone to move. Tap to shoot."]})]}),Object(X.jsx)(H,{onClick:function(){return e.redirectTo("/menu")},children:Object(X.jsxs)(W,{children:[Object(X.jsx)("label",{children:"Back"}),Object(X.jsx)("span",{className:"material-icons",children:"chevron_left"})]})})]})})}}]),i}(s.a.Component),Z=function(e){Object(v.a)(i,e);var t=Object(y.a)(i);function i(e){var n;return Object(u.a)(this,i),(n=t.call(this,e)).redirectTo=function(e){return n.setState({redirectTo:e})},n.state={redirectTo:null},n}return Object(p.a)(i,[{key:"render",value:function(){var e=this;return this.state.redirectTo?Object(X.jsx)(a.a,{push:!0,to:this.state.redirectTo}):Object(X.jsx)(A,{children:Object(X.jsxs)(D,{children:[Object(X.jsx)(V,{children:"REACT INVADERS"}),Object(X.jsxs)(C,{children:[Object(X.jsx)(H,{onClick:function(){return e.redirectTo("/game")},children:Object(X.jsxs)(W,{children:[Object(X.jsx)("label",{children:"Play"}),Object(X.jsx)("span",{className:"material-icons",children:"videogame_asset"})]})}),Object(X.jsx)(H,{onClick:function(){return e.redirectTo("/about")},children:Object(X.jsxs)(W,{children:[Object(X.jsx)("label",{children:"About"}),Object(X.jsx)("span",{className:"material-icons",children:"info"})]})})]})]})})}}]),i}(s.a.Component),J=function(e){Object(v.a)(i,e);var t=Object(y.a)(i);function i(e){var n,s,o;return Object(u.a)(this,i),(o=t.call(this,e)).hs=void 0,o.ms=void 0,o.redirectTo=function(e){return o.setState({redirectTo:e})},o.state={redirectTo:null},o.hs=+(null!==(n=localStorage.getItem("highScore"))&&void 0!==n?n:"0"),o.ms=+(null!==(s=localStorage.getItem("matchScore"))&&void 0!==s?s:"0"),o}return Object(p.a)(i,[{key:"render",value:function(){var e=this;return this.state.redirectTo?Object(X.jsx)(a.a,{to:this.state.redirectTo}):Object(X.jsx)(A,{children:Object(X.jsxs)(D,{children:[Object(X.jsx)(V,{children:"YOU LOST"}),Object(X.jsxs)(G,{children:[this.ms===this.hs?"New High Score":"Score",": ",this.ms]}),Object(X.jsxs)(G,{children:["High Score: ",this.hs]}),Object(X.jsxs)(C,{children:[Object(X.jsx)(H,{onClick:function(){return e.redirectTo("/game")},children:Object(X.jsxs)(W,{children:[Object(X.jsx)("label",{children:"Retry"}),Object(X.jsx)("span",{className:"material-icons",children:"videogame_asset"})]})}),Object(X.jsx)(H,{onClick:function(){return e.redirectTo("/menu")},children:Object(X.jsxs)(W,{children:[Object(X.jsx)("label",{children:"Menu"}),Object(X.jsx)("span",{className:"material-icons",children:"chevron_left"})]})})]})]})})}}]),i}(s.a.Component),q=function(){return Object(X.jsxs)(a.d,{children:[Object(X.jsx)(a.b,{exact:!0,path:"/",children:Object(X.jsx)(a.a,{push:!0,to:"/menu"})}),Object(X.jsx)(a.b,{path:"/menu",component:Z}),Object(X.jsx)(a.b,{path:"/game",component:B}),Object(X.jsx)(a.b,{path:"/score",component:J}),Object(X.jsx)(a.b,{path:"/about",component:K})]})},Q=i(16);var $=function(){return Object(X.jsx)(Q.a,{children:Object(X.jsx)("div",{className:"gamescreen",children:Object(X.jsx)(q,{})})})},ee=function(e){e&&e instanceof Function&&i.e(3).then(i.bind(null,50)).then((function(t){var i=t.getCLS,n=t.getFID,s=t.getFCP,o=t.getLCP,r=t.getTTFB;i(e),n(e),s(e),o(e),r(e)}))};r.a.render(Object(X.jsx)(s.a.StrictMode,{children:Object(X.jsx)($,{})}),document.getElementById("root")),ee()}},[[49,1,2]]]);
//# sourceMappingURL=main.ae7ba8e0.chunk.js.map
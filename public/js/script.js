// compile everything you need and declare variables that will be used later
////////////////////////////////////////////////////////////////
import { levelOneArray } from "./data/collisions.js";
import { Sprite } from "./classes/sprite.js";
import { CollisionBlock } from "./classes/CollisionBlock.js";
import { Player, blockedLeft, blockedRight } from "./classes/player.js";

const canvas = document.getElementById("canvas")
const c = canvas.getContext("2d");
let currentLevel;

const collisionBlocks = []

canvas.width = 1024
canvas.height = 576

const scaledCanvas = {
  width: canvas.width /1.5,
  height: canvas.height /1.5
}
let background;
let player;
let gravity = .8
////////////////////////////////////////////////////////////////


// converts the map array into an object
////////////////////////////////////////////////////////////////
 const convertTo2D = (levelArray) => (levelArray).reduce((accumulator, val, idx) => {
  let row = Math.floor(idx / 32);
  if (!accumulator[row]) {
    accumulator[row] = [];
  }
  accumulator[row].push(val);
  return accumulator;
}, {});
////////////////////////////////////////////////////////////////


// this makes an array of all the collation blocks and includes their block type position and color code for visualizing, if you wanna see the game without the colors overlaid then comment out the fillstyle color in the collision block class
////////////////////////////////////////////////////////////////
const getCollisionBlocks = (lvl) => {
  Object.keys(lvl).forEach((key, y) => {
    lvl[key].forEach((tile, x) => {
    if (tile === 1) {
      collisionBlocks.push(
        new CollisionBlock({
          position: {
            x: x * 32,
            y: y * 32,
          },  
          color: 'rgba(0,200,0,0.5)',
          type: "solid"
        })
      )
     } 
     else
     if (tile === 2) {
       collisionBlocks.push(
         new CollisionBlock({
           position: {
             x: x * 32,
             y: y * 32,
           },
           color: 'rgba(150,100,0,0.5)',
           type: "solidTop"
         })
       )
     } else
       if (tile === 3) {
       collisionBlocks.push(
         new CollisionBlock({
           position: {
             x: x * 32,
             y: y * 32,
           },
           color: 'rgba(255,0,0,0.5)',
           type: "spikes"
         })
       )
     } else if (tile === 4) {
       collisionBlocks.push(
         new CollisionBlock({
           position: {
             x: x * 32,
             y: y * 32,
           },
           color: 'rgba(100,0,100,0.5)',
           type: "solidHalfBlock"
         })
       )
     } else if (tile === 5) {
       collisionBlocks.push(
         new CollisionBlock({
           position: {
             x: x * 32,
             y: y * 32,
           },
           color: 'rgba(0,0,245,0.5)',
           type: "ladder"
         })
       )
     } 
  })
});}
////////////////////////////////////////////////////////////////


// this allows for the input to know when a key is no longer pressed
////////////////////////////////////////////////////////////////
const keys = {
      d: {
        pressed: false,
      },
      a: {
        pressed: false,
      },
      control: {
        pressed: false,
      },
      f: {
        pressed: false,
      }
    }
////////////////////////////////////////////////////////////////


// this loops over everything that needs to be checked every frame
////////////////////////////////////////////////////////////////
let gameCamera = {
  position: {
  x: 0,
  y: -576 + scaledCanvas.height
  },
  }
    const animate = () => {

      window.requestAnimationFrame(animate)
      c.fillStyle = "white"
      c.fillRect(0, 0, canvas.width, canvas.height);
      c.save()
       c.scale(1.5, 1.5)
       c.translate(gameCamera.position.x, gameCamera.position.y)
      background.update()
      collisionBlocks.forEach(collisionBlock => {
        collisionBlock.update()
      }) 
      player.update()

player.velocity.x = 0 

if (
  keys.d.pressed && 
  keys.control.pressed 
  ){ 
    player.switchSprite('moveRight');
    player.velocity.x = 5
    player.lastDirection = 'right'
    player.panCameraRight({canvas, gameCamera})}

else if (
  keys.a.pressed && 
  keys.control.pressed 
  ) {
    player.switchSprite('moveLeft');
    player.velocity.x = -5
    player.lastDirection = 'left'
    player.panCameraLeft({canvas, gameCamera})}


else if (
  keys.d.pressed 
  ) {
    player.switchSprite('moveRight');
    player.velocity.x = 4
    player.lastDirection = 'right'
    player.panCameraRight({canvas, gameCamera})
  }

else if (keys.a.pressed) {
  player.switchSprite('moveLeft');
  player.velocity.x = -4
  player.lastDirection = 'left'
  player.panCameraLeft({canvas, gameCamera})}

  else if (keys.f.pressed) {
    if (player.lastDirection === 'right') player.switchSprite('attackRight')
    else player.switchSprite('attackLeft')
    }
  

  else if (player.velocity.y === 0) {
    if (player.lastDirection === 'right') player.switchSprite('idleRight')
    else player.switchSprite('idleLeft')
  } 
  if (player.velocity.y < 0){
    player.panCameraUp({canvas, gameCamera})
  }
  if (player.velocity.y > .8){
    player.panCameraDown({canvas, gameCamera})
  }
  c.restore()    
    }
 //////////////////////////////////////////////////////////////// 
 

 // this calls a function that starts the game
 ////////////////////////////////////////////////////////////////
window.onload = function() {
      startGame(levelOneArray)
      
  }
 //////////////////////////////////////////////////////////////// 
 

 // this compiles pretty much all of the assets as well, as starts the game loop
 ////////////////////////////////////////////////////////////////
const startGame = (lvl) => {

  currentLevel = convertTo2D(lvl)
  console.log(currentLevel)
  getCollisionBlocks(currentLevel)
  console.log(collisionBlocks.length)
  
  background = new Sprite({
    position: {
      x:0,
      y:0,
    },
    imageSrc: './img/gameMapOne.png',
  });
  
  player = new Player({
    position: {
      x: 520,
      y: 180
    },
    collisionBlocks,
    imageSrc: './img/viking/viking_idle_right.png',
    framerate: 7,
    frameBuffer: 4,
    spriteAnimations :{
  moveRight: {
    imageSrc: './img/viking/viking_walk_right.png',
    framerate: 8,
    frameBuffer: 1
  },
  moveLeft: {
    imageSrc: './img/viking/viking_walk_left.png',
    framerate: 8,
    frameBuffer: 1
  },
  attackRight: {
    imageSrc: './img/viking/viking_sword_slice_right.png',
    framerate: 5,
    frameBuffer: 3
  },
  attackLeft: {
    imageSrc: './img/viking/viking_sword_slice_left.png',
    framerate: 6,
    frameBuffer: 3
  },
  idleLeft: {
    imageSrc: './img/viking/viking_idle_left.png',
    framerate: 7,
    frameBuffer: 3
  },
  idleRight: {
    imageSrc: './img/viking/viking_idle_right.png',
    framerate: 7,
    frameBuffer: 3
  },
  jumpyViking: {
    imageSrc: './img/viking/jumpy_viking.png',
    framerate: 1,
    frameBuffer: 1
  },
  dedViking: {
    imageSrc: './img/viking/ded_viking.png',
    framerate: 1,
    frameBuffer: 1
  },
  ghostViking: {
    imageSrc: './img/viking/viking_ghost.png',
    framerate: 1,
    frameBuffer: 1
  },
  hurtRight: {
    imageSrc: './img/viking/viking_hurt_right.png',
    framerate: 2,
    frameBuffer: 2
  },
  hurtLeft: {
    imageSrc: './img/viking/hurt_viking_left.png',
    framerate: 2,
    frameBuffer: 2
  },

  },
    scale: 1.6,
    myHitbox: {
       addX: 11,
       addY: 20 ,
       width: 22,
       height: 28,
     },
  })
  console.log(player.myHitbox)
  animate(background, player)
}
 ////////////////////////////////////////////////////////////////   


// and key down event listener is for user input
 ////////////////////////////////////////////////////////////////   
    addEventListener("keydown", (event) => {
      switch (event.key) {
        case 'd':
          keys.d.pressed = true;
        break
        case 'a':
          keys.a.pressed = true;
        break
        case 'Control':
          keys.control.pressed = true;
        break
        case 'f':
          keys.f.pressed = true;
        break
        case 'w':
           if (player.velocity.y == 0 || player.velocity.y == 0.8){
          player.velocity.y = -12;
          player.switchSprite('jumpyViking');
         
           if (player.velocity.y === 0) {
            if (player.lastDirection === 'right') player.switchSprite('idleRight')
            else player.switchSprite('idleLeft')
         }
        }
        break
      }
      
  ////////////////////////////////////////////////////////////////
  

  // add key up event listeners for user input
  ////////////////////////////////////////////////////////////////
    });
    addEventListener("keyup", (event) => {
      switch (event.key) {
        case 'd':
          keys.d.pressed = false;
        break
        case 'a':
          keys.a.pressed = false;
        break
        case 'f':
          console.log("f")
          keys.f.pressed = false;
        break
        case 'Control':
          
          keys.control.pressed = false;
        break
        
      }
   
    });
   ////////////////////////////////////////////////////////////////



   ////////////////////////////////////////////////////////////////
    export {c, gravity, keys, startGame };
// compile everything you need and declare variables that will be used later
////////////////////////////////////////////////////////////////
import { levelOneArray, levelOneLongArray } from "./data/collisions.js";
import { Sprite } from "./classes/sprite.js";
import { CollisionBlock } from "./classes/CollisionBlock.js";
import { Player, onALadder} from "./classes/player.js";
import { Entity} from "./classes/Entity.js";

const canvas = document.getElementById("canvas")
const c = canvas.getContext("2d");
 const backgroundCanvas = document.getElementById("backgroundCanvas")
 const b = backgroundCanvas.getContext("2d");

let currentLevel;

const collisionBlocks = []
let entityArray = []

canvas.width = 1024
canvas.height = 576
 backgroundCanvas.width = 1024
backgroundCanvas.height = 576

const scaledCanvas = {
  width: canvas.width /1.5,
  height: canvas.height /1.5
}
let background;
let actualBackground;
let player;
let gravity = .8
 actualBackground = new Sprite({
   position: {
     x:0,
     y:0,
   },
   imageSrc: './img/map_background.png',
 });
 b.drawImage(actualBackground.image, 0, 0, backgroundCanvas.width, backgroundCanvas.height);

////////////////////////////////////////////////////////////////


// converts the map array into an object
////////////////////////////////////////////////////////////////
 const convertTo2D = (levelArray) => (levelArray).reduce((accumulator, val, idx) => {
  let row = Math.floor(idx / 60);
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
     } else if (tile === 78) {
      collisionBlocks.push(
        new CollisionBlock({
          position: {
            x: x * 32,
            y: y * 32,
          },
          color: 'rgba(0,0,245,0.5)',
          type: "mobRestrictor"
        })
      )
    } else if (tile === 77) {
      collisionBlocks.push(
        new CollisionBlock({
          position: {
            x: x * 32,
            y: y * 32,
          },
          color: 'rgba(0,0,245,0.5)',
          type: "bouncey"
        })
      )
    }else if (tile === 60) {
      entityArray.push(
        new Entity({
          position: {
            x: x * 32,
            y: y * 32,
          },
          collisionBlocks,
          type: "mushroomy",
          scale: 1.6,
          imageSrc: './img/mushroomy/mushroomy_walk.png',
          framerate: 6,
          frameBuffer: 8,
          // spriteAnimations :{
          //       moveRight: {
          //         imageSrc: './img/viking/viking_walk_right.png',
          //         framerate: 8,
          //         frameBuffer: 1
          // }},
          myHitbox: {
                addX: 11,
                addY: 20 ,
                width: 28,
                height: 28,
          },
          movement: true,
          gravity: true
  })
      )
    } else if (tile === 40) {
      entityArray.push(
        new Entity({
          position: {
            x: x * 32,
            y: y * 32,
          },
          collisionBlocks,
          type: "coin",
          scale: 1.3,
          imageSrc: './img/spinning_coin.png',
          framerate: 5,
          frameBuffer: 9,
          // spriteAnimations :{
          //       moveRight: {
          //         imageSrc: './img/viking/viking_walk_right.png',
          //         framerate: 8,
          //         frameBuffer: 1
          // }},
          myHitbox: {
                addX: 11,
                addY: 20 ,
                width: 28,
                height: 28,
          },
          movement: false,
          gravity: false
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
      },
      D: {
        pressed: false,
      },
      A: {
        pressed: false,
      },
      W: {
        pressed: false,
      },
      S: {
        pressed: false,
      },
      shift: {
        pressed: false,
      }
    }
////////////////////////////////////////////////////////////////


// this loops over everything that needs to be checked every frame
////////////////////////////////////////////////////////////////
let gameCamera = {
  position: {
  x: 0,
  y: - 576 + scaledCanvas.height
  },
  }
    const animate = () => {
     
      window.requestAnimationFrame(animate)
      c.clearRect(0, 0, canvas.width, canvas.height);

      
      c.save()
       c.scale(1.5, 1.5)
       c.translate(gameCamera.position.x, gameCamera.position.y)
      background.update()
     
      collisionBlocks.forEach(collisionBlock => {
        collisionBlock.update()
      }) 
      entityArray.forEach((element) => {
        element.update()
       
      });
      player.update()


player.velocity.x = 0  
if (
  keys.d.pressed && keys.control.pressed 
  ){ 
        player.switchSprite('moveRight');
        player.velocity.x = 5
        player.lastDirection = 'right'
        player.panCameraRight({canvas, gameCamera})
  }
else if (
      keys.D.pressed &&  keys.shift.pressed && onALadder == false || keys.d.pressed && keys.shift.pressed && onALadder == false 
      ){ 
        player.switchSprite('moveRight');
        player.velocity.x = 2
        player.lastDirection = 'right'
        player.panCameraRight({canvas, gameCamera})
        console.log('i am shifty')
      }
else if (
  keys.d.pressed && keys.shift.pressed == false
  ) {
        player.switchSprite('moveRight');
        player.velocity.x = 4
        player.lastDirection = 'right'
        player.panCameraRight({canvas, gameCamera})
  }





if (
  keys.a.pressed && keys.control.pressed 
  ) {
        player.switchSprite('moveLeft');
        player.velocity.x = -5
        player.lastDirection = 'left'
        player.panCameraLeft({canvas, gameCamera})
  } else
 if (
      keys.A.pressed && keys.shift.pressed && onALadder == false || keys.a.pressed && keys.shift.pressed && onALadder == false
      ) {
        player.switchSprite('moveLeft');
        player.velocity.x = -2        
        player.lastDirection = 'left'
        player.panCameraLeft({canvas, gameCamera})
      }
else if (keys.a.pressed && keys.shift.pressed == false) {
        player.switchSprite('moveLeft');
        player.velocity.x = -4
        player.lastDirection = 'left'
        player.panCameraLeft({canvas, gameCamera})}
  else



 if (keys.f.pressed) {
    if (player.lastDirection === 'right') player.switchSprite('attackRight')
    else player.switchSprite('attackLeft')
    }
  

if (player.velocity.y === 0) {
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
  
      startGame(levelOneLongArray)
      
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
     imageSrc: './img/long_map_test.png',
   });
    gravity = .8
   actualBackground = new Sprite({
     position: {
       x:0,
       y:0,
     },
     imageSrc: './img/map_background.png',
   });
   b.drawImage(actualBackground.image, 0, 0, backgroundCanvas.width, backgroundCanvas.height);
  player = new Player({
    position: {
      x: 5,
      y: 430
    },
    entityArray,
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
      console.log(event)
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
        case 'A':
          keys.A.pressed = true;
        break
        case 'D':
          keys.D.pressed = true;
        break
        case 'W':
          keys.W.pressed = true;
        break
        case 'S':
          keys.S.pressed = true;
        break
        case 'Shift':
          keys.shift.pressed = true;
        break
        case ' ':
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
        case 'A':
          keys.A.pressed = false;
        break
        case 'D':
          keys.D.pressed = false;
        break
        case 'W':
          keys.W.pressed = false;
        break
        case 'S':
          keys.S.pressed = false;
        break
        case 'Shift':
          keys.shift.pressed = false;
        break
        
      }
   
    });
   ////////////////////////////////////////////////////////////////


   ////////////////////////////////////////////////////////////////
    export {c, gravity, keys, startGame, background, entityArray };
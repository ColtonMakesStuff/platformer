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
  width: canvas.width /2,
  height: canvas.height /2
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
      }
    }
////////////////////////////////////////////////////////////////


// this loops over everything that needs to be checked every frame
////////////////////////////////////////////////////////////////
    const animate = () => {

      window.requestAnimationFrame(animate)
      c.fillStyle = "white"
      c.fillRect(0, 0, canvas.width, canvas.height);
      c.save()
         c.scale(2, 2)
         c.translate(0, -background.image.height + scaledCanvas.height)
      background.update()
      collisionBlocks.forEach(collisionBlock => {
        collisionBlock.update()
      }) 
      player.update()

player.velocity.x = 0 

if (
  keys.d.pressed && 
  keys.control.pressed 
  ){ player.velocity.x = 7}

else if (
  keys.a.pressed && 
  keys.control.pressed 
  ) {player.velocity.x = -7}

else if (
  keys.d.pressed 
  ) {player.velocity.x = 4}

else if (keys.a.pressed) {player.velocity.x = -4}
      
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
      x: 15,
      y: 455
    },
    collisionBlocks,
    imageSrc: './img/viking/viking_walk_right.png',
    framerate: 8,
    scale: 1.3,
    hitbox: 
       {
       addX: 10,
       addY: 10 ,
       width: 25,
       height: 30
     },
  })
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
          console.log("control")
          keys.control.pressed = true;
        break
        case 'w':
           if (player.velocity.y == 0||player.velocity.y == 0.8){
          player.velocity.y = -12;
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
        case 'Control':
          
          keys.control.pressed = false;
        break
        
      }
   
    });
   ////////////////////////////////////////////////////////////////



   ////////////////////////////////////////////////////////////////
    export {c, gravity, keys, startGame };
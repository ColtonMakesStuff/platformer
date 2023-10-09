import { c, gravity } from "../script.js";
import { collision } from "../data/collisions.js";
import { Sprite } from "./sprite.js";
let blockedLeft = false;
let blockedRight = false;

// this housees the players attributes as well as can be used for making non-player objects, also this iterates over the collision checks
class Player extends Sprite{
    constructor({position, collisionBlocks, imageSrc, framerate, frameBuffer, scale = 1.6, myHitbox, spriteAnimations }){
        super({ imageSrc,frameBuffer, framerate, scale })
        this.collisionBlocks = collisionBlocks
      this.position = position
      this.velocity = {
       x: 25,
       y: 1
      }
      this.myHitbox = myHitbox
      this.hitbox = {
        position: {
        x: this.position.x + this.myHitbox.addX,
        y: this.position.y + this.myHitbox.addY,
      },
      width:this.myHitbox.width,
      height:this.myHitbox.height
     
    }
    this.lastDirection = 'right'
    this.spriteAnimations = spriteAnimations;
     this.camera = {
        position: {
        x: this.position.x - 200,
        y: this.position.y - 100
       },
       height: 250,
       width:400
     } 
    for (let key in this.spriteAnimations ){
        const image = new Image()
            image.src = this.spriteAnimations[key].imageSrc

            this.spriteAnimations[key].image = image
        }
     }
switchSprite(key){
    if (this.image === this.spriteAnimations[key].image ){return}
    this.currentFrame= 0
    this.image = this.spriteAnimations[key].image
    this.framerate = this.spriteAnimations[key].framerate
    this.frameBuffer = this.spriteAnimations[key].frameBuffer
}
    update(){
        this.updateFrames()
        this.updateCamera()
        this.updateHitbox()

        this.draw()
               // shows camera
            // c.fillStyle = 'rgba(0, 0, 255, 0.3)'
            // c.fillRect(
            //     this.camera.position.x, 
            //     this.camera.position.y, 
            //     this.camera.width, 
            //     this.camera.height
            //     )
                //   //shows image bound box
               //c.fillStyle = 'rgba(0, 255, 0, 0.2)'
               //c.fillRect(this.position.x, this.position.y, this.width, this.height)
               //shows hitbox
               //c.fillStyle = 'rgba(255, 0, 0, 0.6)'
              //c.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height)
     
        this.position.x += this.velocity.x
        this.updateHitbox()
        this.checkForSideCollsions()
        this.applyGravity()
        this.updateHitbox()
        this.checkForVerticalCollsions()
    }
    updateHitbox(){
        this.hitbox = {
            position: {
            x: this.position.x + this.myHitbox.addX,
            y: this.position.y + this.myHitbox.addY,
          },
          width:this.myHitbox.width,
          height:this.myHitbox.height
        }
    }
    updateCamera(){
    this.camera = {
        position: {
            x: this.position.x - 180,
            y: this.position.y - 100
       },
       height: 250,
       width:400
     } 
    }
    panCameraRight({canvas, gameCamera}){
    const cameraRight = this.camera.position.x + this.camera.width
        if (cameraRight >= (canvas.width / 1.5 )+ Math.abs(gameCamera.position.x) 
    && cameraRight < canvas.width - 5){
            gameCamera.position.x -= this.velocity.x;
            }
    }
    panCameraLeft({canvas, gameCamera}){
        
        const cameraLeft = this.camera.position.x 
            if (cameraLeft <= Math.abs(gameCamera.position.x) && cameraLeft > 5) {
                gameCamera.position.x -= this.velocity.x;
                }
        }
    panCameraUp({canvas, gameCamera}){
        const cameraTop = this.camera.position.y
        
            if (cameraTop <=  Math.abs(gameCamera.position.y) && cameraTop > 5){
                gameCamera.position.y -= this.velocity.y;

                }
        }
    panCameraDown({canvas, gameCamera}){
        const cameraBottom = this.camera.position.y + this.camera.height
            if (cameraBottom >= (canvas.height / 1.5 )+ Math.abs(gameCamera.position.y) 
        && cameraBottom < canvas.height - 5){
                gameCamera.position.y -= this.velocity.y;
                }
        }   
    applyGravity() {
        this.position.y += this.velocity.y;
        this.velocity.y += gravity
    }
    // checks side the side
checkForSideCollsions(){
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i];
            if (
                collision({
                object1: this.hitbox,
                object2: collisionBlock,
            })
            ) {
//removes movement conditions from spike blocks and logs ouch                
if (collisionBlock.type == 'spikes'){
    // console.log('OUCH!!')
   } else  {               
if (collisionBlock.type == 'solidTop') {break}else if
(this.velocity.x > 0){
    this.velocity.x = 0

    const offset =
      this.hitbox.position.x - this.position.x + this.hitbox.width

    this.position.x = collisionBlock.position.x - offset - 0.01
    break
}
if (this.velocity.x < 0){
    this.velocity.x = 0

    const offset = this.hitbox.position.x - this.position.x

    this.position.x =
      collisionBlock.position.x + collisionBlock.width - offset + 0.01
    break
     }
    }
   }
  }
 }
    // check vertical collisions
checkForVerticalCollsions(){
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i];
            if (
                collision({
                object1: this.hitbox,
                object2: collisionBlock,
            })
            ) {
// currently, this is less janky solve for getting solid top block types to work
// essentialy it only has a different action if jumping up through the block, otherwise it acts the same as other blocks
 
if (collisionBlock.type == 'solidTop' && this.velocity.y < 0){
   

    const offset =
      this.hitbox.position.y - this.position.y + this.hitbox.height 

    this.position.y = collisionBlock.position.y - offset + .01
    break
} 
//removes movement conditions from spike blocks and logs ouch                
else if (collisionBlock.type == 'spikes'){
        // console.log('OUCH!!')
     
} else {   
if (this.velocity.y > 0){
    this.velocity.y = 0

    const offset =
      this.hitbox.position.y - this.position.y + this.hitbox.height

    this.position.y = collisionBlock.position.y - offset - 0.01
    break
} 
if (this.velocity.y < 0){
    this.velocity.y = 0

    const offset = this.hitbox.position.y - this.position.y

    this.position.y =
      collisionBlock.position.y + collisionBlock.height - offset + 0.01
    break
        }
       }    
      }
     }
    }  
}
export {Player, blockedLeft, blockedRight};


import { c, gravity } from "../script.js";
import { entityCollision } from "../data/collisions.js";
import { Sprite } from "./sprite.js";
let blockedLeft = false;
let blockedRight = false;

// this housees the players attributes as well as can be used for making non-player objects, also this iterates over the collision checks
class Entity extends Sprite{
    constructor({position, collisionBlocks, imageSrc, framerate, frameBuffer, scale = 1.6, myHitbox, spriteAnimations }){
        super({ imageSrc,frameBuffer, framerate, scale })
        this.collisionBlocks = collisionBlocks
      this.position = position
      this.velocity = {
       x: -1.5,
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
        this.updateHitbox()

        this.draw()
         
                //   //shows image bound box
            //    c.fillStyle = 'rgba(0, 255, 0, 0.2)'
            //    c.fillRect(this.position.x, this.position.y, this.width, this.height)
               //shows hitbox
            //    c.fillStyle = 'rgba(255, 0, 0, 0.6)'
            //   c.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height)
     
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
    applyGravity() {
        this.position.y += this.velocity.y;
        this.velocity.y += gravity
    }
    // checks side the side
checkForSideCollsions(){
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i];
            if (
                entityCollision({
                object1: this.hitbox,
                object2: collisionBlock,
            })
            ) {

            if (collisionBlock.type == 'spikes'){
                // console.log('OUCH!!')
                
            } else  {               
            if (collisionBlock.type == 'solidTop') {break} 
            else if (this.velocity.x > 0){
                this.velocity.x = -1

                const offset =
                this.hitbox.position.x - this.position.x + this.hitbox.width

                this.position.x = collisionBlock.position.x - offset - .01
                break
            }
            if (this.velocity.x < 0){
                this.velocity.x = 1

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
                entityCollision({
                object1: this.hitbox,
                object2: collisionBlock,
            })
            ) {
// currently, this is less janky solve for getting solid top block types to work
// essentialy it only has a different action if jumping up through the block, otherwise it acts the same as other blocks
 
// if (collisionBlock.type == 'solidTop' && this.velocity.y < 0){
   

//     const offset =
//       this.hitbox.position.y - this.position.y + this.hitbox.height 

//     this.position.y = collisionBlock.position.y - offset + .01
//     break
// }  else
// //removes movement conditions from spike blocks and logs ouch                
 if (collisionBlock.type == 'spikes'){
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
export {Entity, blockedLeft, blockedRight};


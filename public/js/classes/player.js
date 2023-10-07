import { c, gravity, keys } from "../script.js";
import { collision } from "../data/collisions.js";
import { Sprite } from "./sprite.js";
let blockedLeft = false;
let blockedRight = false;

// this housees the players attributes as well as can be used for making non-player objects, also this iterates over the collision checks
class Player extends Sprite{
    constructor({position, collisionBlocks, imageSrc, framerate, scale =1.6, hitbox}){
        super({ imageSrc, framerate, scale })
        this.collisionBlocks = collisionBlocks
      this.position = position
      this.velocity = {
       x: 25,
       y: 1
      }
      this.myHitbox = hitbox
      this.hitbox = {
        position: {
        x: this.position.x + this.myHitbox.addX,
        y: this.position.y + this.myHitbox.addY,
      },
      width: this.myHitbox.width,
      height: this.myHitbox.height
    }
     }

    update(){
        
        this.updateFrames()
        

        c.fillStyle = 'rgba(0, 255, 0, 0.2)'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)

        c.fillStyle = 'rgba(255, 0, 0, 0.2)'
        c.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height)



     this.draw()
     this.position.x += this.velocity.x
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
          width: this.myHitbox.width,
          height: this.myHitbox.height
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
    console.log('OUCH!!')
   } else  {               
if (this.velocity.x > 0){
    this.velocity.x = 0
    const offset = this.hitbox.position.x - this.position.x + this.hitbox.width;
    this.position.x = collisionBlock.position.x - this.width -0.01
}
if (this.velocity.x < 0){
    this.velocity.x = 0
    const offset = this.hitbox.position.x - this.position.x;
    this.position.x = collisionBlock.position.x + collisionBlock.width - this.width  + 0.01
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
    const offset = this.hitbox.position.y - this.position.y ;
    this.position.y = collisionBlock.position.y - this.height + 0.01
} 
//removes movement conditions from spike blocks and logs ouch                
else if (collisionBlock.type == 'spikes'){
        console.log('OUCH!!')
     
} else {   
if (this.velocity.y > 0){
    this.velocity.y = 0
    const offset = 
        this.hitbox.position.y - this.position.y + this.hitbox.height;
    this.position.y = collisionBlock.position.y - offset - 0.01
} 
if (this.velocity.y < 0){
    this.velocity.y = 0
    const offset = 
        this.hitbox.position.y - this.position.y ;
    this.position.y = collisionBlock.position.y + collisionBlock.height - offset + 0.01
        }
       }    
      }
     }
    }  
}
export {Player, blockedLeft, blockedRight};


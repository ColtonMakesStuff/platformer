import { c } from "../script.js";
// this is for anything that will be an image put on to the game canvas
class Sprite {
    constructor({
       position,
       imageSrc, 
       framerate = 1, 
       frameBuffer = 2, 
       scale = 1
      }){
      this.position = position
      this.scale = scale
      this.image = new Image()
       this.image.onload = () => {
         this.width = (this.image.width/this.framerate) * this.scale
         this.height = this.image.height * this.scale
       },
        this.image.src = imageSrc,
        this.framerate = framerate,
        this.currentFrame = 0,
        this.frameBuffer = frameBuffer,
        this.elapsedFrames = 0
    }
    draw() {
      if (!this.image) {return}

      const cropbox = {
        position: {
          x: this.currentFrame * (this.image.width / this.framerate),
          y: 0,
        },
        width: this.image.width / this.framerate,
        height: this.image.height,
      }

      c.drawImage(
        this.image,
         cropbox.position.x, 
         cropbox.position.y, 
         cropbox.width,
         cropbox.height,
        this.position.x, 
        this.position.y,
         this.width,
         this.height
        )
    }
    update() {
      this.draw()
      this.updateFrames()
    }
    updateFrames(){
      this.elapsedFrames++
      if (this.elapsedFrames % this.frameBuffer === 0 ) {
      if (this.currentFrame < this.framerate - 1 ){
      this.currentFrame++,
      this.elapsedFrames = 0
    } else {this.currentFrame = 0}
    }}
  }

export {Sprite };
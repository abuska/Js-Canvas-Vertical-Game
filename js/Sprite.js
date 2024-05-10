class Sprite {
  constructor({
    positionX,
    positionY,
    imageSrc,
    spriteFrameRate = 1,
    frameBuffer = 3,
    scale = 1,
  }) {
    // Set initial position by the constructor
    this.position = {
      x: positionX,
      y: positionY,
    };
    this.scale = scale;
    this.loaded = false;
    this.image = new Image();
    this.image.onload = () => {
      this.width = (this.image.width / this.spriteFrameRate) * this.scale;
      this.height = this.image.height * this.scale;
      this.loaded = true;
    };
    this.image.src = imageSrc;
    this.spriteFrameRate = spriteFrameRate;
    this.currentFrame = 0;
    this.frameBuffer = frameBuffer;
    this.elapsedFrames = 0;

    // Draw sprite
  }
  draw() {
    if (!this.image) return;

    const cropbox = {
      position: {
        x:
          this.spriteFrameRate !== 1
            ? this.currentFrame * (this.image.width / this.spriteFrameRate)
            : 0,
        y: 0,
      },
      width: this.image.width / this.spriteFrameRate,
      height: this.image.height,
    };
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
    );
  }
  update() {
    this.draw();
    this.updateFrame();
  }

  updateFrame() {
    this.elapsedFrames++;
    if (this.elapsedFrames % this.frameBuffer === 0) {
      if (this.currentFrame < this.spriteFrameRate - 1) {
        this.currentFrame++;
      } else {
        this.currentFrame = 0;
      }
    }
  }
}

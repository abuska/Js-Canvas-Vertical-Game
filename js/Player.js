class Player extends Sprite {
  constructor(
    x,
    y,
    color,
    collisionBoxes,
    platformBoxes,
    animations,
    scale = 0.5
  ) {
    super({
      imageSrc: animations.Idle.imageSrc,
      spriteFrameRate: animations.Idle.spriteFrameRate,
      scale,
    });
    // Set initial position by the constructor
    this.position = {
      x: x,
      y: y,
    };
    // Set initial velocity
    this.velocity = {
      x: 0,
      y: 1,
    };
    // Set color, width, and height
    this.color = color;
    this.width = 16;
    this.height = 16;
    this.scale = scale;
    // Collisions
    this.collisionBoxes = collisionBoxes;
    this.platformBoxes = platformBoxes;
    // Hitbox
    this.hitBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 12,
      height: 30,
    };

    this.animations = animations;
    this.lastDirection = "right";

    for (let key in this.animations) {
      const image = new Image();
      image.src = this.animations[key].imageSrc;

      this.animations[key].image = image;
    }

    this.setCameraBox();
  }

  switchSprite(key) {
    if (this.animations[key].image === this.image || !this.loaded) return;

    this.currentFrame = 0;
    this.image = this.animations[key].image;
    this.frameBuffer = this.animations[key].frameBuffer;
    this.spriteFrameRate = this.animations[key].spriteFrameRate;
  }

  updateCameraBox() {
    this.setCameraBox();
  }

  setCameraBox() {
    this.CameraBox = {
      position: {
        x: this.position.x - 50,
        y: this.position.y,
      },
      width: 200,
      height: 80,
    };
  }

  // Check if player is colliding with the canvas horizontally
  checkHorizontalCanvasCollision(canvas) {
    if (
      this.hitBox.position.x + this.hitBox.width + this.velocity.x >= 576 ||
      this.hitBox.position.x + this.velocity.x <= 0
    ) {
      this.velocity.x = 0;
    }
  }

  // Horizontal camera panning
  shouldPanCameraLeft(canvas, camera, scaledCanvasWidth) {
    const cameraBoxRightSide = this.CameraBox.position.x + this.CameraBox.width;

    if (cameraBoxRightSide >= 576) return;

    if (cameraBoxRightSide >= scaledCanvasWidth + Math.abs(camera.position.x)) {
      console.log("PAN LEFT");
      camera.position.x -= this.velocity.x;
    }
  }

  shouldPanCameraRight(canvas, camera, scaledCanvasWidth) {
    const cameraBoxLeftSide = this.CameraBox.position.x;

    if (cameraBoxLeftSide <= Math.abs(camera.position.x)) {
      console.log("PAN RIGHT");
      camera.position.x -= this.velocity.x;
    }
  }
  // Vertical camera panning
  shouldPanCameraDown(canvas, camera, scaledCanvasHeight) {
    if (this.CameraBox.position.y + this.velocity.y <= 0) return;

    const cameraBoxBottomSide =
      this.CameraBox.position.y + this.CameraBox.height;

    if (
      cameraBoxBottomSide >=
      scaledCanvasHeight + Math.abs(camera.position.y)
    ) {
      console.log("PAN DOWN");
      camera.position.y -= this.velocity.y;
    }
  }

  shouldPanCameraUp(canvas, camera, scaledCanvasHeight) {
    if (
      this.CameraBox.position.y + this.CameraBox.height >=
      Math.abs(camera.position.y)
    )
      return;

    const cameraBoxTopSide = this.CameraBox.position.y;

    if (cameraBoxTopSide <= scaledCanvasHeight + Math.abs(camera.position.y)) {
      console.log("PAN UP");
      camera.position.y -= this.velocity.y;
    }
  }

  // Update the player
  update() {
    this.updateFrame();
    this.updateHitBox();

    this.updateCameraBox();
    this.debugDrawCameraBox();

    //this.debugDrawPlayerCollisionBox();

    // Draw player
    this.draw();
    // player movement is based on velocity
    this.position.x += this.velocity.x;

    // because the player is moving, we need to update the hitBox
    // every time the player moves horizontally and vertically
    this.updateHitBox();
    this.checkHorizontalCollisions();
    this.applyGravity();
    this.updateHitBox();
    this.checkVerticalCollisions();
  }

  updateHitBox() {
    this.hitBox = {
      position: {
        x: this.position.x + this.width / 2 - 5,
        y: this.position.y + this.height / 2 - 5,
      },
      width: 12,
      height: 30,
    };
  }

  checkHorizontalCollisions() {
    // COLLISIONS WITH PLATFORMS
    this.collisionBoxes.forEach((collisionBox) => {
      if (collision({ object1: this.hitBox, object2: collisionBox })) {
        // Collision detected
        if (this.velocity.x > 0) {
          this.velocity.x = 0;

          // this is the offset between the player and the collision box
          // Right side of player - right side of collision box
          const offset =
            this.hitBox.position.x - this.position.x + this.hitBox.width;
          // Move player to the top of the collision box
          // -0.01 is to prevent player from falling through the collision box
          this.position.x = collisionBox.position.x - offset - 0.01;
        }

        if (this.velocity.x < 0) {
          this.velocity.x = 0;
          // this is the offset between the player and the collision box
          // left side of player - left side of collision box
          const offset = this.hitBox.position.x - this.position.x;
          // Move player to the bottom of the collision box
          this.position.x =
            collisionBox.position.x + collisionBox.width - offset + 0.01;
        }
      }
    });
  }

  // Apply gravity to the player
  applyGravity() {
    // if player is not on the ground, add gravity
    if (this.position.y + this.height + this.velocity.y < canvas.height) {
      this.velocity.y += GRAVITY;
      // else player is on the ground, stop gravity
    } else {
      this.velocity.y = 0;
    }

    this.position.y += this.velocity.y;
  }
  checkVerticalCollisions() {
    // COLLISION WITH GROUND
    this.collisionBoxes.forEach((collisionBox) => {
      if (collision({ object1: this.hitBox, object2: collisionBox })) {
        // Collision detected
        if (this.velocity.y > 0) {
          this.velocity.y = 0;

          // this is the offset between the player and the collision box
          const offset =
            this.hitBox.position.y - this.position.y + this.hitBox.height;
          // Move player to the top of the collision box
          // -0.01 is to prevent player from falling through the collision box
          this.position.y = collisionBox.position.y - offset - 0.01;
        }

        if (this.velocity.y < 0) {
          this.velocity.y = 0;
          // Move player to the bottom of the collision box
          this.position.y =
            collisionBox.position.y + collisionBox.height + 0.01;
        }
      }
    });

    // COLLISION WITH PLATFORMS
    this.platformBoxes.forEach((collisionBox) => {
      if (platformCollision({ object1: this.hitBox, object2: collisionBox })) {
        // Collision detected
        if (this.velocity.y > 0) {
          this.velocity.y = 0;

          // this is the offset between the player and the collision box
          const offset =
            this.hitBox.position.y - this.position.y + this.hitBox.height;
          // Move player to the top of the collision box
          // -0.01 is to prevent player from falling through the collision box
          this.position.y = collisionBox.position.y - offset - 0.01;
        }
      }
    });
  }

  // DEBUGGING PURPOSES
  debugDrawPlayerCollisionBox() {
    c.fillStyle = "rgba(0, 255, 0, 0.3)";
    c.fillRect(
      this.hitBox.position.x,
      this.hitBox.position.y,
      this.hitBox.width,
      this.hitBox.height
    );
  }
  debugDrawCameraBox() {
    /**This is for debugging purposes**/

    c.fillStyle = "rgba(0, 0, 255, 0.5)";
    c.fillRect(
      this.CameraBox.position.x,
      this.CameraBox.position.y,
      this.CameraBox.width,
      this.CameraBox.height
    );
  }
}

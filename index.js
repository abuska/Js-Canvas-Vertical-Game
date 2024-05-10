const canvas = document.getElementById("game");
const c = canvas.getContext("2d");

const updateAll = () => {
  window.requestAnimationFrame(updateAll);
};

const GRAVITY = 0.2;
const PLAYER_SPEED = 5;
const JUMP_VELOCITY = 5;

// Scale canvas
const SCALE_RATIO = 4;

// Set canvas size to window size
canvas.width = 1024;
canvas.height = 576;

const scaledCanvas = {
  width: canvas.width / SCALE_RATIO,
  height: canvas.height / SCALE_RATIO,
};

// Create floor collision boxes
const floorBoxes = [];
const floorCollisions2D = [];
for (let i = 0; i < floorCollisions.length; i += 36) {
  floorCollisions2D.push(floorCollisions.slice(i, i + 36));
}
floorCollisions2D.forEach((row, y) => {
  row.forEach((column, x) => {
    if (column === 202) {
      // Draw a collision box
      floorBoxes.push(
        new CollisionBox({
          positionX: x * 16,
          positionY: y * 16,
          width: 16,
          height: 16,
        })
      );
    }
  });
});

// Create platform collision boxes
const platformBoxes = [];
const platformCollisions2D = [];
for (let i = 0; i < platformCollisions.length; i += 36) {
  platformCollisions2D.push(platformCollisions.slice(i, i + 36));
}
platformCollisions2D.forEach((row, y) => {
  row.forEach((column, x) => {
    if (column === 202) {
      // Draw a collision box
      platformBoxes.push(
        new CollisionBox({
          positionX: x * 16,
          positionY: y * 16,
          width: 16,
          height: 4,
        })
      );
    }
  });
});

// Init game objects
const player = new Player(
  200 / SCALE_RATIO,
  200 / SCALE_RATIO,
  "red",
  floorBoxes,
  platformBoxes,
  animations
);

const background = new Sprite({
  positionX: 0,
  positionY: 0,
  imageSrc: "./Assets/background.png",
  spriteFrameRate: 1,
});

function handleInput() {
  //console.log(player);
  //HORIZONTAL MOVEMENT HANDLING
  player.velocity.x = 0;
  if (keys.moveRight.pressed === true) {
    // RUN RIGHT
    player.velocity.x = PLAYER_SPEED;
    player.lastDirection = "right";
    player.switchSprite("Run");
    player.shouldPanCameraLeft(canvas, camera, scaledCanvas.width);
  } else if (keys.moveLeft.pressed === true) {
    // RUN LEFT
    player.velocity.x = -PLAYER_SPEED;
    player.lastDirection = "left";
    player.switchSprite("RunLeft");
    player.shouldPanCameraRight(canvas, camera, scaledCanvas.width);
  } else if (player.velocity.y === 0) {
    // IDLE HANDLING
    player.lastDirection === "right"
      ? player.switchSprite("Idle")
      : player.switchSprite("IdleLeft");
  }

  // VERTICAL MOVEMENT HANDLING
  if (player.velocity.y < 0) {
    // JUMP HANDLING
    player.shouldPanCameraUp(canvas, camera, scaledCanvas.height);
    player.lastDirection === "right"
      ? player.switchSprite("Jump")
      : player.switchSprite("JumpLeft");
  } else if (player.velocity.y > 0) {
    // FALL HANDLING
    player.shouldPanCameraDown(canvas, camera, scaledCanvas.height);
    player.lastDirection === "right"
      ? player.switchSprite("Fall")
      : player.switchSprite("FallLeft");
  }
}

const camera = {
  position: {
    x: 0,
    y: player.position.y - 100,
  },
};

function animate() {
  // Call animate function recursively
  window.requestAnimationFrame(animate);

  // Set canvas background color
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);

  // Update background
  c.save();
  c.scale(SCALE_RATIO, SCALE_RATIO);
  // this line is animate the camera position
  c.translate(camera.position.x, camera.position.y);

  background.update();
  floorBoxes.forEach((collisionBox) => {
    collisionBox.update();
  });
  platformBoxes.forEach((platformBox) => {
    platformBox.update();
  });

  // Update player
  player.checkHorizontalCanvasCollision(canvas);
  player.update();
  handleInput();

  c.restore();
  // jump handling
  if (keys.jump.pressed === true) {
    player.velocity.y = -JUMP_VELOCITY;
    keys.jump.pressed = false;
  }
}

animate();

// Event listeners for key presses
window.addEventListener("keydown", (event) => {
  console.log(event.key);
  switch (event.key) {
    case keys.moveRight.key: // if key is d, move player to the right
      keys.moveRight.pressed = true;
      break;
    case keys.moveLeft.key: // if key is a, move player to the left
      keys.moveLeft.pressed = true;
      break;
    case keys.jump.key: // if key is w, move player up
      keys.jump.pressed = true;
      break;
    default:
      break;
  }
});
window.addEventListener("keyup", (event) => {
  console.log(event.key);
  switch (event.key) {
    case keys.moveRight.key: // if key is d, move player to the right
      keys.moveRight.pressed = false;
      break;
    case keys.moveLeft.key: // if key is a, move player to the left
      keys.moveLeft.pressed = false;
      break;
    default:
      break;
  }
});

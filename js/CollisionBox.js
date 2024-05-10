class CollisionBox {
  constructor({ positionX, positionY, width, height }) {
    // Set initial position by the constructor
    this.position = {
      x: positionX,
      y: positionY,
    };
    this.color = "rgba(255, 0, 0, 0.5)";
    this.width = width;
    this.height = height;

    this.draw = function () {
      c.fillStyle = this.color;
      c.fillRect(this.position.x, this.position.y, this.width, this.height);
    };
  }

  update() {
    this.draw();
  }
}

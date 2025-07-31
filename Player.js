"use strict";

class Player {
  constructor(x, y, imageSrc) {
    this.position = { x: x, y: y };
    this.velocity = { x: 0, y: 0 };
    this.gravity = 0.5;
    this.jumpForce = -6.0;
    this.maxFallSpeed = 7.0;
    this.onGround = false;

    this.image = new Image();
    if (imageSrc) {
      this.image.src = imageSrc;
    }

    this.isKeyPressed = false;
  }

  update() {
    this.velocity.y += this.gravity;

    if (this.velocity.y > this.maxFallSpeed) {
      this.velocity.y = this.maxFallSpeed;
    }

    this.position.y += this.velocity.y;

    this.constrainToCanvas();
  }

  constrainToCanvas() {
    if (this.position.y > 420) {
      this.position.y = 420;
      this.velocity.y = -2.0;
      this.onGround = true;
    }

    if (this.position.y < 0) {
      this.position.y = 0;
      this.velocity.y = 0.0;
    }
  }

  jump() {
    this.velocity.y = this.jumpForce;
    this.onGround = false;
  }

  handleInput(keyCode, isKeyDown) {
    if (keyCode === 32) {
      // Space key
      if (isKeyDown && !this.isKeyPressed) {
        this.jump();
        this.isKeyPressed = true;
      } else if (!isKeyDown) {
        this.isKeyPressed = false;
      }
    }
  }

  draw(context) {
    if (this.image.complete) {
      context.drawImage(this.image, this.position.x, this.position.y);
    }
  }

  getBounds() {
    return {
      x: this.position.x,
      y: this.position.y,
      width: this.image.width || 64,
      height: this.image.height || 64,
    };
  }

  reset(x, y) {
    this.position.x = x;
    this.position.y = y;
    this.velocity.x = 0;
    this.velocity.y = 0;
    this.isKeyPressed = false;
    this.onGround = false;
  }
}

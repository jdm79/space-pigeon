"use strict";

class CollisionManager {
  constructor() {
    this.explosionSound = new Audio();
    this.explosionSound.src = "assets/bang.mp3";
    this.explosionSound.volume = 0.2;

    this.explosionImage = new Image();
    this.explosionImage.src = "assets/fireball.png";
  }

  checkCollision(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  checkPlayerObstacleCollisions(player, obstacles) {
    const playerBounds = player.getBounds();
    const obstacleCollisions = [];
    const finishLineCollisions = [];

    for (let obstacle of obstacles) {
      const obstacleBounds = {
        x: obstacle.x,
        y: obstacle.y,
        width: obstacle.width,
        height: obstacle.height,
      };

      if (this.checkCollision(playerBounds, obstacleBounds)) {
        if (obstacle.type === "finish") {
          finishLineCollisions.push(obstacle);
        } else {
          obstacleCollisions.push(obstacle);
        }
      }
    }

    return {
      obstacleCollisions,
      finishLineCollisions,
      hasObstacleCollision: obstacleCollisions.length > 0,
      hasFinishLineCollision: finishLineCollisions.length > 0,
    };
  }

  handleObstacleCollision(collisionData) {
    if (collisionData.hasObstacleCollision) {
      if (this.explosionSound) {
        this.explosionSound.play().catch(() => {});
      }
      return true;
    }
    return false;
  }

  handleFinishLineCollision(collisionData, levelManager, playerX) {
    if (
      collisionData.hasFinishLineCollision &&
      !levelManager.isLevelComplete()
    ) {
      levelManager.completeLevel();
      return true;
    }
    return false;
  }

  drawExplosion(context, player) {
    const playerBounds = player.getBounds();
    if (this.explosionImage.complete) {
      context.drawImage(
        this.explosionImage,
        playerBounds.x - 5,
        playerBounds.y - 18,
        this.explosionImage.width,
        this.explosionImage.height
      );
    }
  }

  checkBounds(object, bounds) {
    return {
      x: Math.max(bounds.minX, Math.min(object.x, bounds.maxX)),
      y: Math.max(bounds.minY, Math.min(object.y, bounds.maxY)),
      width: object.width,
      height: object.height,
    };
  }

  getDistance(point1, point2) {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  isPointInRect(point, rect) {
    return (
      point.x >= rect.x &&
      point.x <= rect.x + rect.width &&
      point.y >= rect.y &&
      point.y <= rect.y + rect.height
    );
  }

  getCollisionSide(rect1, rect2) {
    const centerX1 = rect1.x + rect1.width / 2;
    const centerY1 = rect1.y + rect1.height / 2;
    const centerX2 = rect2.x + rect2.width / 2;
    const centerY2 = rect2.y + rect2.height / 2;

    const dx = centerX1 - centerX2;
    const dy = centerY1 - centerY2;

    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? "right" : "left";
    } else {
      return dy > 0 ? "bottom" : "top";
    }
  }

  resolveCollision(player, obstacle, side) {
    const playerBounds = player.getBounds();

    switch (side) {
      case "top":
        player.position.y = obstacle.y - playerBounds.height;
        player.velocity.y = 0;
        break;
      case "bottom":
        player.position.y = obstacle.y + obstacle.height;
        player.velocity.y = 0;
        break;
      case "left":
        player.position.x = obstacle.x - playerBounds.width;
        break;
      case "right":
        player.position.x = obstacle.x + obstacle.width;
        break;
    }
  }
}

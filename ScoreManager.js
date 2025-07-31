"use strict";

class ScoreManager {
  constructor() {
    this.currentScore = 0;
    this.highScore = this.getHighScore();
    this.lastScore = this.getLastScore();
  }

  addPoints(points) {
    this.currentScore += points;
  }

  getCurrentScore() {
    return this.currentScore;
  }

  getHighScore() {
    const stored = localStorage.getItem("spacePigeon_highScore");
    return stored ? parseInt(stored) : 0;
  }

  getLastScore() {
    const stored = localStorage.getItem("spacePigeon_lastScore");
    return stored ? parseInt(stored) : 0;
  }

  saveScore() {
    // Save current score as last score
    localStorage.setItem("spacePigeon_lastScore", this.currentScore.toString());

    // Update high score if current score is higher
    if (this.currentScore > this.highScore) {
      this.highScore = this.currentScore;
      localStorage.setItem("spacePigeon_highScore", this.highScore.toString());
      return true; // New high score!
    }

    return false;
  }

  resetCurrentScore() {
    this.currentScore = 0;
  }

  drawScore(context, canvasWidth, canvasHeight) {
    context.font = "16px Arial";
    context.fillStyle = "white";

    // Current score - top left
    context.fillText(`Current score: ${this.currentScore}`, 10, 70);

    // High score - top left, below current score
    context.fillText(`High score: ${this.highScore}`, 10, 90);

    // Last score - top left, below high score
    if (this.lastScore > 0) {
      context.fillText(`Previous score: ${this.lastScore}`, 10, 110);
    }
  }

  drawGameOverScore(context, isNewHighScore, previousHighScore) {
    const centerX = 400; // Same center point as main game over screen
    context.font = "18px Arial";
    context.fillStyle = "white";
    // Note: textAlign is already set to "center" by the calling function

    if (this.currentScore === 0) {
      // Special message for 0 score
      context.fillStyle = "#FF6B6B"; // Red color for bad score
      context.fillText("Ouch, you are bad.", centerX, 290);
      context.fillStyle = "white";
      context.fillText(`Your Score: ${this.currentScore}`, centerX, 315);
      context.fillText(`High Score: ${this.highScore}`, centerX, 340);
    } else if (isNewHighScore) {
      context.fillStyle = "#FFD700"; // Gold for new high score
      context.fillText("NEW HIGHEST SCORE!", centerX, 290);
      context.fillStyle = "white";
      context.fillText(`Your Score: ${this.currentScore}`, centerX, 315);
      context.fillText(`Previous High: ${previousHighScore}`, centerX, 340);
    } else {
      context.fillText(`Your Score: ${this.currentScore}`, centerX, 290);
      context.fillText(`High Score: ${this.highScore}`, centerX, 315);
      const difference = this.highScore - this.currentScore + 1;
      context.fillText(
        `You need ${difference} more to beat highest score`,
        centerX,
        340
      );
    }

    // Don't reset textAlign here - let the calling function handle it
  }
}

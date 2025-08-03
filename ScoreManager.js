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
    context.font = "18px VT323, monospace";

    // Prepare score lines
    const lines = [
      { text: `Current score: ${this.currentScore}`, color: "#00FF00" },
      { text: `High score: ${this.highScore}`, color: "#FFFF00" }
    ];
    
    // Add previous score if exists
    if (this.lastScore > 0) {
      lines.push({ text: `Previous score: ${this.lastScore}`, color: "#FF8800" });
    }

    // Calculate box dimensions
    const padding = 10;
    const lineHeight = 20;
    const maxWidth = Math.max(...lines.map(line => context.measureText(line.text).width));
    const boxWidth = maxWidth + padding * 2;
    const boxHeight = lines.length * lineHeight + padding * 2;
    
    // Position at top-right with 2px margins
    const boxX = canvasWidth - boxWidth - 2; // 2px margin from right edge
    const boxY = 2; // 2px margin from top
    
    // Draw black background
    context.fillStyle = "#000000";
    context.fillRect(boxX, boxY, boxWidth, boxHeight);
    
    // Draw retro green border (matching level info style)
    context.strokeStyle = "#00FF00"; // Bright green
    context.lineWidth = 2;
    context.strokeRect(boxX, boxY, boxWidth, boxHeight);
    
    // Draw inner border for extra retro effect
    context.strokeStyle = "#00AA00"; // Darker green
    context.lineWidth = 1;
    context.strokeRect(boxX + 2, boxY + 2, boxWidth - 4, boxHeight - 4);
    
    // Draw score lines
    lines.forEach((line, index) => {
      context.fillStyle = line.color;
      const textY = boxY + padding + (index + 1) * lineHeight - 3; // -3 for better vertical alignment
      context.fillText(line.text, boxX + padding, textY);
    });
  }

  drawGameOverScore(context, isNewHighScore, previousHighScore) {
    const centerX = 400; // Same center point as main game over screen
    context.font = "20px VT323, monospace";
    // Note: textAlign is already set to "center" by the calling function

    if (this.currentScore === 0) {
      // Special message for 0 score - bright red
      context.fillStyle = "#FF0000";
      context.fillText("Ouch, you are bad.", centerX, 290);
      context.fillStyle = "#00FF00"; // Green for score
      context.fillText(`Your Score: ${this.currentScore}`, centerX, 315);
      context.fillStyle = "#FFFF00"; // Yellow for high score
      context.fillText(`High Score: ${this.highScore}`, centerX, 340);
    } else if (isNewHighScore) {
      context.fillStyle = "#FFFF00"; // Bright yellow for new high score
      context.fillText("NEW HIGHEST SCORE!", centerX, 290);
      context.fillStyle = "#00FF00"; // Green for your score
      context.fillText(`Your Score: ${this.currentScore}`, centerX, 315);
      context.fillStyle = "#FF8800"; // Orange for previous high
      context.fillText(`Previous High: ${previousHighScore}`, centerX, 340);
    } else {
      context.fillStyle = "#00FF00"; // Green for your score
      context.fillText(`Your Score: ${this.currentScore}`, centerX, 290);
      context.fillStyle = "#FFFF00"; // Yellow for high score
      context.fillText(`High Score: ${this.highScore}`, centerX, 315);
      context.fillStyle = "#FF8800"; // Orange for encouragement
      const difference = this.highScore - this.currentScore + 1;
      context.fillText(
        `You needed ${difference} more to beat highest score`,
        centerX,
        340
      );
    }

    // Don't reset textAlign here - let the calling function handle it
  }
}

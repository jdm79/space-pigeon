"use strict";

class LevelManager {
  constructor() {
    this.currentLevel = 1;
    this.levelComplete = false;
    this.finishSound = new Audio();
    this.finishSound.src = "assets/cheering.mp3";
    this.finishSound.volume = 0.8;

    // Infinite level system - levels are generated dynamically
    this.baseLevels = {
      1: { obstacleCount: 12, baseSpeed: 4.0, baseDistance: 6000 },
      2: { obstacleCount: 19, baseSpeed: 4.2, baseDistance: 6100 },
      3: { obstacleCount: 20, baseSpeed: 4.4, baseDistance: 6200 },
    };
  }

  getCurrentLevel() {
    return this.generateLevel(this.currentLevel);
  }

  generateLevel(levelNumber) {
    // Progressive difficulty formula:
    // Speed: 4.0 + (level - 1) * 0.2
    // Distance: 6000 + (level - 1) * 100
    // Obstacles: 12 + (level - 1) * 1

    const scrollSpeed = 4.0 + (levelNumber - 1) * 0.2;
    const finishLineX = 6000 + (levelNumber - 1) * 100;
    const obstacleCount = 12 + (levelNumber - 1);

    // Generate obstacle positions dynamically
    const obstacles = [];
    const spacing = (finishLineX - 1000) / obstacleCount; // Distribute evenly

    for (let i = 0; i < obstacleCount; i++) {
      obstacles.push({ x: 1000 + i * spacing });
    }

    return {
      name: `Level ${levelNumber}: ${this.getLevelName(levelNumber)}`,
      scrollSpeed: Math.round(scrollSpeed * 10) / 10, // Round to 1 decimal
      obstacleSpacing: Math.max(250, 400 - levelNumber * 5), // Decrease spacing slightly
      gapSize: { min: 135, max: 160 }, // Fixed gap range as requested
      finishLineX: finishLineX,
      obstacles: obstacles,
    };
  }

  getLevelName(levelNumber) {
    const names = [
      "Learning to Fly",
      "Space Gauntlet",
      "Pigeon Nightmare",
      "Stellar Challenge",
      "Asteroid Field",
      "Cosmic Storm",
      "Nebula Run",
      "Black Hole Escape",
      "Meteor Shower",
      "Solar Flare",
      "Galactic Drift",
      "Quantum Leap",
      "Interstellar Voyage",
      "Celestial Odyssey",
      "Void Runner",

      "Nebula Quest",
      "Stellar Nexus",
      "Asteroid Rush",
      "Galactic Conquest",
      "Pigeon Power",
      "Murderous Space",
      "Cosmic Clash",
    ];

    if (levelNumber <= names.length) {
      return names[levelNumber - 1];
    }

    // For levels beyond predefined names
    const themes = [
      "Inferno",
      "Chaos",
      "Vortex",
      "Maelstrom",
      "Apocalypse",
      "Oblivion",
    ];
    const themeIndex = (levelNumber - names.length - 1) % themes.length;
    const tier =
      Math.floor((levelNumber - names.length - 1) / themes.length) + 1;
    return `${themes[themeIndex]} ${tier}`;
  }

  getCurrentLevelNumber() {
    return this.currentLevel;
  }

  getTotalLevels() {
    return "∞"; // Infinite levels
  }

  isLastLevel() {
    return false; // Never the last level in infinite mode
  }

  completeLevel() {
    this.levelComplete = true;
    if (this.finishSound) {
      this.finishSound.play().catch(() => {});
    }
  }

  nextLevel() {
    if (!this.isLastLevel()) {
      this.currentLevel++;
      this.levelComplete = false;
      return true;
    }
    return false;
  }

  resetToFirstLevel() {
    this.currentLevel = 1;
    this.levelComplete = false;
  }

  isLevelComplete() {
    return this.levelComplete;
  }

  checkFinishLine(playerX, finishLineX) {
    const tolerance = 50;
    return playerX >= finishLineX - tolerance && !this.levelComplete;
  }

  getLevelProgress(distanceTraveled) {
    const level = this.getCurrentLevel();
    // Progress should hit 100% when pigeon's right edge (x=50 + width) reaches finish line's left edge (finishLineX)
    // So the pigeon needs to travel: finishLineX - 50 - pigeonWidth
    const pigeonWidth = 64; // Default pigeon width from Player.js
    const totalDistance = level.finishLineX - 50 - pigeonWidth;
    const progress = Math.min(distanceTraveled / totalDistance, 0.99);
    return Math.round(progress * 100);
  }

  drawLevelInfo(context, canvasWidth) {
    const level = this.getCurrentLevel();

    context.font = "18px VT323, monospace";
    context.fillStyle = "#FF8800"; // Bright orange
    context.fillText(`${level.name}`, 10, 25);
  }

  drawProgressBar(context, distanceTraveled, canvasWidth, canvasHeight) {
    // Show 100% only when level is actually complete, otherwise use calculated progress
    const progress = this.isLevelComplete()
      ? 100
      : this.getLevelProgress(distanceTraveled);
    const barWidth = 150;
    const barHeight = 12;
    const x = canvasWidth - barWidth - 80; // Move further left to show percentage
    const y = 20;

    // Background
    context.fillStyle = "rgba(0, 0, 0, 0.7)";
    context.fillRect(x, y, barWidth, barHeight);

    // Progress fill
    context.fillStyle = "#00FF00";
    context.fillRect(x, y, (barWidth * progress) / 100, barHeight);

    // Border
    context.strokeStyle = "white";
    context.lineWidth = 1;
    context.strokeRect(x, y, barWidth, barHeight);

    // Percentage text - bright green
    context.font = "14px VT323, monospace";
    context.fillStyle = "#00FF00";
    context.fillText(`${progress}%`, x + barWidth + 5, y + 9);
  }

  drawLevelComplete(context, canvasWidth, canvasHeight) {
    if (!this.levelComplete) return;

    context.fillStyle = "rgba(0, 0, 0, 0.8)";
    context.fillRect(0, 0, canvasWidth, canvasHeight);

    context.font = "50px VT323, monospace";
    context.fillStyle = "#FFFF00"; // Bright yellow
    context.textAlign = "center";
    context.fillText("LEVEL COMPLETE!", canvasWidth / 2, canvasHeight / 2 - 60);

    context.font = "26px VT323, monospace";

    if (this.isLastLevel()) {
      context.fillStyle = "#FF0000"; // Bright red for congratulations
      context.fillText(
        "🎉 CONGRATULATIONS! 🎉",
        canvasWidth / 2,
        canvasHeight / 2 - 20
      );
      context.fillStyle = "#00FF00"; // Green for completion
      context.fillText(
        "You completed all levels!",
        canvasWidth / 2,
        canvasHeight / 2 + 10
      );
      //   context.fillText(
      //     " to play again",
      //     canvasWidth / 2,
      //     canvasHeight / 2 + 40
      //   );
    } else {
      context.fillStyle = "#FF8800"; // Orange for next level
      context.fillText(
        `Get ready for Level ${this.currentLevel + 1}!`,
        canvasWidth / 2,
        canvasHeight / 2 - 20
      );
      context.fillStyle = "#00FF00"; // Green for instructions
      context.fillText(
        "Press SPACE to continue",
        canvasWidth / 2,
        canvasHeight / 2 + 20
      );
    }

    context.textAlign = "left";
  }

  handleLevelCompleteInput(keyCode) {
    if (keyCode === 32 && this.levelComplete) {
      // Space key
      // Stop the cheering music when proceeding to next level
      this.finishSound.pause();
      this.finishSound.currentTime = 0; // Reset to beginning for next time

      if (this.isLastLevel()) {
        this.resetToFirstLevel();
        return { action: "restart" };
      } else {
        this.nextLevel();
        return { action: "nextLevel", level: this.getCurrentLevel() };
      }
    }
    return null;
  }
}

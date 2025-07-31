"use strict";

class LevelManager {
    constructor() {
        this.currentLevel = 1;
        this.levelComplete = false;
        this.finishSound = new Audio();
        this.finishSound.src = "assets/cheering.mp3";
        this.finishSound.volume = 0.8;
        
        this.levels = {
            1: {
                name: "Level 1: Learning to Fly",
                scrollSpeed: 4,
                obstacleSpacing: 400,
                gapSize: { min: 140, max: 160 },
                finishLineX: 6000,
                obstacles: [
                    { x: 1000 }, { x: 1400 }, { x: 1800 }, { x: 2200 }, 
                    { x: 2600 }, { x: 3000 }, { x: 3450 }, { x: 3900 }, 
                    { x: 4300 }, { x: 4700 }, { x: 5100 }, { x: 5500 }
                ]
            },
            2: {
                name: "Level 2: Space Gauntlet",
                scrollSpeed: 5,
                obstacleSpacing: 350,
                gapSize: { min: 130, max: 150 },
                finishLineX: 7000,
                obstacles: [
                    { x: 1000 }, { x: 1300 }, { x: 1600 }, { x: 1900 }, 
                    { x: 2200 }, { x: 2500 }, { x: 2800 }, { x: 3100 }, 
                    { x: 3400 }, { x: 3700 }, { x: 4000 }, { x: 4300 },
                    { x: 4600 }, { x: 4900 }, { x: 5200 }, { x: 5500 },
                    { x: 5800 }, { x: 6100 }, { x: 6400 }
                ]
            },
            3: {
                name: "Level 3: Pigeon Nightmare",
                scrollSpeed: 6,
                obstacleSpacing: 300,
                gapSize: { min: 120, max: 140 },
                finishLineX: 8000,
                obstacles: [
                    { x: 1000 }, { x: 1250 }, { x: 1500 }, { x: 1750 }, 
                    { x: 2000 }, { x: 2250 }, { x: 2500 }, { x: 2750 }, 
                    { x: 3000 }, { x: 3250 }, { x: 3500 }, { x: 3750 },
                    { x: 4000 }, { x: 4250 }, { x: 4500 }, { x: 4750 },
                    { x: 5000 }, { x: 5250 }, { x: 5500 }, { x: 5750 },
                    { x: 6000 }, { x: 6250 }, { x: 6500 }, { x: 6750 },
                    { x: 7000 }, { x: 7250 }, { x: 7500 }
                ]
            }
        };
    }
    
    getCurrentLevel() {
        return this.levels[this.currentLevel];
    }
    
    getCurrentLevelNumber() {
        return this.currentLevel;
    }
    
    getTotalLevels() {
        return Object.keys(this.levels).length;
    }
    
    isLastLevel() {
        return this.currentLevel >= this.getTotalLevels();
    }
    
    completeLevel() {
        this.levelComplete = true;
        this.finishSound.play();
        console.log(`Level ${this.currentLevel} completed!`);
    }
    
    nextLevel() {
        if (!this.isLastLevel()) {
            this.currentLevel++;
            this.levelComplete = false;
            console.log(`Starting Level ${this.currentLevel}`);
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
    
    getLevelProgress(playerX) {
        const level = this.getCurrentLevel();
        const totalDistance = level.finishLineX;
        const progress = Math.min(playerX / totalDistance, 1);
        return Math.round(progress * 100);
    }
    
    drawLevelInfo(context, canvasWidth) {
        const level = this.getCurrentLevel();
        
        context.font = "16px Arial";
        context.fillStyle = "white";
        context.fillText(`${level.name}`, 10, 25);
        context.fillText(`Level ${this.currentLevel}/${this.getTotalLevels()}`, 10, 45);
    }
    
    drawProgressBar(context, playerX, canvasWidth, canvasHeight) {
        const progress = this.getLevelProgress(playerX);
        const barWidth = 200;
        const barHeight = 10;
        const x = canvasWidth - barWidth - 20;
        const y = 20;
        
        context.fillStyle = "rgba(0, 0, 0, 0.5)";
        context.fillRect(x, y, barWidth, barHeight);
        
        context.fillStyle = "#00FF00";
        context.fillRect(x, y, (barWidth * progress) / 100, barHeight);
        
        context.strokeStyle = "white";
        context.strokeRect(x, y, barWidth, barHeight);
        
        context.font = "12px Arial";
        context.fillStyle = "white";
        context.fillText(`${progress}%`, x + barWidth + 10, y + 8);
    }
    
    drawLevelComplete(context, canvasWidth, canvasHeight) {
        if (!this.levelComplete) return;
        
        context.fillStyle = "rgba(0, 0, 0, 0.8)";
        context.fillRect(0, 0, canvasWidth, canvasHeight);
        
        context.font = "48px Arial";
        context.fillStyle = "#FFD700";
        context.textAlign = "center";
        context.fillText("LEVEL COMPLETE!", canvasWidth / 2, canvasHeight / 2 - 60);
        
        context.font = "24px Arial";
        context.fillStyle = "white";
        
        if (this.isLastLevel()) {
            context.fillText("🎉 CONGRATULATIONS! 🎉", canvasWidth / 2, canvasHeight / 2 - 20);
            context.fillText("You completed all levels!", canvasWidth / 2, canvasHeight / 2 + 10);
            context.fillText("Press SPACE to play again", canvasWidth / 2, canvasHeight / 2 + 40);
        } else {
            context.fillText(`Get ready for Level ${this.currentLevel + 1}!`, canvasWidth / 2, canvasHeight / 2 - 20);
            context.fillText("Press SPACE to continue", canvasWidth / 2, canvasHeight / 2 + 20);
        }
        
        context.textAlign = "left";
    }
    
    handleLevelCompleteInput(keyCode) {
        if (keyCode === 32 && this.levelComplete) { // Space key
            if (this.isLastLevel()) {
                this.resetToFirstLevel();
                return { action: 'restart' };
            } else {
                this.nextLevel();
                return { action: 'nextLevel', level: this.getCurrentLevel() };
            }
        }
        return null;
    }
}
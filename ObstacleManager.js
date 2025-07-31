"use strict";

class ObstacleManager {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.obstacles = [];
        this.scrollSpeed = 5;
        this.obstacleWidth = 100;
        this.minGapSize = 130;
        this.maxGapSize = 160;
        this.obstacleSpacing = 400;
        this.nextObstacleX = 1000;
        
        this.colors = [
            "#E0D873", "#E0DFDB", "#FBDB0C", "#BCC6CC", "#BFBFBF", 
            "#BFEFFF", "#7b9095", "#05B8CC", "#5EDA9E", "#6C7B8B",
            "#00F5FF", "#7D7F94", "#BE2625", "#BDFCC9", "#C0D9D9",
            "#C76E06", "#CDCDC1", "#D9D919", "#787878", "#7A67EE"
        ];
    }
    
    createObstacle(x) {
        const gapSize = this.minGapSize + Math.random() * (this.maxGapSize - this.minGapSize);
        const gapY = 50 + Math.random() * (this.canvasHeight - gapSize - 100);
        
        // Randomize colors for each obstacle pair
        const topColor = this.colors[Math.floor(Math.random() * this.colors.length)];
        const bottomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
        
        const topObstacle = {
            id: `obstacle_top_${Date.now()}_${Math.random()}`,
            x: x,
            y: 0,
            width: this.obstacleWidth,
            height: gapY,
            color: topColor,
            type: 'obstacle'
        };
        
        const bottomObstacle = {
            id: `obstacle_bottom_${Date.now()}_${Math.random()}`,
            x: x,
            y: gapY + gapSize,
            width: this.obstacleWidth,
            height: this.canvasHeight - (gapY + gapSize),
            color: bottomColor,
            type: 'obstacle'
        };
        
        this.obstacles.push(topObstacle, bottomObstacle);
    }
    
    createFinishLine(x) {
        const finishLine = {
            id: `finish_line_${Date.now()}`,
            x: x,
            y: 0,
            width: 100,
            height: this.canvasHeight,
            color: "white",
            type: 'finish',
            pattern: 'checkered'
        };
        
        this.obstacles.push(finishLine);
    }
    
    update() {
        for (let obstacle of this.obstacles) {
            obstacle.x -= this.scrollSpeed;
        }
        
        this.obstacles = this.obstacles.filter(obstacle => obstacle.x + obstacle.width > -100);
        
        if (this.obstacles.length === 0 || 
            this.obstacles[this.obstacles.length - 1].x < this.nextObstacleX - this.obstacleSpacing) {
            this.createObstacle(this.nextObstacleX);
            this.nextObstacleX += this.obstacleSpacing;
        }
    }
    
    draw(context) {
        for (let obstacle of this.obstacles) {
            if (obstacle.type === 'finish' && obstacle.pattern === 'checkered') {
                this.drawCheckeredPattern(context, obstacle);
            } else {
                context.fillStyle = obstacle.color;
                context.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            }
        }
    }
    
    drawCheckeredPattern(context, obstacle) {
        const squareSize = 20;
        const cols = Math.ceil(obstacle.width / squareSize);
        const rows = Math.ceil(obstacle.height / squareSize);
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const isWhite = (row + col) % 2 === 0;
                context.fillStyle = isWhite ? "white" : "black";
                
                const x = obstacle.x + col * squareSize;
                const y = obstacle.y + row * squareSize;
                const width = Math.min(squareSize, obstacle.x + obstacle.width - x);
                const height = Math.min(squareSize, obstacle.y + obstacle.height - y);
                
                if (width > 0 && height > 0) {
                    context.fillRect(x, y, width, height);
                }
            }
        }
    }
    
    getObstacles() {
        return this.obstacles;
    }
    
    getObstaclesByType(type) {
        return this.obstacles.filter(obstacle => obstacle.type === type);
    }
    
    reset() {
        this.obstacles = [];
        this.nextObstacleX = 1000;
    }
    
    generateLevel(levelData) {
        this.reset();
        
        if (levelData.obstacles) {
            for (let obstacleData of levelData.obstacles) {
                this.createObstacle(obstacleData.x);
            }
        }
        
        if (levelData.finishLineX) {
            this.createFinishLine(levelData.finishLineX);
        }
        
        if (levelData.scrollSpeed) {
            this.scrollSpeed = levelData.scrollSpeed;
        }
        
        if (levelData.obstacleSpacing) {
            this.obstacleSpacing = levelData.obstacleSpacing;
        }
        
        if (levelData.gapSize) {
            this.minGapSize = levelData.gapSize.min;
            this.maxGapSize = levelData.gapSize.max;
        }
    }
}
"use strict";

class SpacePigeonGame {
    constructor() {
        this.canvas = undefined;
        this.canvasContext = undefined;
        this.gameState = 'playing'; // 'playing', 'gameOver', 'levelComplete'
        
        // Game components
        this.player = null;
        this.obstacleManager = null;
        this.levelManager = null;
        this.collisionManager = null;
        
        // Background
        this.backgroundSprite = undefined;
        this.backgroundSpritePosition = { x: 0, y: 0 };
        
        // Audio
        this.backgroundMusic = undefined;
        this.sadMusic = undefined;
        
        // UI Elements
        this.gameOverPanel = new Image();
        this.restartButton = new Image();
        this.panelPos = { x: 220, y: 230 };
        this.buttonPos = { x: 350, y: 340 };
        
        // Input
        this.keyboard = { keyDown: -1 };
        this.keys = {
            A: 65, B: 66, C: 67, D: 68, E: 69, F: 70, G: 71, H: 72,
            I: 73, J: 74, K: 75, L: 76, M: 77, N: 78, O: 79, P: 80,
            Q: 81, R: 82, S: 83, T: 84, U: 85, V: 86, W: 87, X: 88,
            Y: 89, Z: 90, LA: 37, UA: 38, RA: 39, DA: 40, SP: 32
        };
    }
    
    init() {
        this.canvas = document.getElementById('myCanvas');
        this.canvasContext = this.canvas.getContext('2d');
        
        // Initialize game components
        this.player = new Player(50, 240, "assets/pigeon.png");
        this.obstacleManager = new ObstacleManager(this.canvas.width, this.canvas.height);
        this.levelManager = new LevelManager();
        this.collisionManager = new CollisionManager();
        
        // Load background
        this.backgroundSprite = new Image();
        this.backgroundSprite.src = "assets/stars.png";
        
        // Load UI elements
        this.gameOverPanel.src = "assets/panel_big1.png";
        this.restartButton.src = "assets/b_to_play.png";
        
        // Setup audio
        this.setupAudio();
        
        // Setup input handlers
        this.setupInput();
        
        // Initialize first level
        this.startLevel();
        
        // Start game loop
        this.mainLoop();
    }
    
    setupAudio() {
        this.backgroundMusic = new Audio();
        this.backgroundMusic.src = "assets/killa.mp3";
        this.backgroundMusic.volume = 0.4;
        this.backgroundMusic.loop = true;
        this.backgroundMusic.play();
        
        this.sadMusic = new Audio();
        this.sadMusic.src = "assets/sad.mp3";
        this.sadMusic.volume = 0.6;
    }
    
    setupInput() {
        document.onkeydown = (evt) => {
            this.keyboard.keyDown = evt.keyCode;
            this.handleKeyDown(evt.keyCode);
        };
        
        document.onkeyup = (evt) => {
            this.handleKeyUp(evt.keyCode);
        };
        
        document.onmousedown = (evt) => {
            this.handleMouseClick(evt);
        };
    }
    
    handleKeyDown(keyCode) {
        if (this.gameState === 'playing') {
            this.player.handleInput(keyCode, true);
        } else if (this.gameState === 'levelComplete') {
            const result = this.levelManager.handleLevelCompleteInput(keyCode);
            if (result) {
                if (result.action === 'restart') {
                    this.restartGame();
                } else if (result.action === 'nextLevel') {
                    this.startLevel();
                }
            }
        }
        
        this.handleVolumeControl(keyCode);
    }
    
    handleKeyUp(keyCode) {
        if (keyCode === this.keys.SP) {
            this.player.handleInput(keyCode, false);
        } else if (keyCode === this.keys.B && this.gameState === 'gameOver') {
            this.restartGame();
        }
        
        this.keyboard.keyDown = -1;
    }
    
    handleMouseClick(evt) {
        if (this.gameState === 'gameOver') {
            const rect = this.canvas.getBoundingClientRect();
            const x = evt.clientX - rect.left;
            const y = evt.clientY - rect.top;
            
            if (x >= this.buttonPos.x && x <= this.buttonPos.x + this.restartButton.width &&
                y >= this.buttonPos.y && y <= this.buttonPos.y + this.restartButton.height) {
                this.restartGame();
            }
        }
    }
    
    handleVolumeControl(keyCode) {
        switch (keyCode) {
            case this.keys.P:
                this.backgroundMusic.pause();
                break;
            case this.keys.S:
                this.backgroundMusic.play();
                break;
            case this.keys.Q:
                if (this.backgroundMusic.volume <= 0.9) {
                    this.backgroundMusic.volume += 0.01;
                }
                break;
            case this.keys.A:
                if (this.backgroundMusic.volume >= 0.01) {
                    this.backgroundMusic.volume -= 0.01;
                }
                break;
        }
    }
    
    startLevel() {
        this.gameState = 'playing';
        const levelData = this.levelManager.getCurrentLevel();
        this.obstacleManager.generateLevel(levelData);
        this.player.reset(50, 240);
        this.backgroundMusic.volume = 0.4;
        this.backgroundMusic.play();
    }
    
    restartGame() {
        this.levelManager.resetToFirstLevel();
        this.gameState = 'playing';
        this.startLevel();
    }

    
    mainLoop() {
        this.clearCanvas();
        this.update();
        this.draw();
        window.setTimeout(() => this.mainLoop(), 1000 / 40);
    }
    
    clearCanvas() {
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    drawImage(sprite, position) {
        this.canvasContext.save();
        this.canvasContext.translate(position.x, position.y);
        this.canvasContext.drawImage(sprite, 0, 0, sprite.width, sprite.height,
            0, 0, sprite.width, sprite.height);
        this.canvasContext.restore();
    }

    
    update() {
        if (this.gameState === 'playing') {
            // Update player
            this.player.update();
            
            // Update obstacles
            this.obstacleManager.update();
            
            // Check collisions
            const obstacles = this.obstacleManager.getObstacles();
            const collisionData = this.collisionManager.checkPlayerObstacleCollisions(this.player, obstacles);
            
            // Handle obstacle collisions (game over)
            if (this.collisionManager.handleObstacleCollision(collisionData)) {
                this.gameState = 'gameOver';
                this.backgroundMusic.volume = 0.0;
                this.sadMusic.play();
                return;
            }
            
            // Handle finish line collisions (level complete)
            if (this.collisionManager.handleFinishLineCollision(collisionData, this.levelManager, this.player.position.x)) {
                this.gameState = 'levelComplete';
                this.backgroundMusic.volume = 0.2;
            }
            
            // Update background
            this.updateBackground();
        }
    }

    
    updateBackground() {
        this.backgroundSpritePosition.x--;
        if (this.backgroundSpritePosition.x <= -800) {
            this.backgroundSpritePosition.x = 0;
        }
    }


    
    draw() {
        // Draw background
        this.drawImage(this.backgroundSprite, this.backgroundSpritePosition);
        
        // Draw obstacles
        this.obstacleManager.draw(this.canvasContext);
        
        // Draw player (unless collision)
        if (this.gameState !== 'gameOver') {
            this.player.draw(this.canvasContext);
        }
        
        // Draw UI
        this.levelManager.drawLevelInfo(this.canvasContext, this.canvas.width);
        this.levelManager.drawProgressBar(this.canvasContext, this.player.position.x, this.canvas.width, this.canvas.height);
        
        // Draw game state specific UI
        if (this.gameState === 'gameOver') {
            this.drawGameOver();
        } else if (this.gameState === 'levelComplete') {
            this.levelManager.drawLevelComplete(this.canvasContext, this.canvas.width, this.canvas.height);
        }
        
        // Draw explosion if collision
        if (this.gameState === 'gameOver') {
            this.collisionManager.drawExplosion(this.canvasContext, this.player);
        }
    }
    
    drawGameOver() {
        this.canvasContext.drawImage(this.gameOverPanel, this.panelPos.x, this.panelPos.y);
        
        this.canvasContext.font = "20px 'Orator Std'";
        this.canvasContext.fillStyle = "white";
        this.canvasContext.fillText("Pigeon Dead", 350, 280);
        this.canvasContext.fillText("Game Over", 360, 320);
        this.canvasContext.fillText("Press B to Play Again", 300, 360);
        
        this.canvasContext.drawImage(this.restartButton, this.buttonPos.x, this.buttonPos.y);
    }
}

// Global game instance
let gameInstance = null;

// Legacy start function for compatibility with StartScreen.js
const Game = {
    start: function() {
        if (gameInstance) {
            gameInstance = null;
        }
        gameInstance = new SpacePigeonGame();
        gameInstance.init();
    }
};

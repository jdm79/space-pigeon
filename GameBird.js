"use strict";

class SpacePigeonGame {
  constructor() {
    this.canvas = undefined;
    this.canvasContext = undefined;
    this.gameState = "playing"; // 'playing', 'gameOver', 'levelComplete'
    
    // Cache canvas dimensions to ensure consistency
    this.canvasWidth = 800;
    this.canvasHeight = 480;

    // Game components
    this.player = null;
    this.obstacleManager = null;
    this.levelManager = null;
    this.collisionManager = null;

    // Track progress
    this.distanceTraveled = 0;

    // Scoring system
    this.score = 0;
    this.passedObstacles = new Set(); // Track which obstacles we've passed
    this.scoreManager = new ScoreManager();

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
      A: 65,
      B: 66,
      C: 67,
      D: 68,
      E: 69,
      F: 70,
      G: 71,
      H: 72,
      I: 73,
      J: 74,
      K: 75,
      L: 76,
      M: 77,
      N: 78,
      O: 79,
      P: 80,
      Q: 81,
      R: 82,
      S: 83,
      T: 84,
      U: 85,
      V: 86,
      W: 87,
      X: 88,
      Y: 89,
      Z: 90,
      LA: 37,
      UA: 38,
      RA: 39,
      DA: 40,
      SP: 32,
    };
  }

  init() {
    this.canvas = document.getElementById("myCanvas");
    this.canvasContext = this.canvas.getContext("2d");
    
    // Ensure canvas dimensions are properly set
    this.canvasWidth = this.canvas.width;
    this.canvasHeight = this.canvas.height;

    // Initialize game components
    this.player = new Player(50, 240, "assets/pigeon.png");
    this.obstacleManager = new ObstacleManager(
      this.canvasWidth,
      this.canvasHeight
    );
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

  initWithLoadedAssets(loadingManager) {
    console.log("initWithLoadedAssets called with:", !!loadingManager);
    this.canvas = document.getElementById("myCanvas");
    console.log("Canvas found:", !!this.canvas);
    this.canvasContext = this.canvas.getContext("2d");
    console.log("Canvas context:", !!this.canvasContext);
    
    // Ensure canvas dimensions are properly set
    this.canvasWidth = this.canvas.width;
    this.canvasHeight = this.canvas.height;

    // Use preloaded assets
    this.backgroundSprite = loadingManager.getLoadedImage("gameBackground");
    this.gameOverPanel = loadingManager.getLoadedImage("gameOverPanel");
    this.restartButton = loadingManager.getLoadedImage("playAgainButton");

    // Initialize game components with preloaded assets
    this.player = new Player(50, 240, null); // We'll set the image directly
    this.player.image = loadingManager.getLoadedImage("playerPigeon");

    this.obstacleManager = new ObstacleManager(
      this.canvasWidth,
      this.canvasHeight
    );
    this.levelManager = new LevelManager();
    const cheeringAudio = loadingManager.getLoadedAudio("cheering");
    if (cheeringAudio) {
      this.levelManager.finishSound = cheeringAudio;
    }

    this.collisionManager = new CollisionManager();
    const explosionAudio = loadingManager.getLoadedAudio("explosion");
    const fireballImage = loadingManager.getLoadedImage("fireball");
    if (explosionAudio) {
      this.collisionManager.explosionSound = explosionAudio;
    }
    if (fireballImage) {
      this.collisionManager.explosionImage = fireballImage;
    }

    // Setup audio with preloaded sounds
    this.setupAudioWithLoadedAssets(loadingManager);

    // Setup input handlers
    this.setupInput();

    // Initialize first level
    this.startLevel();

    // Start game loop
    this.mainLoop();
  }

  setupAudioWithLoadedAssets(loadingManager) {
    this.backgroundMusic = loadingManager.getLoadedAudio("gameMusic");
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = 0.4;
      this.backgroundMusic.loop = true;
      this.backgroundMusic.play().catch(() => {});
    }

    this.sadMusic = new Audio("assets/sad.mp3");
    this.sadMusic.volume = 0.6;
  }

  setupAudio() {
    this.backgroundMusic = new Audio();
    this.backgroundMusic.src = "assets/killa.mp3";
    this.backgroundMusic.volume = 0.4;
    this.backgroundMusic.loop = true;
    this.backgroundMusic.play().catch(() => {});

    this.sadMusic = new Audio();
    this.sadMusic.src = "assets/pain.mp3";
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
    if (this.gameState === "playing") {
      this.player.handleInput(keyCode, true);
    } else if (this.gameState === "levelComplete") {
      const result = this.levelManager.handleLevelCompleteInput(keyCode);
      if (result) {
        if (result.action === "restart") {
          this.restartGame();
        } else if (result.action === "nextLevel") {
          this.startLevel();
        }
      }
    } else if (this.gameState === "gameOver" && keyCode === this.keys.M) {
      this.returnToMainMenu();
    }

    this.handleVolumeControl(keyCode);
  }

  handleKeyUp(keyCode) {
    if (keyCode === this.keys.SP) {
      this.player.handleInput(keyCode, false);
    } else if (keyCode === this.keys.M && this.gameState === "gameOver") {
      this.returnToMainMenu();
    }

    this.keyboard.keyDown = -1;
  }

  handleMouseClick(evt) {
    if (this.gameState === "gameOver") {
      const rect = this.canvas.getBoundingClientRect();
      const x = evt.clientX - rect.left;
      const y = evt.clientY - rect.top;

      if (
        x >= this.currentButtonPos.x &&
        x <= this.currentButtonPos.x + this.restartButton.width &&
        y >= this.currentButtonPos.y &&
        y <= this.currentButtonPos.y + this.restartButton.height
      ) {
        this.returnToMainMenu();
      }
    }
  }

  handleVolumeControl(keyCode) {
    switch (keyCode) {
      case this.keys.P:
        this.backgroundMusic.pause();
        break;
      case this.keys.S:
        if (this.backgroundMusic) {
          this.backgroundMusic.play().catch(() => {});
        }
        break;
    }
  }

  startLevel() {
    this.gameState = "playing";
    const levelData = this.levelManager.getCurrentLevel();
    this.obstacleManager.generateLevel(levelData);
    this.player.reset(50, 240);
    this.distanceTraveled = 0; // Reset progress for new level

    // Reset score only for level 1 (new game)
    if (this.levelManager.getCurrentLevelNumber() === 1) {
      this.scoreManager.resetCurrentScore();
      this.passedObstacles.clear();
    }

    // Make sure start screen music is completely stopped
    if (ST.startSound) {
      ST.startSound.pause();
      ST.startSound.currentTime = 0;
      ST.startSound = null; // Clear reference to prevent any issues
    }
    
    // Restart background music for new level
    if (this.backgroundMusic) {
      this.backgroundMusic.currentTime = 0; // Reset to beginning
      this.backgroundMusic.volume = 0.4;
      this.backgroundMusic.play().catch(() => {});
    }
  }

  restartGame() {
    this.levelManager.resetToFirstLevel();
    this.gameState = "playing";
    this.startLevel();
  }

  returnToMainMenu() {
    // Clean up game touch controls
    this.cleanupTouchControls();
    
    // Stop all game sounds immediately
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
    }
    if (this.sadMusic) {
      this.sadMusic.pause();
      this.sadMusic.currentTime = 0;
    }

    // Reset game state
    this.levelManager.resetToFirstLevel();

    // Simple page reload to return to start screen
    location.reload();
  }

  mainLoop() {
    this.clearCanvas();
    this.update();
    this.draw();
    window.setTimeout(() => this.mainLoop(), 1000 / 40);
  }

  clearCanvas() {
    this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  drawImage(sprite, position) {
    this.canvasContext.save();
    this.canvasContext.translate(position.x, position.y);
    this.canvasContext.drawImage(
      sprite,
      0,
      0,
      sprite.width,
      sprite.height,
      0,
      0,
      sprite.width,
      sprite.height
    );
    this.canvasContext.restore();
  }

  updateScore(obstacles) {
    const playerRightEdge = this.player.position.x + 64; // Player width

    for (let obstacle of obstacles) {
      if (obstacle.type === "obstacle" && obstacle.id.includes("_top_")) {
        // Only count top obstacles to avoid double counting pairs
        const obstacleLeftEdge = obstacle.x;
        const obstacleId = obstacle.id.split("_top_")[1]; // Get unique part of ID

        // Check if pigeon's right edge has passed obstacle's left edge
        if (
          playerRightEdge > obstacleLeftEdge &&
          !this.passedObstacles.has(obstacleId)
        ) {
          this.passedObstacles.add(obstacleId);
          this.scoreManager.addPoints(1); // 1 point per gap passed
        }
      }
    }
  }

  update() {
    if (this.gameState === "playing") {
      // Update distance traveled (simulate forward movement)
      this.distanceTraveled += this.obstacleManager.scrollSpeed; // Match actual scroll speed

      // Update player
      this.player.update();

      // Update obstacles
      this.obstacleManager.update();

      // Check collisions
      const obstacles = this.obstacleManager.getObstacles();
      const collisionData = this.collisionManager.checkPlayerObstacleCollisions(
        this.player,
        obstacles
      );

      // Update score based on passed obstacles
      this.updateScore(obstacles);

      // Handle obstacle collisions (game over)
      if (this.collisionManager.handleObstacleCollision(collisionData)) {
        this.gameState = "gameOver";
        
        // Stop ALL music
        this.backgroundMusic.pause();
        if (ST.startSound) {
          ST.startSound.pause();
        }
        
        if (this.sadMusic) {
          this.sadMusic.play().catch(() => {});
        }
        // Save score when game ends
        this.previousHighScore = this.scoreManager.getHighScore();
        this.isNewHighScore = this.scoreManager.saveScore();
        return;
      }

      // Handle finish line collisions (level complete)
      if (
        this.collisionManager.handleFinishLineCollision(
          collisionData,
          this.levelManager,
          this.distanceTraveled
        )
      ) {
        this.gameState = "levelComplete";
        // Stop background music immediately when hitting finish line
        this.backgroundMusic.pause();
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
    if (this.gameState !== "gameOver") {
      this.player.draw(this.canvasContext);
    }

    // Draw UI elements on all levels
    this.levelManager.drawLevelInfo(this.canvasContext, this.canvasWidth);
    this.levelManager.drawProgressBar(
      this.canvasContext,
      this.distanceTraveled,
      this.canvasWidth,
      this.canvasHeight
    );
    this.scoreManager.drawScore(
      this.canvasContext,
      this.canvasWidth,
      this.canvasHeight
    );

    // Draw game state specific UI
    if (this.gameState === "gameOver") {
      this.drawGameOver();
    } else if (this.gameState === "levelComplete") {
      this.levelManager.drawLevelComplete(
        this.canvasContext,
        this.canvasWidth,
        this.canvasHeight
      );
    }

    // Draw explosion if collision
    if (this.gameState === "gameOver") {
      this.collisionManager.drawExplosion(this.canvasContext, this.player);
    }
  }

  drawGameOver() {
    // Draw the panel background
    this.canvasContext.drawImage(this.gameOverPanel, 220, 200);

    // Set consistent centering for all text
    const centerX = 400; // Center of the panel
    this.canvasContext.textAlign = "center";

    // Title text - bright red
    this.canvasContext.font = "26px VT323, monospace";
    this.canvasContext.fillStyle = "#FF0000";
    this.canvasContext.fillText("GAME OVER", centerX, 240);

    // Draw score information - using same center point
    this.scoreManager.drawGameOverScore(
      this.canvasContext,
      this.isNewHighScore,
      this.previousHighScore
    );

    // Instructions - bright green
    this.canvasContext.font = "16px VT323, monospace";
    this.canvasContext.fillStyle = "#00FF00";
    this.canvasContext.fillText("Press M to return to menu", centerX, 365);

    // Reset text alignment
    this.canvasContext.textAlign = "left";

    // Store a dummy position for click detection (not used)
    this.currentButtonPos = { x: 350, y: 360 };
  }
}

// Global game instance
let gameInstance = null;

// Legacy start function for compatibility with StartScreen.js
const Game = {
  start: function () {
    console.log("Game.start() called");
    if (gameInstance) {
      console.log("Clearing existing game instance");
      gameInstance = null;
    }
    console.log("Creating new SpacePigeonGame instance");
    gameInstance = new SpacePigeonGame();
    console.log("Loading manager available:", !!ST.loadingManager);
    // Pass the loading manager to use preloaded assets
    gameInstance.initWithLoadedAssets(ST.loadingManager);
    // Setup mobile touch controls
    gameInstance.setupGameTouchControls();
    console.log("Game initialization complete");
  },
};


// Add mobile touch controls method to the class
SpacePigeonGame.prototype.setupGameTouchControls = function() {
  if ('ontouchstart' in window && this.canvas) {
    // Store reference for cleanup
    this.gameTouchStartHandler = (e) => {
      e.preventDefault();
      e.stopPropagation(); // Prevent bubbling to other handlers
      
      if (this.gameState === 'playing') {
        this.player.handleInput(32, true); // Simulate spacebar press
      } else if (this.gameState === 'gameOver') {
        this.returnToMainMenu(); // Same as M key
      } else if (this.gameState === 'levelComplete') {
        const result = this.levelManager.handleLevelCompleteInput(32); // Simulate spacebar
        if (result) {
          if (result.action === 'restart') {
            this.restartGame();
          } else if (result.action === 'nextLevel') {
            this.startLevel();
          }
        }
      }
    };
    
    this.gameTouchEndHandler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (this.gameState === 'playing') {
        this.player.handleInput(32, false); // Simulate spacebar release
      }
    };
    
    // Add the game touch handlers
    this.canvas.addEventListener('touchstart', this.gameTouchStartHandler, { passive: false });
    this.canvas.addEventListener('touchend', this.gameTouchEndHandler, { passive: false });
  }
};

// Clean up touch controls when returning to menu
SpacePigeonGame.prototype.cleanupTouchControls = function() {
  if (this.canvas && this.gameTouchStartHandler) {
    this.canvas.removeEventListener('touchstart', this.gameTouchStartHandler);
    this.canvas.removeEventListener('touchend', this.gameTouchEndHandler);
  }
};

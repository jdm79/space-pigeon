"use strict";
var ST = {
  canvas: undefined,
  context: undefined,
  width: undefined,
  height: undefined,

  playButtonClicked: false,
  instructionsButtonClicked: false,
  creditsButtonClicked: false,

  mouseX: undefined,
  mouseY: undefined,

  bgImage: new Image(),

  notificationPanel: new Image(),
  PanelPos: {
    x: 320,
    y: 130,
  },
  PanelImg: undefined,

  creditsImage: new Image(),

  pigeonImage: new Image(),
  alienImage: new Image(),

  backgroundY: 0,
  speed: 0.2,
  startSound: null,

  loadingManager: null,
  assetsLoaded: false,

  tipsList: [
    "Avoid the colourful space rectangles",
    "Press SPACE to start - and to fly!",
    "Collect points by flying through gaps",
    "Each level gets harder and faster",
  ],
  currentTipIndex: 0,
  tipStartTime: Date.now(),
  tipInterval: 3000,

  buttonX: [260, 310, 360],
  buttonY: [370, 420, 470],
  buttonWidth: [140, 140, 140],
  buttonHeight: [40, 40, 40],

  alienX: [0, 0],
  alienY: [0, 0],
  alienWidth: 54,
  alienHeight: 40,
  alienVisible: false,
  alienSize: 0,
  alienRotate: 0,

  frames: 100,
  timerId: 0,
  fadeId: 0,
  time: 0.0,
  keyboard: {
    keyDown: -1,
  },
  keys: {
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
  },
};

ST.handleKeyDown = function (evt) {
  ST.keyboard.keyDown = evt.keyCode;
};

ST.handleKeyUp = function (evt) {
  ST.keyboard.keyDown = -1;
};

ST.start = function () {
  ST.alienSize = ST.alienWidth;
  ST.canvas = document.getElementById("myCanvas");
  ST.context = ST.canvas.getContext("2d");

  document.onkeydown = ST.handleKeyDown;
  document.onkeyup = ST.handleKeyUp;

  ST.width = ST.canvas.getAttribute("width");
  ST.height = ST.canvas.getAttribute("height");

  ST.loadingManager = new LoadingManager();
  ST.loadingManager.init(ST.canvas);

  ST.addAssetsToLoader();

  ST.loadingManager.startLoading(() => {
    ST.onAssetsLoaded();
  });
};

ST.addAssetsToLoader = function () {
  ST.loadingManager.addImageAsset("panel", "assets/panel_big1.png");
  ST.loadingManager.addImageAsset("background", "assets/backgroundSerif2.png");
  ST.loadingManager.addImageAsset("pigeon", "assets/pigeonST.png");

  ST.loadingManager.addImageAsset("gameBackground", "assets/stars.png");
  ST.loadingManager.addImageAsset("playerPigeon", "assets/pigeon.png");
  ST.loadingManager.addImageAsset("fireball", "assets/fireball.png");
  ST.loadingManager.addImageAsset("gameOverPanel", "assets/panel_big1.png");
  ST.loadingManager.addImageAsset("playAgainButton", "assets/b_to_play.png");

  ST.loadingManager.addAudioAsset("startMusic", "assets/respirator.mp3");
  ST.loadingManager.addAudioAsset("gameMusic", "assets/killa.mp3");
  ST.loadingManager.addAudioAsset("explosion", "assets/bang.mp3");
  ST.loadingManager.addAudioAsset("sadMusic", "assets/sad.mp3");
  ST.loadingManager.addAudioAsset("cheering", "assets/cheering.mp3");
  ST.loadingManager.addAudioAsset("gunshot", "assets/gunshot.mp3");
  ST.loadingManager.addAudioAsset("pain", "assets/pain.mp3");
};

ST.onAssetsLoaded = function () {
  if (ST.assetsLoaded) {
    return;
  }

  ST.assetsLoaded = true;

  ST.PanelImg = ST.loadingManager.getLoadedImage("panel");
  ST.bgImage = ST.loadingManager.getLoadedImage("background");
  ST.pigeonImage = ST.loadingManager.getLoadedImage("pigeon");

  ST.startSound = new Audio("assets/respirator.mp3");
  ST.startSound.volume = 0.4;
  ST.startSound.loop = true;

  ST.context.clearRect(0, 0, ST.width, ST.height);

  ST.timerId = setInterval("ST.mainLoop()", 1000 / ST.frames);

  ST.canvas.addEventListener("mousemove", ST.checkPos);
  ST.canvas.addEventListener("mouseup", ST.checkClick);

  ST.mainLoop();
};

document.addEventListener("DOMContentLoaded", ST.start);

ST.mainLoop = function () {
  if (!ST.playButtonClicked) {
    ST.clear();
    ST.update();
    ST.draw();
  }
};

ST.clear = function () {
  ST.context.clearRect(0, 0, ST.width, ST.height);
};

ST.update = function () {
  ST.moveBg();
  ST.volumeControl();
  ST.updateTips();
};

ST.draw = function () {
  if (!ST.assetsLoaded) {
    return;
  }

  // Draw background twice for seamless scrolling
  ST.context.drawImage(ST.bgImage, 0, ST.backgroundY);
  ST.context.drawImage(ST.bgImage, 0, ST.backgroundY + ST.height);
  
  // Draw animated title
  ST.drawAnimatedTitle();
  
  ST.context.drawImage(ST.pigeonImage, 260, 100);

  ST.drawTips();
};

ST.moveBg = function () {
  ST.backgroundY -= ST.speed;
  if (ST.backgroundY <= -ST.height) {
    ST.backgroundY = 0;
  }
  if (ST.alienSize == ST.alienWidth) {
    ST.alienRotate = -1;
  }
  if (ST.alienSize == 0) {
    ST.alienRotate = 1;
  }
  ST.alienSize += ST.alienRotate;
};

ST.checkPos = function (mouseEvent) {
  if (mouseEvent.pageX || mouseEvent.pageY == 0) {
    ST.mouseX = mouseEvent.pageX - this.offsetLeft;
    ST.mouseY = mouseEvent.pageY - this.offsetTop;
  } else if (mouseEvent.offsetX || mouseEvent.offsetY == 0) {
    ST.mouseX = mouseEvent.offsetX;
    ST.mouseY = mouseEvent.offsetY;
  }
  for (var i = 0; i < ST.buttonX.length; i++) {
    if (
      ST.mouseX > ST.buttonX[i] &&
      ST.mouseX < ST.buttonX[i] + ST.buttonWidth[i]
    ) {
      if (
        ST.mouseY > ST.buttonY[i] &&
        ST.mouseY < ST.buttonY[i] + ST.buttonHeight[i]
      ) {
        ST.alienVisible = true;
        ST.alienX[0] = ST.buttonX[i] - ST.alienWidth / 2 - 2;
        ST.alienY[0] = ST.buttonY[i] + 2;
        ST.alienX[1] = ST.buttonX[i] + ST.buttonWidth[i] + ST.alienWidth / 2;
        ST.alienY[1] = ST.buttonY[i] + 2;
      }
    } else {
      ST.alienVisible = false;
    }
  }
};

ST.checkClick = function (mouseEvent) {
  // Mouse clicking disabled - use spacebar to start game
};

ST.fadeOut = function () {
  ST.context.fillStyle = "rgba(0,0,0, 0.2)";
  ST.context.fillRect(0, 0, ST.width, ST.height);
  ST.time += 0.1;
  if (ST.time >= 2) {
    clearInterval(ST.fadeId);
    ST.time = 0;
    ST.timerId = setInterval("ST.mainLoop()", 1000 / ST.frames);
    ST.canvas.addEventListener("mousemove", ST.checkPos);
    ST.canvas.addEventListener("mouseup", ST.checkClick);
  }
};

ST.updateTips = function () {
  const currentTime = Date.now();
  if (currentTime - ST.tipStartTime >= ST.tipInterval) {
    ST.currentTipIndex = (ST.currentTipIndex + 1) % ST.tipsList.length;
    ST.tipStartTime = currentTime;
  }
};

ST.drawAnimatedTitle = function () {
  const currentTime = Date.now();
  const title = "SPACE PIGEON";
  
  // Set up title font - larger than tips
  ST.context.font = "48px VT323, monospace";
  ST.context.textAlign = "center";
  
  // Position for title
  const titleX = ST.width / 2;
  const titleY = 65;
  
  // Create pulsing glow effect (same as tips)
  const pulsePhase = (currentTime % 2000) / 2000; // 2 second cycle
  const pulseAlpha = 0.3 + 0.7 * Math.sin(pulsePhase * Math.PI * 2);
  
  // Measure title for background
  const titleWidth = ST.context.measureText(title).width;
  const padding = 30;
  const bgX = titleX - titleWidth / 2 - padding;
  const bgY = titleY - 35;
  const bgWidth = titleWidth + padding * 2;
  const bgHeight = 50;
  
  // Draw outer glow (CRT effect)
  ST.context.shadowBlur = 20;
  ST.context.shadowColor = "#00FFFF"; // Cyan glow
  
  // Draw main background with gradient
  const gradient = ST.context.createLinearGradient(bgX, bgY, bgX, bgY + bgHeight);
  gradient.addColorStop(0, "#001122"); // Dark blue top
  gradient.addColorStop(0.5, "#000000"); // Black middle
  gradient.addColorStop(1, "#001122"); // Dark blue bottom
  
  ST.context.fillStyle = gradient;
  ST.context.fillRect(bgX, bgY, bgWidth, bgHeight);
  
  // Draw neon border (pulsing cyan)
  ST.context.strokeStyle = `rgba(0, 255, 255, ${pulseAlpha})`;
  ST.context.lineWidth = 3;
  ST.context.strokeRect(bgX, bgY, bgWidth, bgHeight);
  
  // Draw inner border (yellow)
  ST.context.strokeStyle = "#FFFF00";
  ST.context.lineWidth = 1;
  ST.context.strokeRect(bgX + 3, bgY + 3, bgWidth - 6, bgHeight - 6);
  
  // Clear shadow for text
  ST.context.shadowBlur = 0;
  
  // Add scanline effect
  for (let i = 0; i < bgHeight; i += 4) {
    ST.context.fillStyle = `rgba(0, 255, 255, ${0.15 * pulseAlpha})`;
    ST.context.fillRect(bgX, bgY + i, bgWidth, 1);
  }
  
  // Draw corner decorations
  ST.context.fillStyle = "#00FFFF";
  const cornerSize = 12;
  // Top-left
  ST.context.fillRect(bgX - 3, bgY - 3, cornerSize, 3);
  ST.context.fillRect(bgX - 3, bgY - 3, 3, cornerSize);
  // Top-right
  ST.context.fillRect(bgX + bgWidth - cornerSize + 3, bgY - 3, cornerSize, 3);
  ST.context.fillRect(bgX + bgWidth, bgY - 3, 3, cornerSize);
  // Bottom-left
  ST.context.fillRect(bgX - 3, bgY + bgHeight, cornerSize, 3);
  ST.context.fillRect(bgX - 3, bgY + bgHeight - cornerSize + 3, 3, cornerSize);
  // Bottom-right
  ST.context.fillRect(bgX + bgWidth - cornerSize + 3, bgY + bgHeight, cornerSize, 3);
  ST.context.fillRect(bgX + bgWidth, bgY + bgHeight - cornerSize + 3, 3, cornerSize);
  
  // Draw each letter with different colors
  const letters = title.split('');
  const letterColors = [
    "#FF0000", "#FFFF00", "#00FF00", "#00FFFF", "#FF00FF", "#FF8800", // SPACE 
    "#FF0000", "#00FF00", "#FFFF00", "#FF00FF", "#00FFFF", "#FF8800"  // PIGEON
  ];
  
  // Calculate letter positions
  let letterX = bgX + padding;
  
  for (let i = 0; i < letters.length; i++) {
    const letter = letters[i];
    
    // Skip space, but still move position
    if (letter === ' ') {
      letterX += ST.context.measureText(' ').width;
      continue;
    }
    
    // Color cycling for each letter (offset by letter index for wave effect)
    const colorCycle = Math.floor(((currentTime + i * 500) % 4000) / 1000); // Each letter offset by 500ms
    const cycleColors = ["#FFFF00", "#00FF00", "#FF8800", "#FF00FF"];
    const baseColor = letterColors[i];
    const currentColor = cycleColors[colorCycle];
    
    // Draw red shadow for each letter
    ST.context.fillStyle = "#FF0000";
    ST.context.fillText(letter, letterX + 3, titleY + 3);
    
    // Draw main letter
    ST.context.fillStyle = currentColor;
    ST.context.fillText(letter, letterX, titleY);
    
    // Move to next letter position
    letterX += ST.context.measureText(letter).width;
  }
  
  ST.context.textAlign = "left";
};

ST.drawTips = function () {
  if (ST.tipsList.length > 0) {
    const tip = ST.tipsList[ST.currentTipIndex];
    const currentTime = Date.now();

    // Set up text properties to measure dimensions
    ST.context.font = "20px VT323, monospace";
    ST.context.textAlign = "center";

    // Measure text width for background
    const textWidth = ST.context.measureText(tip).width;
    const padding = 20;

    // Calculate background rectangle position
    const bgX = ST.width / 2 - textWidth / 2 - padding;
    const bgY = ST.height - 110;
    const bgWidth = textWidth + padding * 2;
    const bgHeight = 35;

    // Create pulsing glow effect
    const pulsePhase = (currentTime % 2000) / 2000; // 2 second cycle
    const pulseAlpha = 0.3 + 0.7 * Math.sin(pulsePhase * Math.PI * 2);
    
    // Draw outer glow (multiple layers for retro CRT effect)
    ST.context.shadowBlur = 15;
    ST.context.shadowColor = "#00FFFF"; // Cyan glow
    
    // Draw main background with gradient
    const gradient = ST.context.createLinearGradient(bgX, bgY, bgX, bgY + bgHeight);
    gradient.addColorStop(0, "#001122"); // Dark blue top
    gradient.addColorStop(0.5, "#000000"); // Black middle
    gradient.addColorStop(1, "#001122"); // Dark blue bottom
    
    ST.context.fillStyle = gradient;
    ST.context.fillRect(bgX, bgY, bgWidth, bgHeight);
    
    // Draw neon border (classic arcade style)
    ST.context.strokeStyle = `rgba(0, 255, 255, ${pulseAlpha})`; // Pulsing cyan
    ST.context.lineWidth = 2;
    ST.context.strokeRect(bgX, bgY, bgWidth, bgHeight);
    
    // Draw inner border
    ST.context.strokeStyle = "#FFFF00"; // Yellow inner border
    ST.context.lineWidth = 1;
    ST.context.strokeRect(bgX + 2, bgY + 2, bgWidth - 4, bgHeight - 4);
    
    // Clear shadow for text
    ST.context.shadowBlur = 0;
    
    // Draw text with multiple color layers for depth (classic arcade text effect)
    const textY = ST.height - 87;
    
    // Shadow layer (offset)
    ST.context.fillStyle = "#FF0000"; // Red shadow
    ST.context.fillText(tip, ST.width / 2 + 2, textY + 2);
    
    // Main text layer with cycling colors
    const colorCycle = Math.floor((currentTime % 4000) / 1000); // 4 colors, 1 second each
    const arcadeColors = ["#FFFF00", "#00FF00", "#FF8800", "#FF00FF"]; // Yellow, Green, Orange, Magenta
    ST.context.fillStyle = arcadeColors[colorCycle];
    ST.context.fillText(tip, ST.width / 2, textY);
    
    // Add scanline effect across the tips area
    for (let i = 0; i < bgHeight; i += 4) {
      ST.context.fillStyle = `rgba(0, 255, 255, ${0.1 * pulseAlpha})`;
      ST.context.fillRect(bgX, bgY + i, bgWidth, 1);
    }
    
    // Draw corner decorations (classic arcade style)
    ST.context.fillStyle = "#00FFFF";
    const cornerSize = 8;
    // Top-left corner
    ST.context.fillRect(bgX - 2, bgY - 2, cornerSize, 2);
    ST.context.fillRect(bgX - 2, bgY - 2, 2, cornerSize);
    // Top-right corner
    ST.context.fillRect(bgX + bgWidth - cornerSize + 2, bgY - 2, cornerSize, 2);
    ST.context.fillRect(bgX + bgWidth, bgY - 2, 2, cornerSize);
    // Bottom-left corner
    ST.context.fillRect(bgX - 2, bgY + bgHeight, cornerSize, 2);
    ST.context.fillRect(bgX - 2, bgY + bgHeight - cornerSize + 2, 2, cornerSize);
    // Bottom-right corner
    ST.context.fillRect(bgX + bgWidth - cornerSize + 2, bgY + bgHeight, cornerSize, 2);
    ST.context.fillRect(bgX + bgWidth, bgY + bgHeight - cornerSize + 2, 2, cornerSize);

    ST.context.textAlign = "left";
  }
};

ST.volumeControl = function () {
  switch (ST.keyboard.keyDown) {
    case ST.keys.SP:
      if (ST.assetsLoaded) {
        if (ST.startSound) {
          ST.startSound.pause();
        }

        Game.start();
        ST.playButtonClicked = true;
      }
      break;
  }
};


// Mobile touch controls
ST.setupTouchControls = function () {
  if ("ontouchstart" in window) {
    // Prevent default touch behaviors only for the document
    document.addEventListener("touchstart", function(e) {
      // Only prevent default for body/document level, not canvas
      if (e.target === document.body || e.target === document.documentElement) {
        e.preventDefault();
      }
    }, { passive: false });
    
    document.addEventListener("touchmove", function(e) {
      if (e.target === document.body || e.target === document.documentElement) {
        e.preventDefault();
      }
    }, { passive: false });
    
    // Handle touch for starting game ONLY when on start screen
    ST.startScreenTouchHandler = function(e) {
      e.preventDefault();
      // Only handle touch if we're still on the start screen (game not started)
      if (ST.assetsLoaded && !ST.playButtonClicked) {
        if (ST.startSound) {
          ST.startSound.pause();
        }
        Game.start();
        ST.playButtonClicked = true;
        // Remove start screen touch handler once game starts
        ST.canvas.removeEventListener("touchstart", ST.startScreenTouchHandler);
      }
    };
    
    ST.canvas.addEventListener("touchstart", ST.startScreenTouchHandler, { passive: false });
  }
};

// Initialize touch controls when DOM is ready
document.addEventListener("DOMContentLoaded", function() {
  setTimeout(ST.setupTouchControls, 100);
});

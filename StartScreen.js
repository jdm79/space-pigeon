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
  logoImage: new Image(),

  notificationPanel: new Image(),
  PanelPos: {
    x: 320,
    y: 130,
  },
  PanelImg: undefined,

  playImage: new Image(),
  instructImage: new Image(),
  creditsImage: new Image(),

  pigeonImage: new Image(),
  alienImage: new Image(),

  backgroundY: 0,
  speed: 0.4,
  startSound: null,

  loadingManager: null,
  assetsLoaded: false,

  tipsList: [
    "Avoid the obstacles! Squeeze through gaps!",
    "Collect points by flying through gaps!",
    "Each level gets harder and faster!",
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
  ST.loadingManager.addImageAsset("logo", "assets/spacePigeon_title.png");
  ST.loadingManager.addImageAsset("playButton", "assets/space_play.png");
  ST.loadingManager.addImageAsset("instructions", "assets/instructions.png");
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
  ST.logoImage = ST.loadingManager.getLoadedImage("logo");
  ST.playImage = ST.loadingManager.getLoadedImage("playButton");
  ST.instructImage = ST.loadingManager.getLoadedImage("instructions");
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

  ST.context.drawImage(ST.bgImage, 0, ST.backgroundY);
  ST.context.drawImage(ST.logoImage, 255, -10);
  ST.context.drawImage(ST.pigeonImage, 260, 100);
  ST.context.drawImage(ST.playImage, 260, 370);
  ST.context.drawImage(ST.instructImage, 310, 420);

  ST.context.drawImage(ST.playImage, ST.buttonX[0], ST.buttonY[0]);

  ST.drawTips();
};

ST.moveBg = function () {
  ST.backgroundY -= ST.speed;
  if (ST.backgroundY == -1 * ST.height) {
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

ST.drawTips = function () {
  if (ST.tipsList.length > 0) {
    ST.context.font = "16px Arial";
    ST.context.fillStyle = "#000000";
    ST.context.textAlign = "center";

    const tip = ST.tipsList[ST.currentTipIndex];
    ST.context.fillText(tip, ST.width / 2, ST.height - 85);

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

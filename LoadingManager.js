"use strict";

class LoadingManager {
  constructor() {
    this.canvas = null;
    this.context = null;
    this.isLoading = true;
    this.loadedAssets = 0;
    this.totalAssets = 0;
    this.assetsToLoad = [];
    this.loadedImages = new Map();
    this.loadedAudio = new Map();
    this.onCompleteCallback = null;
    this.loadingStartTime = Date.now();
    this.minLoadingTime = 1000;

    // Loading animation properties
    this.loadingAngle = 0;
    this.loadingSpeed = 0.1;
    this.pulsePhase = 0;

    // Progress bar properties
    this.progressBarWidth = 300;
    this.progressBarHeight = 20;
  }

  init(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.startLoadingAnimation();
  }

  addImageAsset(key, src) {
    this.assetsToLoad.push({
      type: "image",
      key: key,
      src: src,
    });
    this.totalAssets++;
  }

  addAudioAsset(key, src) {
    this.assetsToLoad.push({
      type: "audio",
      key: key,
      src: src,
    });
    this.totalAssets++;
  }

  startLoading(onComplete) {
    this.onCompleteCallback = onComplete;

    setTimeout(() => {
      if (this.isLoading) {
        this.completeLoading();
      }
    }, 30000);

    this.loadAssets();
  }

  loadAssets() {
    if (this.assetsToLoad.length === 0) {
      this.checkLoadingComplete();
      return;
    }

    this.assetsToLoad.forEach((asset) => {
      if (asset.type === "image") {
        this.loadImage(asset.key, asset.src);
      } else if (asset.type === "audio") {
        this.loadAudio(asset.key, asset.src);
      }
    });
  }

  loadImage(key, src) {
    const img = new Image();

    img.onload = () => {
      this.loadedImages.set(key, img);
      this.onAssetLoaded();
    };

    img.onerror = () => {
      this.loadedImages.set(key, img);
      this.onAssetLoaded();
    };

    img.src = src;
  }

  loadAudio(key, src) {
    const audio = new Audio();
    let loaded = false;

    const markAsLoaded = () => {
      if (!loaded) {
        loaded = true;
        this.loadedAudio.set(key, audio);
        this.onAssetLoaded();
      }
    };

    const onCanPlayThrough = () => {
      markAsLoaded();
      audio.removeEventListener("canplaythrough", onCanPlayThrough);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("loadeddata", onLoadedData);
    };

    const onLoadedData = () => {
      markAsLoaded();
      audio.removeEventListener("canplaythrough", onCanPlayThrough);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("loadeddata", onLoadedData);
    };

    const onError = () => {
      markAsLoaded();
      audio.removeEventListener("canplaythrough", onCanPlayThrough);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("loadeddata", onLoadedData);
    };

    // Add multiple event listeners for better compatibility
    audio.addEventListener("canplaythrough", onCanPlayThrough);
    audio.addEventListener("loadeddata", onLoadedData);
    audio.addEventListener("error", onError);

    setTimeout(() => {
      if (!loaded) {
        markAsLoaded();
      }
    }, 5000);

    // Set preload to auto to ensure it loads
    audio.preload = "auto";
    audio.src = src;
    audio.load(); // Force loading
  }

  onAssetLoaded() {
    this.loadedAssets++;
    setTimeout(() => {
      this.checkLoadingComplete();
    }, 50);
  }
  checkLoadingComplete() {
    const allAssetsLoaded = this.loadedAssets >= this.totalAssets;

    if (allAssetsLoaded) {
      setTimeout(() => {
        this.completeLoading();
      }, 500);
    }
  }

  completeLoading() {
    if (!this.isLoading) {
      return;
    }
    
    this.isLoading = false;
    if (this.onCompleteCallback) {
      this.onCompleteCallback();
    }
  }

  getLoadedImage(key) {
    return this.loadedImages.get(key);
  }

  getLoadedAudio(key) {
    return this.loadedAudio.get(key);
  }

  getProgress() {
    if (this.totalAssets === 0) return 100;
    return Math.round((this.loadedAssets / this.totalAssets) * 100);
  }

  startLoadingAnimation() {
    if (this.isLoading) {
      this.updateLoadingAnimation();
      this.drawLoadingScreen();
      requestAnimationFrame(() => this.startLoadingAnimation());
    }
  }

  updateLoadingAnimation() {
    this.loadingAngle += this.loadingSpeed;
    this.pulsePhase += 0.05;

    if (this.loadingAngle >= Math.PI * 2) {
      this.loadingAngle = 0;
    }
  }


  drawLoadingScreen() {
    if (!this.context) return;

    const width = this.canvas.width;
    const height = this.canvas.height;
    const currentTime = Date.now();

    // Clear canvas
    this.context.fillStyle = "#000";
    this.context.fillRect(0, 0, width, height);

    // Draw starfield background
    this.drawStarfield();

    // Draw main loading title with full 1980s arcade style
    this.drawLoadingTitle(width, height, currentTime);

    // Draw loading text with enhanced 1980s style
    this.drawLoadingText(width, height, currentTime);

    // Draw spinning loading indicator
    this.drawSpinner(width / 2, height / 2 - 20);
  }

  drawLoadingTitle(width, height, currentTime) {
    const title = "SPACE PIGEON";
    
    // Set up title font
    this.context.font = "38px VT323, monospace";
    this.context.textAlign = "center";
    
    // Position for title
    const titleX = width / 2;
    const titleY = height / 2 - 120;
    
    // Create pulsing glow effect
    const pulsePhase = (currentTime % 2000) / 2000; // 2 second cycle
    const pulseAlpha = 0.3 + 0.7 * Math.sin(pulsePhase * Math.PI * 2);
    
    // Measure title width for background
    const titleWidth = this.context.measureText(title).width;
    const padding = 20;
    const bgX = titleX - titleWidth / 2 - padding;
    const bgY = titleY - 25;
    const bgWidth = titleWidth + padding * 2;
    const bgHeight = 35;
    
    // Draw outer glow (CRT effect)
    this.context.shadowBlur = 15;
    this.context.shadowColor = "#00FFFF"; // Cyan glow
    
    // Draw main background with gradient
    const gradient = this.context.createLinearGradient(bgX, bgY, bgX, bgY + bgHeight);
    gradient.addColorStop(0, "#001122"); // Dark blue top
    gradient.addColorStop(0.5, "#000000"); // Black middle
    gradient.addColorStop(1, "#001122"); // Dark blue bottom
    
    this.context.fillStyle = gradient;
    this.context.fillRect(bgX, bgY, bgWidth, bgHeight);
    
    // Draw neon border (pulsing cyan)
    this.context.strokeStyle = `rgba(0, 255, 255, ${pulseAlpha})`;
    this.context.lineWidth = 2;
    this.context.strokeRect(bgX, bgY, bgWidth, bgHeight);
    
    // Draw inner border (yellow)
    this.context.strokeStyle = "#FFFF00";
    this.context.lineWidth = 1;
    this.context.strokeRect(bgX + 2, bgY + 2, bgWidth - 4, bgHeight - 4);
    
    // Clear shadow for text
    this.context.shadowBlur = 0;
    
    // Add scanline effect
    for (let i = 0; i < bgHeight; i += 3) {
      this.context.fillStyle = `rgba(0, 255, 255, ${0.1 * pulseAlpha})`;
      this.context.fillRect(bgX, bgY + i, bgWidth, 1);
    }
    
    // Draw corner decorations
    this.context.fillStyle = "#00FFFF";
    const cornerSize = 8;
    // Top-left
    this.context.fillRect(bgX - 2, bgY - 2, cornerSize, 2);
    this.context.fillRect(bgX - 2, bgY - 2, 2, cornerSize);
    // Top-right
    this.context.fillRect(bgX + bgWidth - cornerSize + 2, bgY - 2, cornerSize, 2);
    this.context.fillRect(bgX + bgWidth, bgY - 2, 2, cornerSize);
    // Bottom-left
    this.context.fillRect(bgX - 2, bgY + bgHeight, cornerSize, 2);
    this.context.fillRect(bgX - 2, bgY + bgHeight - cornerSize + 2, 2, cornerSize);
    // Bottom-right
    this.context.fillRect(bgX + bgWidth - cornerSize + 2, bgY + bgHeight, cornerSize, 2);
    this.context.fillRect(bgX + bgWidth, bgY + bgHeight - cornerSize + 2, 2, cornerSize);
    
    // Draw title with color cycling letters
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
        letterX += this.context.measureText(' ').width;
        continue;
      }
      
      // Color cycling for each letter (offset by letter index for wave effect)
      const colorCycle = Math.floor(((currentTime + i * 400) % 3200) / 800); // Each letter offset by 400ms
      const cycleColors = ["#FFFF00", "#00FF00", "#FF8800", "#FF00FF"];
      const currentColor = cycleColors[colorCycle];
      
      // Draw red shadow for each letter
      this.context.fillStyle = "#FF0000";
      this.context.fillText(letter, letterX + 2, titleY + 2);
      
      // Draw main letter
      this.context.fillStyle = currentColor;
      this.context.fillText(letter, letterX, titleY);
      
      // Move to next letter position
      letterX += this.context.measureText(letter).width;
    }
  }

  drawLoadingText(width, height, currentTime) {
    const loadingText = "Loading...";
    
    // Set up text properties
    this.context.font = "26px VT323, monospace";
    this.context.textAlign = "center";
    
    // Position
    const textX = width / 2;
    const textY = height / 2 - 60;
    
    // Measure text for background
    const textWidth = this.context.measureText(loadingText).width;
    const padding = 15;
    const bgX = textX - textWidth / 2 - padding;
    const bgY = textY - 18;
    const bgWidth = textWidth + padding * 2;
    const bgHeight = 25;
    
    // Create pulsing effect
    const pulsePhase = (currentTime % 1500) / 1500; // 1.5 second cycle
    const pulseAlpha = 0.4 + 0.6 * Math.sin(pulsePhase * Math.PI * 2);
    
    // Draw background with gradient
    const gradient = this.context.createLinearGradient(bgX, bgY, bgX, bgY + bgHeight);
    gradient.addColorStop(0, "#001100"); // Dark green top
    gradient.addColorStop(0.5, "#000000"); // Black middle
    gradient.addColorStop(1, "#001100"); // Dark green bottom
    
    this.context.fillStyle = gradient;
    this.context.fillRect(bgX, bgY, bgWidth, bgHeight);
    
    // Draw neon border
    this.context.strokeStyle = `rgba(0, 255, 0, ${pulseAlpha})`;
    this.context.lineWidth = 2;
    this.context.strokeRect(bgX, bgY, bgWidth, bgHeight);
    
    // Add scanlines
    for (let i = 0; i < bgHeight; i += 3) {
      this.context.fillStyle = `rgba(0, 255, 0, ${0.1 * pulseAlpha})`;
      this.context.fillRect(bgX, bgY + i, bgWidth, 1);
    }
    
    // Draw text with shadow and main color
    this.context.fillStyle = "#008800"; // Dark green shadow
    this.context.fillText(loadingText, textX + 1, textY + 1);
    
    // Main text with cycling brightness
    const brightness = Math.floor(pulseAlpha * 255);
    this.context.fillStyle = `rgb(0, ${brightness}, 0)`;
    this.context.fillText(loadingText, textX, textY);
  }

  drawStarfield() {
    this.context.fillStyle = "#FFF";
    for (let i = 0; i < 50; i++) {
      const x = (i * 137.5) % this.canvas.width;
      const y = (i * 78.3) % this.canvas.height;
      const size = Math.sin(this.pulsePhase + i) * 0.5 + 1;
      this.context.beginPath();
      this.context.arc(x, y, size, 0, Math.PI * 2);
      this.context.fill();
    }
  }

  drawSpinner(centerX, centerY) {
    const radius = 20;
    this.context.strokeStyle = "#FFD700";
    this.context.lineWidth = 3;

    // Draw spinning arcs
    for (let i = 0; i < 3; i++) {
      const startAngle = this.loadingAngle + (i * Math.PI * 2) / 3;
      const endAngle = startAngle + Math.PI / 2;

      this.context.beginPath();
      this.context.arc(centerX, centerY, radius - i * 3, startAngle, endAngle);
      this.context.stroke();
    }
  }

  drawProgressBar(centerX, centerY) {
    const progress = this.getProgress();
    const barX = centerX - this.progressBarWidth / 2;
    const barY = centerY - this.progressBarHeight / 2;

    // Background
    this.context.fillStyle = "rgba(255, 255, 255, 0.2)";
    this.context.fillRect(
      barX,
      barY,
      this.progressBarWidth,
      this.progressBarHeight
    );

    // Progress fill
    const fillWidth = (this.progressBarWidth * progress) / 100;
    const gradient = this.context.createLinearGradient(
      barX,
      barY,
      barX + fillWidth,
      barY
    );
    gradient.addColorStop(0, "#00FF00");
    gradient.addColorStop(1, "#FFD700");

    this.context.fillStyle = gradient;
    this.context.fillRect(barX, barY, fillWidth, this.progressBarHeight);

    // Border
    this.context.strokeStyle = "#FFF";
    this.context.lineWidth = 2;
    this.context.strokeRect(
      barX,
      barY,
      this.progressBarWidth,
      this.progressBarHeight
    );
  }

}

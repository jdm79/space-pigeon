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

    // Clear canvas
    this.context.fillStyle = "#000";
    this.context.fillRect(0, 0, width, height);

    // Draw starfield background
    this.drawStarfield();

    // Draw main loading text - bright yellow
    this.context.font = "38px VT323, monospace";
    this.context.fillStyle = "#FFFF00";
    this.context.textAlign = "center";
    this.context.fillText("SPACE PIGEON", width / 2, height / 2 - 120);

    // Draw loading text with pulse effect - bright green
    const pulseAlpha = 0.5 + 0.5 * Math.sin(this.pulsePhase);
    this.context.font = "26px VT323, monospace";
    this.context.fillStyle = `rgba(0, 255, 0, ${pulseAlpha})`;
    this.context.fillText("Loading...", width / 2, height / 2 - 60);

    // Draw spinning loading indicator
    this.drawSpinner(width / 2, height / 2 - 20);
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

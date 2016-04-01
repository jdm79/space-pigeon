
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
	        y: 130
	    },
	    PanelImg: undefined,

	    playImage: new Image(),
	    instructImage: new Image(),
	    creditsImage: new Image(),

	    pigeonImage: new Image(),
	    alienImage: new Image(),

	    backgroundY: 0,
	    speed: 1,
	    startSound: new Audio(),


	    //	alienX : [0,0],
	    //	alienY : [0,0],
	    //	alienWidth : 54,
	    //	alienHeight : 40,

	    //	alienVisible : false,
	    //	alienSize : 0,
	    //	alienRotate : 0,

	    frames: 100,
	    timerId: 0,
	    fadeId: 0,
	    time: 0.0,
	    keyboard: {
	        keyDown: -1
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

	}

	ST.handleKeyDown = function (evt) {
	    ST.keyboard.keyDown = evt.keyCode;
	}

	ST.handleKeyUp = function (evt) {
	    ST.keyboard.keyDown = -1;
	}

	ST.start = function () {
	    ST.alienSize = ST.alienWidth;
	    ST.canvas = document.getElementById("myCanvas");
	    ST.context = ST.canvas.getContext("2d");

	    document.onkeydown = ST.handleKeyDown;
	    document.onkeyup = ST.handleKeyUp;

	    ST.width = ST.canvas.getAttribute('width');
	    ST.height = ST.canvas.getAttribute('height');

	    ST.PanelImg = new Image();
	    ST.PanelImg.src = "assets/panel_big1.png";


	    ST.startSound.src = "assets/respirator.mp3";
	    ST.startSound.play();
	    ST.startSound.volume = 0.4;

	    //ST.alienImage.src = "assets/enemy_white.png";
	    ST.bgImage.src = "assets/backgroundSerif2.png";
	    ST.logoImage.src = "assets/spacePigeon_title.png";

	    ST.playImage.src = "assets/space_play.png";
	    ST.instructImage.src = "assets/instructions.png";
	    //ST.creditsImage.src = "assets/credits.png";
	    ST.pigeonImage.src = "assets/pigeonST.png";

	    ST.timerId = setInterval("ST.mainLoop()", 1000 / ST.frames);

	    ST.canvas.addEventListener("mousemove", ST.checkPos);
	    ST.canvas.addEventListener("mouseup", ST.checkClick);

	    window.setTimeout(ST.mainLoop, 500);
	}

	document.addEventListener('DOMContentLoaded', ST.start); // this makes the game start with the start screen. first thing the DOM loads


	ST.mainLoop = function () { // if play button not pressed, keep showing the startup stuff
	    if (!ST.playButtonClicked) {
	        ST.clear();
	        ST.update();
	        ST.draw();

	    }

	}

	ST.clear = function () { // clearing it all
	    ST.context.clearRect(0, 0, ST.width, ST.height);
	}

	ST.update = function () { // update makes the background move, monitors for volume control and draws the buttons
	    ST.moveBg();
	    ST.volumeControl();




	}

	ST.draw = function () {
	    //ST.context.drawImage(Game.PanelImg, Game.PanelPos.x, Game.PanelPos.y);
	    ST.context.drawImage(ST.bgImage, 0, ST.backgroundY); //where the background starts. at the top
	    ST.context.drawImage(ST.logoImage, 255, -10); // logo position
	    ST.context.drawImage(ST.pigeonImage, 260, 100); // big pigeon position
	    ST.context.drawImage(ST.playImage, 260, 370);
	    ST.context.drawImage(ST.instructImage, 310, 420)

	    ST.context.drawImage(ST.playImage, ST.buttonX[0], ST.buttonY[0]); //the buttons to click on start screen
	    //ST.context.drawImage(ST.instructImage, ST.buttonX[1], ST.buttonY[1]);
	    //ST.context.drawImage(ST.creditsImage, ST.buttonX[2], ST.buttonY[2]);



	}




	// --------------------------- the spinning things around the buttons when hovering over ----------------------------
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
	}

	ST.checkPos = function (mouseEvent) {
	    if (mouseEvent.pageX || mouseEvent.pageY == 0) {
	        ST.mouseX = mouseEvent.pageX - this.offsetLeft;
	        ST.mouseY = mouseEvent.pageY - this.offsetTop;
	    } else if (mouseEvent.offsetX || mouseEvent.offsetY == 0) {
	        ST.mouseX = mouseEvent.offsetX;
	        ST.mouseY = mouseEvent.offsetY;
	    }
	    for (var i = 0; i < ST.buttonX.length; i++) {
	        if (ST.mouseX > ST.buttonX[i] && ST.mouseX < ST.buttonX[i] + ST.buttonWidth[i]) {
	            if (ST.mouseY > ST.buttonY[i] && ST.mouseY < ST.buttonY[i] + ST.buttonHeight[i]) {
	                ST.alienVisible = true;
	                ST.alienX[0] = ST.buttonX[i] - (ST.alienWidth / 2) - 2;
	                ST.alienY[0] = ST.buttonY[i] + 2;
	                ST.alienX[1] = ST.buttonX[i] + ST.buttonWidth[i] + (ST.alienWidth / 2);
	                ST.alienY[1] = ST.buttonY[i] + 2;
	            }
	        } else {
	            ST.alienVisible = false;
	        }
	    }
	}

	//------------------------------ starts the game when mouse click on play button -----------------------------

	/*		ST.checkClick = function(mouseEvent){
			for( var i = 0; i < ST.buttonX.length; i++){
				if(ST.mouseX > ST.buttonX[i] && ST.mouseX < ST.buttonX[i] + ST.buttonWidth[i]){
					if(ST.mouseY > ST.buttonY[i] && ST.mouseY < ST.buttonY[i] + ST.buttonHeight[i]){
						
					if(ST.keys.P)
						//if( ST.buttonX[i]===ST.buttonX[0] && ST.buttonY[i]===ST.buttonY[0])  // targeting play button (if clicked) 
						{
							Game.start();//calls the game
							ST.playButtonClicked = true;
							ST.startSound.pause();
						}else if(ST.buttonX[i]===ST.buttonX[1] && ST.buttonY[i]===ST.buttonY[1]){
							//insert code here to show instructions
							//Game1.start();//calls the game
							console.log("instruction button clicked");
							ST.instructionsButtonClicked = true;
							ST.context.font = "20px 'Old English Text MT'";
							ST.context.fillStyle = "white";
		
			                ST.context.fillText("Pigeon Dead", 360, 280);
							ST.context.fillText("Game Over ", 360, 320);
							ST.startSound.pause();
						
							}
							
						/*}else(ST.buttonX[i]===ST.buttonX[2] && ST.buttonY[i]===ST.buttonY[2]){
							//insert code here to show credits
						}*/


	/*			ST.fadeId = setInterval("ST.fadeOut()", 1000/ST.frames);
					clearInterval(ST.timerId);
					ST.canvas.removeEventListener("mousemove", ST.checkPos);
					ST.canvas.removeEventListener("mouseup", ST.checkClick);
				}
			}
		}
	}*/



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
	    }
	    // ------------------------------------------volume control ----------------------

	ST.volumeControl = function () {
	    switch (ST.keyboard.keyDown) {
	    case ST.keys.SP:
	        Game.start(); //calls the game
	        ST.playButtonClicked = true;
	        ST.startSound.pause();

	        break;

	    case ST.keys.S:
	        ST.startSound.play();

	        break;

	    case ST.keys.UA:
	        if (ST.startSound.volume <= 0.9) {
	            ST.startSound.volume += 0.01; //changed the increase to 0.01 rather than 0.1. more gentle increase in volume
	        }
	        break;

	    case ST.keys.DA:
	        if (ST.startSound.volume >= 0.01) { //allow it to go almost silent!
	            ST.startSound.volume -= 0.01; //changed the decrease to 0.01 rather than 0.1. more gentle decrease in volume
	        }
	        break;


	    }
	}

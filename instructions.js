"use strict";

var Instr = {
	canvas : undefined,
	canvasContext : undefined,
	backgroundMusic : undefined,
	
	//added to have background
	backgroundSprite : undefined,
	backgroundSpritePosition : { x :0, y :0 },
	
		
	img : undefined,
	imageW : 100.56, // 183.25,
	imageH : 122,
	cycle : 0,
	positionX : 50,
	positionY : 480,
	
	KeyDownStatus : false,
	keyboard : { keyDown : -1 },
	keys : {
    A: 65,     B: 66,      C: 67,      D: 68,       E: 69,      F: 70,
    G: 71,     H: 72,      I: 73,      J: 74,       K: 75,      L: 76,
    M: 77,     N: 78,      O: 79,      P: 80,       Q: 81,      R: 82,
    S: 83,     T: 84,      U: 85,      V: 86,       W: 87,      X: 88,
    Y: 89,     Z: 90, 	   LA:37,      UA:38, 	    RA:39,      DA:40, SP : 32,
    
}
}

function handleKeyDown(evt) {
	
    Game1.keyboard.keyDown = evt.keyCode;
	
}

function handleKeyUp(evt) {
	if(evt.keyCode===32)
	 {
     Game1.keyboard.keyDown = -1;
	 Game1.KeyDownStatus = false; 
    }
	else {
		Game1.keyboard.keyDown = -1;
	}
    
}
Game1.start = function () 
{      
	  
	Game1.canvas = document.getElementById('myCanvas');
	Game1.canvasContext = Game1.canvas.getContext('2d');
	
	Game1.img = document.createElement("img");
	Game1.img.src = "pigeon.png";
	
	//added, to make background move
    Game1.backgroundSprite = new Image();
    Game1.backgroundSprite.src = "stars.png";
	
	//window.addEventListener("mousedown", Game1.startJump, false);
	//window.addEventListener("mouseup", Game1.endJump, false);
	
	document.onkeydown = handleKeyDown;
	document.onkeyup = handleKeyUp;
	
	//putting in background music
	Game1.backgroundMusic = new Audio();
    Game1.backgroundMusic.src = "killa.mp3";
    
    
    
    Game1.backgroundMusic.volume = 0.4; // goes between 0.0-1
    Game1.backgroundMusic.play();
	
	
	
	Game1.mainLoop();
};
//document.addEventListener( 'DOMContentLoaded', Game1.start);

Game1.clearCanvas = function () {
    Game1.canvasContext.clearRect(0, 0, Game1.canvas.width, Game1.canvas.height);
};

Game1.drawImage = function (sprite, position) {
    Game1.canvasContext.save();
    Game1.canvasContext.translate(position.x, position.y);
    Game1.canvasContext.drawImage(sprite, 0, 0, sprite.width, sprite.height,
        0, 0, sprite.width, sprite.height);
    Game1.canvasContext.restore();
};

Game1.mainLoop = function() {
    Game1.clearCanvas();
    Game1.update();
    Game1.draw();
    window.setTimeout(Game1.mainLoop, 1000 / 60);
};

Game1.update = function () 
{ 
	Game1.velocityY += Game1.gravity;
    Game1.positionY += Game1.velocityY;
    
    if(Game1.positionY > 450)//added this to stop space pigeon hiding below the screen. keeps Game1 inside the canvas
    {
        Game1.positionY = 450;
        Game1.velocityY = 0.0;
        Game1.onGround = true;
    }
    
    if(Game1.positionY < 0)//added this to stop space pigeon hiding above the screen. keeps Game1 inside the canvas
    {
        Game1.positionY = 0;
        Game1.velocityY = 0.0;
        Game1.onGround = true;
    }
    
    //move rectangles
    //Game1.rectanglePositionX++;
    Game1.rectangle1PositionX -=5;
	Game1.rectangle2PositionX -=5;
	Game1.rectangle3PositionX -=5;
	Game1.rectangle4PositionX -=5;
	Game1.rectangle5PositionX -=5;
	Game1.rectangle6PositionX -=5;
	  Game1.rectangle7PositionX -=5;
	Game1.rectangle8PositionX -=5;
	Game1.rectangle9PositionX -=5;
	Game1.rectangle10PositionX -=5;
	Game1.rectangle11PositionX -=5;
	Game1.rectangle12PositionX -=5;
	  Game1.rectangle13PositionX -=5;
	Game1.rectangle14PositionX -=5;
	Game1.rectangle15PositionX -=5;
	Game1.rectangle16PositionX -=5;
	Game1.rectangle17PositionX -=5;
	Game1.rectangle18PositionX -=5;
	  Game1.rectangle19PositionX -=5;
	Game1.rectangle20PositionX -=5;
	Game1.rectangle21PositionX -=5;
	Game1.rectangle22PositionX -=5;
	Game1.rectangle23PositionX -=5;
	Game1.rectangle24PositionX -=5;
	Game1.rectangle25PositionX -=5;
	
	/* all this 'if' statement is if we want the green things to come through again. but that makes it repetitive. leave for now until better idea how to use them.
	
	if(Game1.rectangle1PositionX<=-100){
		
		Game1.rectangle1PositionY = 0  //Math.floor((Math.random() * 200) + 1);
		   //Game1.rectangle1PositionY+ Math.floor((Math.random() * 200) + 1);
		Game1.rectangle1PositionX=800;
		
		//console.log(Game1.rectangle1PositionX);
		console.log(Game1.rectangle2PositionY);
	}
	
	if(Game1.rectangle2PositionX<=-100 ){
		Game1.rectangle2PositionY+ Math.floor((Math.random() * 200) + 1);
		Game1.rectangle2PositionX=800;
		
	}

    if(Game1.rectangle3PositionX<=-100 ){
		Game1.rectangle3PositionY+ Math.floor((Math.random() * 200) + 1);
		Game1.rectangle3PositionX=800;
		
	}
	if(Game1.rectangle4PositionX<=-100 ){
		Game1.rectangle4PositionY+ Math.floor((Math.random() * 200) + 1);
		Game1.rectangle4PositionX=800;
		
	}

    if(Game1.rectangle5PositionX<=-100 ){
		Game1.rectangle5PositionY+ Math.floor((Math.random() * 200) + 1);
		Game1.rectangle5PositionX=800;
		
	}
    if(Game1.rectangle6PositionX<=-100 ){
		Game1.rectangle6PositionY+ Math.floor((Math.random() * 200) + 1);
		Game1.rectangle6PositionX=800;
		
	}

  */
  
  //bounding box collision detection algorithm 
	/*A bounding box collision detection algorithm takes two objects 
	and checks to see if the bounds of the first object are within the bounds of the second object. 
	It requires four checks, one for each edge of the bounding box*/
	//-------------------------
	/* if (Game1.img.x < Game1.rect1.x + Game1.rect1.w &&
        Game1.img.x + Game1.img.w > Game1.rect1.x &&
        Game1.img.y < Game1.rect1.y + Game1.rect1.h &&
        Game1.img.h + Game1.img.y > Game1.rect1.y) {
        // collision detected!
		collisionColour1="red";
		collisionColour2="red";
        console.log("collisions detected");
    } else {
        // no collision
		collisionColour1="Blue";
		collisionColour2="green";
        console.log("No collisions yet");
	
	//-------------------------
	}
  */
  
  
  
    
    
 Game1.movingBackground();
 Game1.makeJumpWithKey();
 Game1.endJump();
 Game1.volumeControl();
};

Game1.draw = function () 
{ 
 
 
  
 
	   Game1.drawImage(Game1.backgroundSprite, Game1.backgroundSpritePosition);
		   
    Game1.canvasContext.fillStyle = "white";
    Game1.canvasContext.fillRect(Game1.rectangle25PositionX, Game1.rectangle25PositionY, 100, 480);//finish line positioned here to be above bg, below pigeon on screen
		   Game1.canvasContext.drawImage(Game1.img,Game1.positionX, 
		   Game1.positionY)// pigeon
		   
		   
		   //size of the rectangles

	Game1.canvasContext.fillStyle = "green";
    Game1.canvasContext.fillRect(Game1.rectangle1PositionX, Game1.rectangle1PositionY, 100, 50);
	Game1.canvasContext.fillStyle = "green";
    Game1.canvasContext.fillRect(Game1.rectangle2PositionX, Game1.rectangle2PositionY, 100, 350);//1 high
    
    Game1.canvasContext.fillStyle = "green";
    Game1.canvasContext.fillRect(Game1.rectangle3PositionX, Game1.rectangle3PositionY, 100, 300);
    Game1.canvasContext.fillStyle = "green";
    Game1.canvasContext.fillRect(Game1.rectangle4PositionX, Game1.rectangle4PositionY, 100, 350);//2 low
	
	Game1.canvasContext.fillStyle = "green";
	Game1.canvasContext.fillRect(Game1.rectangle5PositionX, Game1.rectangle5PositionY, 100, 50);
    Game1.canvasContext.fillStyle = "green";
    Game1.canvasContext.fillRect(Game1.rectangle6PositionX, Game1.rectangle6PositionY, 100, 350);//3 high 
    
    Game1.canvasContext.fillStyle = "green";
    Game1.canvasContext.fillRect(Game1.rectangle7PositionX, Game1.rectangle7PositionY, 100, 30);
	Game1.canvasContext.fillStyle = "green";
    Game1.canvasContext.fillRect(Game1.rectangle8PositionX, Game1.rectangle8PositionY, 100, 380);//4 high
    
    Game1.canvasContext.fillStyle = "green";
    Game1.canvasContext.fillRect(Game1.rectangle9PositionX, Game1.rectangle9PositionY, 100, 200);
    Game1.canvasContext.fillStyle = "green";
    Game1.canvasContext.fillRect(Game1.rectangle10PositionX, Game1.rectangle10PositionY, 100, 250);//5 middle
	
	Game1.canvasContext.fillStyle = "green";
	Game1.canvasContext.fillRect(Game1.rectangle11PositionX, Game1.rectangle11PositionY, 100, 200);
    Game1.canvasContext.fillStyle = "green";
    Game1.canvasContext.fillRect(Game1.rectangle12PositionX, Game1.rectangle12PositionY, 100, 250);//6 middle
    
    Game1.canvasContext.fillStyle = "green";
    Game1.canvasContext.fillRect(Game1.rectangle13PositionX, Game1.rectangle13PositionY, 100, 40);
	Game1.canvasContext.fillStyle = "green";
    Game1.canvasContext.fillRect(Game1.rectangle14PositionX, Game1.rectangle14PositionY, 100, 350);//7 high
    
    Game1.canvasContext.fillStyle = "green";
    Game1.canvasContext.fillRect(Game1.rectangle15PositionX, Game1.rectangle15PositionY, 100, 250);
    Game1.canvasContext.fillStyle = "green";
    Game1.canvasContext.fillRect(Game1.rectangle16PositionX, Game1.rectangle16PositionY, 100, 350);//8 low
	
	Game1.canvasContext.fillStyle = "green";
	Game1.canvasContext.fillRect(Game1.rectangle17PositionX, Game1.rectangle17PositionY, 100, 250);
    Game1.canvasContext.fillStyle = "green";
    Game1.canvasContext.fillRect(Game1.rectangle18PositionX, Game1.rectangle18PositionY, 100, 250);//9
    
    Game1.canvasContext.fillStyle = "green";
    Game1.canvasContext.fillRect(Game1.rectangle19PositionX, Game1.rectangle19PositionY, 100, 200);
	Game1.canvasContext.fillStyle = "green";
    Game1.canvasContext.fillRect(Game1.rectangle20PositionX, Game1.rectangle20PositionY, 100, 100);//10
    
    Game1.canvasContext.fillStyle = "green";
    Game1.canvasContext.fillRect(Game1.rectangle21PositionX, Game1.rectangle21PositionY, 100, 200);
    Game1.canvasContext.fillStyle = "green";
    Game1.canvasContext.fillRect(Game1.rectangle22PositionX, Game1.rectangle22PositionY, 100, 250);
	
	Game1.canvasContext.fillStyle = "green";
	Game1.canvasContext.fillRect(Game1.rectangle23PositionX, Game1.rectangle23PositionY, 100, 250);
    Game1.canvasContext.fillStyle = "green";
    Game1.canvasContext.fillRect(Game1.rectangle24PositionX, Game1.rectangle24PositionY, 100, 250);
   
   
}
// function to toggle volume  press V for pause volume and C to play sound.
Game1.volumeControl = function(){
	switch(Game1.keyboard.keyDown)
	{
		case Game1.keys.P :
			Game1.backgroundMusic.pause();
			console.log("pause")
			
		break;
		
		case Game1.keys.S :
			Game1.backgroundMusic.play();
		
		break;
		
		case Game1.keys.Q :
		if(Game1.backgroundMusic.volume<=0.9){
		  Game1.backgroundMusic.volume +=0.01;//changed the increase to 0.01 rather than 0.1. more gentle increase in volume
		}
		break;
		
		case Game1.keys.A :
		if(Game1.backgroundMusic.volume>=0.01){//allow it to go almost silent!
		 Game1.backgroundMusic.volume -=0.01;//changed the decrease to 0.01 rather than 0.1. more gentle decrease in volume
		}
		break;
	
	
	}
}

Game1.startJump = function()
{
    if(Game1.onGround)
    {
        Game1.velocityY = -50.0;
		console.log(Game1.velocityY)
        Game1.onGround = true;//changed this to true, to get the flappy bird effect of being able to jump, even when not on the ground. flying, in essence.
    }
}


Game1.endJump = function ()
{
    if(Game1.velocityY < -7.0)//these control the jump/flying boost for the pigeon
        Game1.velocityY = -7.0;
}

 Game1.makeJumpWithKey = function(){
	
	if(Game1.keyboard.keyDown === Game1.keys.SP ){
		if (!Game1.KeyDownStatus){
		Game1.startJump();
		Game1.KeyDownStatus = true;//jump!
		
		}
	}
}

// function to move background image. 
Game1.movingBackground = function (){
	
	Game1.backgroundSpritePosition.x --;
			Game1.drawImage(Game1.backgroundSprite, Game1.backgroundSpritePosition.x--,0);
			if( Game1.backgroundSpritePosition.x <= -800){
				 Game1.backgroundSpritePosition.x = 0;
			}
}
		


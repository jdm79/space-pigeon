"use strict";

var Game = {
	canvas : undefined,
	canvasContext : undefined,
	backgroundMusic : undefined,
	
	//flagPos: {x:6000, y:0},
	//flagImg: undefined,
	
	//added to have background
	backgroundSprite : undefined,
	backgroundSpritePosition : { x :0, y :0 },
	
	velocityX : 4.0,
	velocityY : 4.0,
	gravity : 0.5,
	onGround : false,
	
	//explosion
	explode : undefined,
	fireBall : undefined,
	fireBallPos : {x : 0, y : 0},
	collisionStatus : false,
	
	//stuff for end of game
	notificationPanel : new Image(),
	levelFinished : false, // to on/off level completion - means killed all the enemies.
	enemyTouchedGround : false,
	
	
	
	BtnPos: {x:350, y:340},
	BtnImg: undefined,
	PanelPos: {x:220, y:230},
	PanelImg: undefined,
	
	//rectangle positions
	//rectangle1PositionX : 1000, 
	//rectangle1PositionY : 0,
	//rectangle1W: 100,
	//rectangle1H: 50,
	
	
	rect1 : { "id":"Rect1",x: 1000, y: 0, w: 100, h: 70},//high
	rect2 : { "id":"Rect2",x: 1000, y: 200, w: 100, h: 280},
	
	rect3 : { x: 1400, y: 0, w: 100, h: 310 },//low
	rect4 : { x: 1400, y: 440, w: 100, h: 40 },
	
	rect5 : { x: 1800, y: 0, w: 100, h: 90},//high
	rect6 : { x: 1800, y: 220, w: 100, h: 260},
	
	rect7 : { x: 2200, y: 0, w: 100 , h: 170},
	rect8 : { x: 2200, y: 300, w: 100, h: 180},

	rect9 : { x: 2600, y: 0, w: 100, h: 100},
	rect10 : { x: 2600, y: 230, w: 100, h: 250},
	
	rect11 : { "id":"Rect11",x: 3000, y: 0, w: 100, h: 20},
	rect12 : { "id":"Rect12",x: 3000, y: 150, w: 100, h: 330},
	//random explosion happening here for some reason - UPDATE 3/9/15 - bug gone by eliminating the big drop. having gap high there. just gone...no idea.
	rect13 : { "id":"Rect13",x: 3450, y: 0, w: 100, h: 120},
	rect14 : { "id":"Rect14",x: 3450, y: 250, w: 100, h: 230},
	
	rect15 : { x: 3900, y: 0, w: 100, h: 20},
	rect16 : { x: 3900, y: 150, w: 100, h: 330},
	
	rect17 : { x: 4300, y: 0, w: 100, h: 40},
	rect18 : { x: 4300, y: 170, w: 100, h: 310},
	
	rect19 : { x: 4700, y: 0, w: 100, h: 100},
	rect20 : { x: 4700, y: 230, w: 100, h: 250},
	
	rect21 : { x: 5100, y: 0, w: 500, h: 10},
	rect22 : { x: 5100, y: 330, w: 500, h: 150},
	
	rect23 : { x: 5500, y: 0, w: 300, h: 30},
	rect24 : { x: 5500, y: 140, w: 300, h: 350},
	
	rect25 : { x: 6000, y: 0, w: 100, h: 480},//finish line
	
	
	
	
	
	
	
	img : undefined, //will bring its own h and w, due to inherent qualities of the image
	//imageW : 100.56, // 183.25,
	//imageH : 122,
	cycle : 0,
	imgPos : {x: 0, y:0},
	//positionX : 50,
	//positionY : 480,
	
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
	
    Game.keyboard.keyDown = evt.keyCode;
	
}

function handleKeyUp(evt) {
	if(evt.keyCode===32)
	 {
     Game.keyboard.keyDown = 1;
	 Game.KeyDownStatus = false; 
    }else if((evt.keyCode===66) && (Game.collisionStatus=true)){
	    console.log("start screen button clicked")
					 location.reload();
    }
	else {
		Game.keyboard.keyDown = -1;
	}
    
}
Game.start = function () 
{      
	  
	Game.canvas = document.getElementById('myCanvas');
	Game.canvasContext = Game.canvas.getContext('2d');
	document.onmousedown = Game.getMousePos;
	Game.img = document.createElement("img");
	Game.img.src = "assets/pigeon.png";
	
	//added, to make background move
    Game.backgroundSprite = new Image();
    Game.backgroundSprite.src = "assets/stars.png";
	
	//window.addEventListener("mousedown", Game.startJump, false);
	//window.addEventListener("mouseup", Game.endJump, false);
	
	document.onkeydown = handleKeyDown;
	document.onkeyup = handleKeyUp;
	
	//putting in background music
	Game.backgroundMusic = new Audio();
    Game.backgroundMusic.src = "assets/killa.mp3";
    Game.backgroundMusic.volume = 0.4; // goes between 0.0-1
    Game.backgroundMusic.play();
    
    //post-crash sad music
    Game.sadMusic = new Audio();
    Game.sadMusic.src = "assets/sad.mp3";
    Game.sadMusic.volume = 0.6; // goes between 0.0-1
    Game.sadMusic.pause();
    
    // explosion stuff
    Game.explode = new Audio();
	Game.explode.src = "assets/bang.mp3";
	Game.explode.volume = 0.2;
	
	Game.fireBall = new Image()
	Game.fireBall.src = "assets/fireball.png";
	
	Game.PanelImg = new Image();
	Game.PanelImg.src = "assets/panel_big1.png";
	
	Game.BtnImg = new Image();
	Game.BtnImg.src = "assets/b_to_play.png";
	
	
	// the finish line! cheering and menu comes up after 3 seconds offering choice of level 2 or startscreen
	Game.finish = new Audio();
	Game.finish.src = "assets/cheering.mp3";
	Game.finish.volume = 0.8;
	
	Game.mainLoop();
};
//document.addEventListener( 'DOMContentLoaded', Game.start);

Game.clearCanvas = function () {
    Game.canvasContext.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
};

Game.drawImage = function (sprite, position) {
    Game.canvasContext.save();
    Game.canvasContext.translate(position.x, position.y);
    Game.canvasContext.drawImage(sprite, 0, 0, sprite.width, sprite.height,
        0, 0, sprite.width, sprite.height);
    Game.canvasContext.restore();
};

Game.mainLoop = function() {
    Game.clearCanvas();
    Game.update();
    Game.draw();
    window.setTimeout(Game.mainLoop, 1000 / 40);
};

Game.update = function () 
{ 
	
	//Game.removeRect();
	//Game.getMousePos();
	Game.velocityY += Game.gravity;
    Game.imgPos.y += Game.velocityY;
    
    
    if(Game.imgPos.y > 420)//added this to stop space pigeon hiding below the screen. keeps game inside the canvas
    {
        Game.imgPos.x = 0;
        Game.velocityY = -2.0;
        Game.onGround = true;
    }
    
    if(Game.imgPos.y < 0)//added this to stop space pigeon hiding above the screen. keeps game inside the canvas
    {
        Game.imgPos.y = 0;
        Game.velocityY = 0.0;
        Game.onGround = true;
    }
    
    //move rectangles
    //Game.rectanglePositionX++;
    Game.rect1.x -=5;
	Game.rect2.x -=5;
	Game.rect3.x -=5;
	Game.rect4.x -=5;
	Game.rect5.x -=5;
	Game.rect6.x -=5;
	Game.rect7.x -=5;
	Game.rect8.x -=5;
	Game.rect9.x -=5;
	Game.rect10.x -=5;
	Game.rect11.x -=5;
	Game.rect12.x -=5;
	Game.rect13.x -=5;
	Game.rect14.x -=5;
	Game.rect15.x -=5;
	Game.rect16.x -=5;
	Game.rect17.x -=5;
	Game.rect18.x -=5;
	Game.rect19.x -=5;
	Game.rect20.x -=5;
	Game.rect21.x -=5;
	Game.rect22.x -=5;
	Game.rect23.x -=5;
	Game.rect24.x -=5;
	Game.rect25.x -=5;
	
  
  //bounding box collision detection algorithm 
	
	//-------------------------
	 if (Game.imgPos.x < Game.rect1.x + Game.rect1.w &&
        Game.imgPos.x + Game.img.width > Game.rect1.x &&
        Game.imgPos.y < Game.rect1.y + Game.rect1.h &&
        Game.img.height + Game.imgPos.y > Game.rect1.y) {
	        
	         console.log(Game.img+" -  "+Game.rect1.id);
	        Game.explode.play();
			Game.collisionStatus = true;
		
        // collision detected!
		
      console.log("collisions detected");
    
        
    } else {
        // no collision
		
        console.log("No collisions yet ");
       // console.log(Game.imgPos.x, Game.imgPos.y);
        
    
        if (Game.imgPos.x < Game.rect2.x + Game.rect2.w &&
        Game.imgPos.x + Game.img.width > Game.rect2.x &&
        Game.imgPos.y < Game.rect2.y + Game.rect2.h &&
        Game.img.height + Game.imgPos.y > Game.rect2.y) 
        {
        // collision detected!
        console.log(Game.img+" -  "+Game.rect2.id);
        Game.explode.play();
		Game.collisionStatus = true;
		
		console.log("collisions detected");
    } 
    
    if (Game.imgPos.x < Game.rect3.x + Game.rect3.w &&
        Game.imgPos.x + Game.img.width > Game.rect3.x &&
        Game.imgPos.y < Game.rect3.y + Game.rect3.h &&
        Game.img.height + Game.imgPos.y > Game.rect3.y) 
        {
        // collision detected!
        Game.explode.play();
		Game.collisionStatus = true;
        console.log("collisions detected");
    } 
   
    if (Game.imgPos.x < Game.rect4.x + Game.rect4.w &&
        Game.imgPos.x + Game.img.width > Game.rect4.x &&
        Game.imgPos.y < Game.rect4.y + Game.rect4.h &&
        Game.img.height + Game.imgPos.y > Game.rect4.y) 
        {
        // collision detected!
		Game.explode.play();
		Game.collisionStatus = true;
        console.log("collisions detected");
    } 
    
        if (Game.imgPos.x < Game.rect5.x + Game.rect5.w &&
        Game.imgPos.x + Game.img.width > Game.rect5.x &&
        Game.imgPos.y < Game.rect5.y + Game.rect5.h &&
        Game.img.height + Game.imgPos.y > Game.rect5.y) 
        {
        // collision detected!
        Game.explode.play();
		Game.collisionStatus = true;
		console.log("collisions detected");
    } 
    
    if (Game.imgPos.x < Game.rect6.x + Game.rect6.w &&
        Game.imgPos.x + Game.img.width > Game.rect6.x &&
        Game.imgPos.y < Game.rect6.y + Game.rect6.h &&
        Game.img.height + Game.imgPos.y > Game.rect6.y) 
        {
        // collision detected!
        Game.explode.play();
		Game.collisionStatus = true;
        console.log("collisions detected");
    } 
   
    if (Game.imgPos.x < Game.rect7.x + Game.rect7.w &&
        Game.imgPos.x + Game.img.width > Game.rect7.x &&
        Game.imgPos.y < Game.rect7.y + Game.rect7.h &&
        Game.img.height + Game.imgPos.y > Game.rect7.y) 
        {
        // collision detected!
		Game.explode.play();
		Game.collisionStatus = true;
        console.log("collisions detected");
    } 
    
        if (Game.imgPos.x < Game.rect8.x + Game.rect8.w &&
        Game.imgPos.x + Game.img.width > Game.rect8.x &&
        Game.imgPos.y < Game.rect8.y + Game.rect8.h &&
        Game.img.height + Game.imgPos.y > Game.rect8.y) 
        {
        // collision detected!
        Game.explode.play();
		Game.collisionStatus = true;
		console.log("collisions detected");
    } 
    
    if (Game.imgPos.x < Game.rect9.x + Game.rect9.w &&
        Game.imgPos.x + Game.img.width > Game.rect9.x &&
        Game.imgPos.y < Game.rect9.y + Game.rect9.h &&
        Game.img.height + Game.imgPos.y > Game.rect9.y) 
        {
        // collision detected!
        Game.explode.play();
		Game.collisionStatus = true;
        console.log("collisions detected");
    } 
   
    if (Game.imgPos.x < Game.rect10.x + Game.rect10.w &&
        Game.imgPos.x + Game.img.width > Game.rect10.x &&
        Game.imgPos.y < Game.rect10.y + Game.rect10.h &&
        Game.img.height + Game.imgPos.y > Game.rect10.y) 
        {
        // collision detected!
		Game.explode.play();
		Game.collisionStatus = true;
        console.log("collisions detected");
    } 
    
    if (Game.imgPos.x < Game.rect11.x + Game.rect11.w &&
        Game.imgPos.x + Game.img.width > Game.rect11.x &&
        Game.imgPos.y < Game.rect11.y + Game.rect11.h &&
        Game.img.height + Game.imgPos.y > Game.rect11.y) 
        {
        // collision detected!
        Game.explode.play();
		Game.collisionStatus = true;
		console.log("collisions detected");
		console.log(Game.img+" -  "+Game.rect11.id);
    } 
    
    if (Game.imgPos.x < Game.rect12.x + Game.rect12.w &&
        Game.imgPos.x + Game.img.width > Game.rect12.x &&
        Game.imgPos.y < Game.rect12.y + Game.rect12.h &&
        Game.img.height + Game.imgPos.y > Game.rect12.y) 
        {
        // collision detected!
        Game.explode.play();
		Game.collisionStatus = true;
        console.log("collisions detected");
        console.log(Game.img+" -  "+Game.rect12.id);
    } 
   
    if (Game.imgPos.x < Game.rect13.x + Game.rect13.w &&
        Game.imgPos.x + Game.img.width > Game.rect13.x &&
        Game.imgPos.y < Game.rect13.y + Game.rect13.h &&
        Game.img.height + Game.imgPos.y > Game.rect13.y) 
        {
        // collision detected!
		Game.explode.play();
		Game.collisionStatus = true;
        console.log("collisions detected");
        console.log(Game.img+" -  "+Game.rect13.id);
    } 
    
     if (Game.imgPos.x < Game.rect14.x + Game.rect14.w &&
        Game.imgPos.x + Game.img.width > Game.rect14.x &&
        Game.imgPos.y < Game.rect14.y + Game.rect14.h &&
        Game.img.height + Game.imgPos.y > Game.rect14.y) 
        {
        // collision detected!
        Game.explode.play();
		Game.collisionStatus = true;
		console.log("collisions detected");
		console.log(Game.img+" -  "+Game.rect14.id);
    } 
    
    if (Game.imgPos.x < Game.rect15.x + Game.rect15.w &&
        Game.imgPos.x + Game.img.width > Game.rect15.x &&
        Game.imgPos.y < Game.rect15.y + Game.rect15.h &&
        Game.img.height + Game.imgPos.y > Game.rect15.y) 
        {
        // collision detected!
        Game.explode.play();
		Game.collisionStatus = true;
        console.log("collisions detected");
    } 
   
    if (Game.imgPos.x < Game.rect16.x + Game.rect16.w &&
        Game.imgPos.x + Game.img.width > Game.rect16.x &&
        Game.imgPos.y < Game.rect16.y + Game.rect16.h &&
        Game.img.height + Game.imgPos.y > Game.rect16.y) 
        {
        // collision detected!
		Game.explode.play();
		Game.collisionStatus = true;
        console.log("collisions detected");
    } 
    
        if (Game.imgPos.x < Game.rect17.x + Game.rect17.w &&
        Game.imgPos.x + Game.img.width > Game.rect17.x &&
        Game.imgPos.y < Game.rect17.y + Game.rect17.h &&
        Game.img.height + Game.imgPos.y > Game.rect17.y) 
        {
        // collision detected!
        Game.explode.play();
		Game.collisionStatus = true;
		console.log("collisions detected");
    } 
    
       if (Game.imgPos.x < Game.rect18.x + Game.rect18.w &&
        Game.imgPos.x + Game.img.width > Game.rect18.x &&
        Game.imgPos.y < Game.rect18.y + Game.rect18.h &&
        Game.img.height + Game.imgPos.y > Game.rect18.y) 
        {
        // collision detected!
        Game.explode.play();
		Game.collisionStatus = true;
        console.log("collisions detected");
    } 
    
    if (Game.imgPos.x < Game.rect19.x + Game.rect19.w &&
        Game.imgPos.x + Game.img.width > Game.rect19.x &&
        Game.imgPos.y < Game.rect19.y + Game.rect19.h &&
        Game.img.height + Game.imgPos.y > Game.rect19.y) 
        {
        // collision detected!
        Game.explode.play();
		Game.collisionStatus = true;
        console.log("collisions detected");
    } 
   
    if (Game.imgPos.x < Game.rect20.x + Game.rect20.w &&
        Game.imgPos.x + Game.img.width > Game.rect20.x &&
        Game.imgPos.y < Game.rect20.y + Game.rect20.h &&
        Game.img.height + Game.imgPos.y > Game.rect20.y) 
        {
        // collision detected!
		Game.explode.play();
		Game.collisionStatus = true;
        console.log("collisions detected");
    } 
    
        if (Game.imgPos.x < Game.rect21.x + Game.rect21.w &&
        Game.imgPos.x + Game.img.width > Game.rect21.x &&
        Game.imgPos.y < Game.rect21.y + Game.rect21.h &&
        Game.img.height + Game.imgPos.y > Game.rect21.y) 
        {
        // collision detected!
        Game.explode.play();
		Game.collisionStatus = true;
		console.log("collisions detected");
    } 
    
    if (Game.imgPos.x < Game.rect22.x + Game.rect22.w &&
        Game.imgPos.x + Game.img.width > Game.rect9.x &&
        Game.imgPos.y < Game.rect22.y + Game.rect22.h &&
        Game.img.height + Game.imgPos.y > Game.rect22.y) 
        {
        // collision detected!
        Game.explode.play();
		Game.collisionStatus = true;
        console.log("collisions detected");
    } 
   
    if (Game.imgPos.x < Game.rect23.x + Game.rect23.w &&
        Game.imgPos.x + Game.img.width > Game.rect23.x &&
        Game.imgPos.y < Game.rect23.y + Game.rect23.h &&
        Game.img.height + Game.imgPos.y > Game.rect23.y) 
        {
        // collision detected!
		Game.explode.play();
		Game.collisionStatus = true;
        console.log("collisions detected");
    } 
    
        if (Game.imgPos.x < Game.rect24.x + Game.rect24.w &&
        Game.imgPos.x + Game.img.width > Game.rect24.x &&
        Game.imgPos.y < Game.rect24.y + Game.rect24.h &&
        Game.img.height + Game.imgPos.y > Game.rect24.y) 
        {
        // collision detected!
        Game.explode.play();
		Game.collisionStatus = true;
		console.log("collisions detected");
    } 
    
    if (Game.imgPos.x < Game.rect25.x + Game.rect25.w &&
        Game.imgPos.x + Game.img.width > Game.rect25.x &&
        Game.imgPos.y < Game.rect25.y + Game.rect25.h &&
        Game.img.height + Game.imgPos.y > Game.rect25.y) 
        {
        // collision detected!
        Game.explode.play();
		Game.collisionStatus = true;
        console.log("collisions detected");
    } 
   
   
	
	//-------------------------
	}
  
  
  /*
	  	rectangle1PositionX : 1000, 
	rectangle1PositionY : 0,
	rectangle1W: 100,
	rectangle1H: 50,



img : undefined,
	imageW : 100.56, // 183.25,
	imageH : 122,
	cycle : 0,
	positionX : 50,
	positionY : 480,



*/  
  
  
    
    
 Game.movingBackground();
 Game.makeJumpWithKey();
 Game.endJump();
 Game.volumeControl();
};

/*
Game.removeRect = function(){
if(Game.rect1.x<=0
{
Game.rect1={}; 	
}


Game.rect2.x<=0{
	Game.rect2={}; 
}


Game.rect3.x<=0{
	Game.rect3={};
}


Game.rect4.x<=0{
	Game.rect4={};
}

Game.rect5.x<=0 {
	Game.rect5={}; 
}


Game.rect6.x<=0{
	Game.rect6={};
}


Game.rect7.x<=0{
	Game.rect7={}; 
}

Game.rect8.x<=0{
	Game.rect8={}; 
}

Game.rect9.x<=0{
	Game.rect9={};
}

Game.rect10.x<=0{
	Game.rect10={}; 
}

Game.rect11.x<=0{
	Game.rect11={};
}

Game.rect12.x<=0{
	Game.rect12={};
}

Game.rect13.x<=0{
	Game.rect13={}; 
}

Game.rect14.x<=0{
	Game.rect14={}; 
}

Game.rect15.x<=0{
	Game.rect15={};
}


Game.rect16.x<=0{
	Game.rect16={};
}

Game.rect17.x<=0 {
	Game.rect17={}; 
}


Game.rect18.x<=0{
	Game.rect18={};
}


Game.rect19.x<=0{
	Game.rect19={}; 
}

Game.rect20.x<=0{
	Game.rect20={};
}

Game.rect21.x<=0{
	Game.rect21={};
}

Game.rect22.x<=0{
	Game.rect22={};
}

Game.rect23.x<=0{
	Game.rect23={};
}

Game.rect24.x<=0{
	Game.rect24={};
}


Game.rect25.x<=0  {
	Game.rect25={};
} 
}
		
	*/
	//console.log("rect1 x: "+Game.rect1.x)


Game.draw = function () 
{ 
 
 
  		
 
	   Game.drawImage(Game.backgroundSprite, Game.backgroundSpritePosition);
		   
    Game.canvasContext.fillStyle = "white";
    Game.canvasContext.fillRect(Game.rect25.x, Game.rect25.y, Game.rect25.w, Game.rect25.h);//finish line positioned here to be above bg, below pigeon on screen
    		if(!Game.collisionStatus){
		   Game.canvasContext.drawImage(Game.img,Game.imgPos.x, 
		   Game.imgPos.y)// pigeon
		   };
		   
		   //size of the rectangles

	Game.canvasContext.fillStyle = "#E0D873";
    Game.canvasContext.fillRect(Game.rect1.x, Game.rect1.y, Game.rect1.w, Game.rect1.h);

	Game.canvasContext.fillStyle = "#E0DFDB";
    Game.canvasContext.fillRect(Game.rect2.x, Game.rect2.y, Game.rect2.w, Game.rect2.h);//1 high
    
    Game.canvasContext.fillStyle = "#FBDB0C";
    Game.canvasContext.fillRect(Game.rect3.x, Game.rect3.y, Game.rect3.w, Game.rect3.h);
    Game.canvasContext.fillStyle = "#BCC6CC";
    Game.canvasContext.fillRect(Game.rect4.x, Game.rect4.y, Game.rect4.w, Game.rect4.h);//2 low
	
	Game.canvasContext.fillStyle = "#BFBFBF";
	Game.canvasContext.fillRect(Game.rect5.x, Game.rect5.y, Game.rect5.w, Game.rect5.h);
    Game.canvasContext.fillStyle = "#BFEFFF";
    Game.canvasContext.fillRect(Game.rect6.x, Game.rect6.y, Game.rect6.w, Game.rect6.h);//3 high 
    
    Game.canvasContext.fillStyle = "#7b9095";
    Game.canvasContext.fillRect(Game.rect7.x, Game.rect7.y, Game.rect7.w, Game.rect7.h);
	Game.canvasContext.fillStyle = "#05B8CC";
    Game.canvasContext.fillRect(Game.rect8.x, Game.rect8.y, Game.rect8.w, Game.rect8.h);//4 high
    
    Game.canvasContext.fillStyle = "#5EDA9E";
    Game.canvasContext.fillRect(Game.rect9.x, Game.rect9.y, Game.rect9.w, Game.rect9.h);
    Game.canvasContext.fillStyle = "#6C7B8B";
    Game.canvasContext.fillRect(Game.rect10.x, Game.rect10.y, Game.rect10.w, Game.rect10.h);
	
	Game.canvasContext.fillStyle = "#7b9095";
	Game.canvasContext.fillRect(Game.rect11.x, Game.rect11.y, Game.rect11.w, Game.rect11.h);
    Game.canvasContext.fillStyle = "#00F5FF";
    Game.canvasContext.fillRect(Game.rect12.x, Game.rect12.y, Game.rect12.w, Game.rect12.h);
    
    Game.canvasContext.fillStyle = "#7D7F94";
    Game.canvasContext.fillRect(Game.rect13.x, Game.rect13.y, Game.rect13.w, Game.rect13.h);
	Game.canvasContext.fillStyle = "#BE2625";
    Game.canvasContext.fillRect(Game.rect14.x, Game.rect14.y, Game.rect14.w, Game.rect14.h);
    
    Game.canvasContext.fillStyle = "#00F5FF";
    Game.canvasContext.fillRect(Game.rect15.x, Game.rect15.y, Game.rect15.w, Game.rect15.h);
    Game.canvasContext.fillStyle = "#BDFCC9";
    Game.canvasContext.fillRect(Game.rect16.x, Game.rect16.y, Game.rect16.w, Game.rect16.h);
	
	Game.canvasContext.fillStyle = "#C0D9D9";
	Game.canvasContext.fillRect(Game.rect17.x, Game.rect17.y, Game.rect17.w, Game.rect17.h);
    Game.canvasContext.fillStyle = "#7D7F94";
    Game.canvasContext.fillRect(Game.rect18.x, Game.rect18.y, Game.rect18.w, Game.rect18.h);
    
    Game.canvasContext.fillStyle = "#C76E06";
    Game.canvasContext.fillRect(Game.rect19.x, Game.rect19.y, Game.rect19.w, Game.rect19.h);
	Game.canvasContext.fillStyle = "#CDCDC1";
    Game.canvasContext.fillRect(Game.rect20.x, Game.rect20.y, Game.rect20.w, Game.rect20.h);
    
    Game.canvasContext.fillStyle = "#D9D919";
    Game.canvasContext.fillRect(Game.rect21.x, Game.rect21.y, Game.rect21.w, Game.rect21.h);
    Game.canvasContext.fillStyle = "#787878";
    Game.canvasContext.fillRect(Game.rect22.x, Game.rect22.y, Game.rect22.w, Game.rect22.h);
	
	Game.canvasContext.fillStyle = "#7D7F94";
	Game.canvasContext.fillRect(Game.rect23.x, Game.rect23.y, Game.rect23.w, Game.rect23.h);
    Game.canvasContext.fillStyle = "#7A67EE";
    Game.canvasContext.fillRect(Game.rect24.x, Game.rect24.y, Game.rect24.w, Game.rect24.h);
    
    //Game.canvasContext.drawImage(Game.flagImg, Game.flagPos.x, Game.flagPos.y );
    
    //collision draw function
    if(Game.collisionStatus)
{
	Game.canvasContext.drawImage(Game.fireBall, Game.imgPos.x-5, Game.imgPos.y-18, Game.fireBall.width,
	 Game.fireBall.height)
	 //Game.ST();
	 //Game.movingBackground() = null;//this don't - want to stop background moving
	Game.backgroundMusic.volume=0.0;//this works - there is pause function you can
	Game.sadMusic.play();
	Game.img = {};
	Game.imgPos = {};
			
 

    
		
		Game.canvasContext.drawImage(Game.PanelImg, Game.PanelPos.x, Game.PanelPos.y);
		 
		 Game.canvasContext.font = "20px 'Orator Std'";
		 Game.canvasContext.fillStyle = "white";
	
		 Game.canvasContext.fillText("Pigeon Dead", 350, 280);
		 Game.canvasContext.fillText("Game Over ", 360, 320);
		 Game.canvasContext.fillText("Press B to Blay Again", 300, 360);
		 
		 Game.canvasContext.drawImage(Game.BtnImg, Game.BtnPos.x, Game.BtnPos.y);
		 
		

		
	 }
   
}
// function to toggle volume  press V for pause volume and C to play sound.
Game.volumeControl = function(){
	switch(Game.keyboard.keyDown)
	{
		case Game.keys.P :
			Game.backgroundMusic.pause();
			console.log("pause")
			
		break;
		
		case Game.keys.S :
			Game.backgroundMusic.play();
		
		break;
		
		case Game.keys.Q :
		if(Game.backgroundMusic.volume<=0.9){
		  Game.backgroundMusic.volume +=0.01;//changed the increase to 0.01 rather than 0.1. more gentle increase in volume
		}
		break;
		
		case Game.keys.A :
		if(Game.backgroundMusic.volume>=0.01){//allow it to go almost silent!
		 Game.backgroundMusic.volume -=0.01;//changed the decrease to 0.01 rather than 0.1. more gentle decrease in volume
		}
		break;
	
	
	}
}

Game.startJump = function()
{
    if(Game.onGround)
    {
        Game.velocityY = -50.0;
		console.log(Game.velocityY)
        Game.onGround = true;//changed this to true, to get the flappy bird effect of being able to jump, even when not on the ground. flying, in essence.
    }
}


Game.endJump = function ()
{
    if(Game.velocityY < -7.0)//these control the jump/flying boost for the pigeon
        Game.velocityY = -7.0;
}

 Game.makeJumpWithKey = function(){
	
	if(Game.keyboard.keyDown === Game.keys.SP ){
		if (!Game.KeyDownStatus){
		Game.startJump();
		Game.KeyDownStatus = true;//jump!
		
		}
	}
}

// function to move background image. 
Game.movingBackground = function (){
	
	Game.backgroundSpritePosition.x --;
			Game.drawImage(Game.backgroundSprite, Game.backgroundSpritePosition.x--,0);
			if( Game.backgroundSpritePosition.x <= -800){
				 Game.backgroundSpritePosition.x = 0;
			}
			
}
Game.changeStatus = function(){
	setTimeout(function(){Game.collisionStatus=false}, 1000)
}



//	function handleKeyUp(evt) {
//	if(evt.keyCode===66)
//	 {
     
//	 console.log("start screen button clicked")
//					 location.reload();
//    }
	
//}



Game.getMousePos = function (event){
        var mX = event.clientX - Game.canvas.offsetLeft;
        var mY = event.clientY - Game.canvas.offsetTop;
       
	//   for(var i = 0; i < Game.buttons.length; i++){
            var bi = Game.BtnImg // here bi  means button image  form buttonImages array
			var bp = Game.BtnPos; // here bp means button position form buttons array 
			
			//  checking collision between any buttons and mouse xy
            if(mX >= bp.x && mX < bp.x+bi.width && mY >= bp.y && mY < bp.y+bi.height){
				
					console.log("start screen button clicked")
					 location.reload();
				
					
				// Writing on DOM
				//document.getElementById('status').innerHTML = "Button image : "+Game.buttonImages[i].src+"   : Button Name "+Game.buttons[i].name
				
				
            
		//	}
			
        } 
		
    }

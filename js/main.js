//Game Variables
var ACC = 0.025;
var DEACC = -0.015;
var FRICTION = 0;
var TURNSPEED = 2;
var SHIPSPEEDLIMIT = 2.5;
var FIRE_INTERVAL = 333;
var ASTROID_SPEED = 3;
var EXTRALARGE_CHILDREN = 4;
var LARGE_CHILDREN = 3;
var MEDIUM_CHILDREN = 2;
var RANDOM_EXTRA_CHILDREN = 25;
var ASTROID_START_NUM = 3;
var PROJECTILE_NEG_VEL = .1;
var windowWidth = window.innerWidth - 150;
var windowHeight = window.innerHeight - 50;

//Create Canvas and Drawing Surface
var canvas = document.querySelector("canvas");
var drawingSurface = canvas.getContext("2d");

drawingSurface.canvas.height = windowHeight;
drawingSurface.canvas.width = windowWidth;

document.querySelector('#startingAstroids').value = ASTROID_START_NUM;
document.querySelector('#astroidSpeed').value = ASTROID_SPEED;
document.querySelector('#extraAstroid').value = RANDOM_EXTRA_CHILDREN;
document.querySelector('#fireRate').value = FIRE_INTERVAL;
document.querySelector('#accRate').value = ACC;
document.querySelector('#deaccRate').value = DEACC;
document.querySelector('#turnSpeed').value = TURNSPEED;

//Sprite Array
var sprites = [];
var shots = [];
var astroids = [];
var ships = [];

//Sprite Build Object

var spriteObject = {
	sourceX: 0,
	sourceY: 0,
	sourceWidth: 32,
	sourceHeight: 32,
	r: 0,
	x: 0,
	y: 0,
	vx: 0,
	vy: 0,
	velocity: 0,
	acceleration: 0,
	speedLimit: 5,
	width: 32,
	height: 32,
	visible: true,
	rotation: 180,
	astroidSize: null
};

//Key Codes
var UP = 38;
var DOWN = 40;
var LEFT = 37;
var RIGHT = 39;
var WUP = 87;
var ALEFT = 65;
var SDOWN = 83;
var DRIGHT = 68;
var FIRE = 32;

//Directions and button var
var accelerate = false;
var decelerate = false;
var rotateLeft = false;
var rotateRight = false;
var fire = false;
var currentDirection = 0;

//Spawn Point Array
var spawnsx = [0 + Math.ceil(Math.random()*32),(canvas.width - 128 + Math.ceil(Math.random()*32))];
var spawnsy = [0 + Math.ceil(Math.random()*32),(canvas.height - 128 + Math.ceil(Math.random()*32))]; 
var xspawn = spawnsx[Math.floor(Math.random() * spawnsx.length)];
var yspawn = spawnsy[Math.floor(Math.random() * spawnsy.length)];

//Astroid Sizes
var SMALL = 1;
var MEDIUM = 2;
var LARGE = 3;
var EXTRALARGE = 4;

//time variables
var lastCall = 0;
var updateLoop;

/* <--- Main Program ---> */

//Create Ship
var ship = Object.create(spriteObject);
ship.x = (canvas.width / 2);
ship.y = (canvas.height / 2);
ship.speedLimit = SHIPSPEEDLIMIT;
sprites.push(ship);
ships.push(ship);

//create Astroids
for(var i = 0; i < ASTROID_START_NUM; i++){
	createAstroid(EXTRALARGE,spawnsx[Math.floor(Math.random() * spawnsx.length)],spawnsy[Math.floor(Math.random() * spawnsy.length)]);
}

//Load img sheet
var image = new Image();
image.addEventListener("load", loadHandler, false);
image.src = "imgs/Ship.png";

//CSS UPDATE
document.getElementById("textScreen").style.height = canvas.height + 'px';
document.getElementById("textScreen").style.width = canvas.width + 'px';

document.getElementById("textScreen").style.marginLeft = -canvas.width / 2 + 2 + 'px';
document.getElementById("textScreen").style.marginTop = -canvas.height / 2 + 2 + 'px';

document.getElementById("textScreen").style.lineHeight = canvas.height + 'px';

document.getElementById("canvas").style.marginLeft = -canvas.width / 2 + 2 + 'px';
document.getElementById("canvas").style.marginTop = -canvas.height / 2 + 2 + 'px';

//Add keyboard listeners
window.addEventListener("keydown", function(event) {
	switch(event.keyCode)
	{
	case LEFT:
	case ALEFT:
		rotateLeft = true;
		break;
	case RIGHT:
	case DRIGHT:
		rotateRight = true;
		break;
	case UP:
	case WUP:
		accelerate = true;
		break;
	case DOWN:
	case SDOWN:
		decelerate = true;
		break;
	case FIRE:
		fire = true;
		break;
	}
}, false);

window.addEventListener("keyup", function(event) {
	switch(event.keyCode)
	{
	case LEFT:
	case ALEFT:
		rotateLeft = false;
		break;

	case RIGHT:
	case DRIGHT:
		rotateRight = false;
		break;

	case UP:
	case WUP:
		accelerate = false;
		break;

	case DOWN:
	case SDOWN:
		decelerate = false;
		break;

	case FIRE:
		fire = false;
		break;
	}
}, false);

function loadHandler() {
	update();
}

function update() {
	//Animation Loop
	updateLoop = window.requestAnimationFrame(update, canvas);

	//Accelerate
	if(accelerate && !decelerate) {
		ship.acceleration = ACC;
		currentDirection = ship.rotation;
		currentVel = ship.velocity
	}

	//Decelerate
	if(decelerate && !accelerate) {
		ship.acceleration = DEACC;
	}

	//No Acc or DeAcc
	if(!accelerate && !decelerate){
		ship.acceleration = FRICTION;
	}

	//Rotate Left
	if(rotateLeft && !rotateRight) {
		ship.rotation -= TURNSPEED;
	}

	//Rotate Right
	if(rotateRight && !rotateLeft){
		ship.rotation += TURNSPEED;
	}

	if(fire) {
		var now = Date.now();

		if (lastCall + FIRE_INTERVAL < now) {
			lastCall = now;

			var projectile = Object.create(spriteObject);
			projectile.sourceX = 62;
			projectile.sourceY = 0;
			projectile.sourceHeight = 8;
			projectile.sourceWidth = 2;
			projectile.height = 8;
			projectile.width = 2;
			projectile.x = (ship.x) + (ship.width / 2) + (Math.sin(ship.rotation * (-Math.PI / 180)) * 18);
			projectile.y = (ship.y) + (ship.height / 2) + (Math.cos(ship.rotation * (Math.PI / 180)) * 18);
			projectile.rotation = ship.rotation;
			projectile.velocity = (ship.velocity) + (2.5);

			projectile.vx = (Math.sin(projectile.rotation * (-Math.PI / 180)) * (projectile.velocity));
			projectile.vy = (Math.cos(projectile.rotation * (Math.PI / 180)) * (projectile.velocity));

			sprites.push(projectile);
			shots.push(projectile);	

			ship.velocity -= PROJECTILE_NEG_VEL;
		}
	}

	//Calculate the velocity hyptonuse and find the two movement vecetors
	velocityCalc();

	//Remove Shots
	if(shots.length !== 0)
	{
		for(var i = 0; i < shots.length; i++) {
			var sprite = shots[i];

			if(sprite.x + sprite.width < 0)
			{
				removeObject(sprite, sprites);
				removeObject(sprite, shots);
			}
			if(sprite.y + sprite.height < 0)
			{
				removeObject(sprite, sprites);
				removeObject(sprite, shots);
			}
			if(sprite.x > canvas.width)
			{
				removeObject(sprite, sprites);
				removeObject(sprite, shots);
			}
			if(sprite.y > canvas.height)
			{
				removeObject(sprite, sprites);
				removeObject(sprite, shots);
			}
		}
	}

	//Keep astroids on field and do Collison calculations
	if(astroids.length !== 0){
		for(var j = 0; j < astroids.length; j++) {
			var astroidSprite = astroids[j];

			if(shots.length !== 0){
				for(var i = 0; i < shots.length; i++) {
					var sprite = shots[i];

					if (RectCircleCol(astroidSprite, sprite)) {
						if(astroidSprite.astroidSize === SMALL){
							removeObject(astroidSprite,astroids);
							removeObject(astroidSprite,sprites);
							removeObject(sprite, sprites);
							removeObject(sprite, shots);
						}

						else if(astroidSprite.astroidSize === MEDIUM){
							for(var i = 0; i < MEDIUM_CHILDREN; i++){
								createAstroid(SMALL,astroidSprite.x,astroidSprite.y);
							}
							if((Math.random() * 100) < RANDOM_EXTRA_CHILDREN){
								createAstroid(SMALL,astroidSprite.x,astroidSprite.y);
								console.log("Extra!");
							}
							removeObject(astroidSprite,astroids);
							removeObject(astroidSprite,sprites);
							removeObject(sprite, sprites);
							removeObject(sprite, shots);
						}

						else if(astroidSprite.astroidSize === LARGE){
							for(var i = 0; i < LARGE_CHILDREN; i++){
							createAstroid(MEDIUM,astroidSprite.x,astroidSprite.y);
							}
							if((Math.random() * 100) < RANDOM_EXTRA_CHILDREN){
								createAstroid(Math.ceil(Math.random() * 2),astroidSprite.x,astroidSprite.y);
								console.log("Extra!");
							}
							removeObject(astroidSprite,astroids);
							removeObject(astroidSprite,sprites);
							removeObject(sprite, sprites);
							removeObject(sprite, shots);
						}

						else if(astroidSprite.astroidSize === EXTRALARGE){
							for(var i = 0; i < EXTRALARGE_CHILDREN; i++){
							createAstroid(LARGE,astroidSprite.x,astroidSprite.y);
							}
							if(Math.floor(Math.random() * 100) < RANDOM_EXTRA_CHILDREN){
								createAstroid(Math.ceil(Math.random() * 3),astroidSprite.x,astroidSprite.y);
								console.log("Extra!");
							}
							removeObject(astroidSprite,astroids);
							removeObject(astroidSprite,sprites);
							removeObject(sprite, sprites);
							removeObject(sprite, shots);
						}
					}
				}
			}

			//loose game if collide with an astroid
			if (RectCircleCol(astroidSprite, ship)) {
				gameOver();
				document.getElementById("textScreen").innerHTML = "<h1>GAME OVER!</h1>";
				document.getElementById("textScreen").style.visibility = "visible";
			}
		}
	}

	//sprite movement
	if(sprites.length !== 0)
	{
		for(var i = 0; i < sprites.length; i++)
		{
			var sprite = sprites[i];

			sprite.x += sprite.vx;
			sprite.y += sprite.vy;
		}
	}

	//Win game if no more astroids
	if(astroids.length === 0){
		gameOver();
		document.getElementById("textScreen").innerHTML = "<h1>YOU WIN!</h1>";
		document.getElementById("textScreen").style.visibility = "visible";
		
	}

	//Screen repeat for ship
	screenRepeat(ships);
	screenRepeat(astroids);

	//Render
	render();
}

function screenRepeat(spriteArray){
	for(var i = 0; i < spriteArray.length; i++){
		sprite = spriteArray[i];

		if(sprite.x + sprite.width < 0)
		{
		sprite.x = canvas.width;
		}
		if(sprite.y + sprite.height < 0)
		{
		sprite.y = canvas.height;
		}
		if(sprite.x > canvas.width)
		{
		sprite.x = 0 - sprite.width;
		}
		if(sprite.y > canvas.height)
		{
		sprite.y = 0 - sprite.height;
		}
	}
}

function velocityCalc() {
	ship.velocity += ship.acceleration;

	if(ship.velocity > ship.speedLimit) {
		ship.velocity = ship.speedLimit;
	}

	if(ship.velocity <= 0) {
		ship.vx = 0;
		ship.vy = 0;
		ship.acceleration = 0;
		ship.velocity = 0;
	}
	else if(ship.velocity > 0){
		ship.vx = (Math.sin(currentDirection * (-Math.PI / 180)) * ship.velocity);
		ship.vy = (Math.cos(currentDirection * (Math.PI / 180)) * ship.velocity);
	}
}

function render(event) {
	//Clear previous frame
	drawingSurface.clearRect(0,0, canvas.width, canvas.height);

	//Display sprites
	if(sprites.length !== 0)
	{
		for(var i = 0; i < sprites.length; i++)
		{
			var sprite = sprites[i];

			if(sprite.visible)
			{
				//Save the current state of the drawing surface before it's rotated
				drawingSurface.save();
				//Rotate the canvas
				drawingSurface.translate
				(
					Math.floor(sprite.x + (sprite.width / 2)),
					Math.floor(sprite.y + (sprite.width / 2))
				);

				drawingSurface.rotate(sprite.rotation * Math.PI / 180);

				drawingSurface.drawImage
				(
					image,
					sprite.sourceX, sprite.sourceY,
					sprite.sourceWidth, sprite.sourceHeight,
					Math.floor(-sprite.width / 2), Math.floor(-sprite.height / 2),
					sprite.width, sprite.height
				);

				//Restore the drawing surface to its state before it was rotated
				drawingSurface.restore();
			}
		}
	}
}

//create Astroid
function createAstroid(size,x,y) {
	var radius;
	if(size === 1){
		radius = 8;
	}
	else if(size === 2){
		radius = 16;
	}
	else if(size === 3){
		radius = 32;
	}
	else if(size === 4){
		radius = 64;
	}

	var astroid = Object.create(spriteObject);
	astroid.sourceX = 32;
	astroid.sourceY = 32;
	astroid.sourceHeight = 64;
	astroid.sourceWidth = 64;
	astroid.height = (radius * 2);
	astroid.width = (radius * 2);
	astroid.x = x;
	astroid.y = y;
	astroid.r = radius;
	astroid.vx = ((Math.random() * ASTROID_SPEED ) - (ASTROID_SPEED / 2)) / size;
	astroid.vy = ((Math.random() * ASTROID_SPEED ) - (ASTROID_SPEED / 2)) / size;
	astroid.astroidSize = size;
	astroid.rotation = (Math.random() * 360);
	sprites.push(astroid);
	astroids.push(astroid);
}

function startGame() {

	gameOver();

	resetGame();

	loadHandler();

	document.activeElement.blur();

}

function resetGame() {

	drawingSurface.clearRect(0,0, canvas.width, canvas.height);

	document.getElementById("textScreen").style.visibility = "hidden";

	document.getElementById("canvas").focus();

	ASTROID_START_NUM = parseInt(document.querySelector('#startingAstroids').value);
	ASTROID_SPEED = parseInt(document.querySelector('#astroidSpeed').value);
	RANDOM_EXTRA_CHILDREN = parseInt(document.querySelector('#extraAstroid').value);
	FIRE_INTERVAL = parseInt(document.querySelector('#fireRate').value);
	ACC = parseFloat(document.querySelector('#accRate').value);
	DEACC = parseFloat(document.querySelector('#deaccRate').value);
	TURNSPEED = parseFloat(document.querySelector('#turnSpeed').value);

	sprites = [];
	shots = [];
	astroids = [];
	ships = [];

	for(var i = 0; i < ASTROID_START_NUM; i++){
		createAstroid(EXTRALARGE,spawnsx[Math.floor(Math.random() * spawnsx.length)],spawnsy[Math.floor(Math.random() * spawnsy.length)]);
	}
	
	ship = Object.create(spriteObject);
	ship.x = (canvas.width / 2);
	ship.y = (canvas.height / 2);
	ship.speedLimit = SHIPSPEEDLIMIT;
	sprites.push(ship);
	ships.push(ship);

	console.log(ASTROID_START_NUM);
	console.log(FIRE_INTERVAL);
}


function gameOver() {
	if (updateLoop) {
       window.cancelAnimationFrame(updateLoop);
       updateLoop = undefined;
    }
}

function removeObject(objectToRemove, array)
{
	var i = array.indexOf(objectToRemove);
	if ( i !== -1)
	{
		array.splice(i, 1);
	}
}

function RectCircleCol(circle, rect) {
    var distX = Math.abs((circle.x + (circle.width / 2)) - rect.x-rect.width/2);
    var distY = Math.abs((circle.y + (circle.height / 2)) - rect.y-rect.height/2);

    if (distX > (rect.width/2 + circle.r)) { return false; }
    if (distY > (rect.height/2 + circle.r)) { return false; }

    if (distX <= (rect.width/2)) { return true; } 
    if (distY <= (rect.height/2)) { return true; }

    var dx = distX-rect.width/2;
    var dy = distY-rect.height/2;
    return (dx*dx+dy*dy<=(circle.r*circle.r));
}
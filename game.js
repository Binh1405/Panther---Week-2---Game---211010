/*
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com
*/

/* Initialization.
Here, we create and add our "canvas" to the page.
We also load all of our images.
*/

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 512;
canvas.height = 480;
canvas.style.cssText = 'position: relative; margin-top: 3em';
document.getElementById('canvas').appendChild(canvas);

let bg = {};

/**
 * Setting up our characters.
 *
 * Note that hero.x represents the X position of our hero.
 * hero.y represents the Y position.
 * We'll need these values to know where to "draw" the hero.
 * The same goes for the monsters
 *
 */

let hero = { x: canvas.width / 2, y: canvas.height / 2 };
let monsters = [
	{ x: 100, y: 100 },
	{ x: 200, y: 200 },
	{ x: 300, y: 300 },
];

let startTime = Date.now();
const SECONDS_PER_ROUND = 15;
let elapsedTime = 0;

//score update when catching a monster
let score=0;

//see an input box
const input = document.createElement('input')
input.setAttribute("type", "text")
input.setAttribute("placeholder", "put your name here")
document.getElementById("canvas").appendChild(input);

//create a button to submit input
const btn = document.createElement('button')
btn.innerHTML="<i class='fas fa-plus'></i>"
document.getElementById("canvas").appendChild(btn);
btn.addEventListener("click", function(){
	if (input.value !==""){
		addName(input.value)
	}
	input.value="";
})

//create a nameboard to show player's name and points
const nameTable = document.createElement("div");
nameTable.classList.add("nameTable")
nameTable.innerHTML="Your Points"
document.getElementById("canvas").appendChild(nameTable)

//function to add name to the table
function addName(yourName){	
	//create a list of name
	var namePlayer = document.createElement("li") 
	namePlayer.classList.add("namePlayer")
	namePlayer.innerHTML = `${yourName}: ${score}`;
	nameTable.appendChild(namePlayer);
}

function loadImages() {
	bg.image = new Image();//?

	bg.image.onload = function () { 
		// show the background image
		bg.ready = true;
	};
	bg.image.src = 'images/background.png';
	hero.image = new Image();
	hero.image.onload = function () {
		// show the hero image
		hero.ready = true;
	};
	hero.image.src = 'images/hero.png';

	monsters.forEach((monster, i) => {
		monster.image = new Image();
		monster.image.onload = function () {
			// show the monster image
			monster.ready = true;
		};
		monster.image.src = `images/monster_${i + 1}.png`;
	});
}

/**
 * Keyboard Listeners
 * You can safely ignore this part, for now.
 *
 * This is just to let JavaScript know when the user has pressed a key.
 */
let keysPressed = {};
function setupKeyboardListeners() {
	// Check for keys pressed where key represents the keycode captured
	// For now, do not worry too much about what's happening here.
	document.addEventListener(
		'keydown',
		function (e) {
			keysPressed[e.key] = true;
		},
		false
	);

	document.addEventListener(
		'keyup',
		function (e) {
			keysPressed[e.key] = false;
		},
		false
	);
}

/**
 *  Update game objects - change player position based on key pressed
 *  and check to see if the monster has been caught!
 *
 *  If you change the value of 5, the player will move at a different rate.
 */
let update = function () {
	// Update the time.
	elapsedTime = Math.floor((Date.now() - startTime)/1000);

	// console.log(elapsedTime)

	if (keysPressed['ArrowUp']) {
		hero.y -= 5;
	}
	if (keysPressed['ArrowDown']) {
		hero.y += 5;
	}
	if (keysPressed['ArrowLeft']) {
		hero.x -= 5;
	}
	if (keysPressed['ArrowRight']) {
		hero.x += 5;
	}

	// Check if player and monster collided. Our images
	// are 32 pixels big.
	monsters.forEach((monster) => {
		if (hero.x <= monster.x + 32 && monster.x <= hero.x + 32 && hero.y <= monster.y + 32 && monster.y <= hero.y + 32) {
			// Pick a new location for the monster.
			// Change this to place the monster at a new, random location.
			monster.x = Math.floor(Math.random()*(canvas.width-20));
			monster.y = Math.floor(Math.random()*(canvas.height-20));
			score+= 1;
		}
	});
// Hero can move off the canvas and appears in the opposite side
	if (hero.x > canvas.width){
		hero.x = 0 
	} else if(hero.x < 0){
		hero.x = canvas.width
	} else if (hero.y > canvas.height){
		hero.y = 0
	} else if (hero.y < 0){
		hero.y = canvas.height;
	}
}; 

/**
 * This function, render, runs as often as possible.
 */
// let SECONDS_PER_ROUND - elapsedTime
function render() {
	if (bg.ready) {
		ctx.drawImage(bg.image, 0, 0);
	}
	if (hero.ready) {
		ctx.drawImage(hero.image, hero.x, hero.y);
	}
	monsters.forEach((monster) => {
		if (monster.ready) {
			ctx.drawImage(monster.image, monster.x, monster.y);
		}
	});
	ctx.fillText(`Seconds Remaining: ${SECONDS_PER_ROUND - elapsedTime}`, 20, 80);
	ctx.fillText(`Your Score: ${score}`, 20, 50);
	// As a player I have 15 seconds to catch as many monsters as possible
	// if(timeLeft==0){
	// 	alert(`Game over, your score is: ${score}`)
	// 	document.location.reload()
	// }

	// if the timer runs out, can not move the hero
	// if (timeLeft==0){
	// 	e.preventDefault();
	// }

	//[ ] As a player, if the timer runs out I can see a reset button.
	var timeLeft = SECONDS_PER_ROUND - elapsedTime;
	if(timeLeft == 0){
		var reset = document.createElement("button")
		document.getElementById("canvas").appendChild(reset)
		reset.textContent="Reset";
		reset.classList.add("btn-reset")
		reset.setAttribute("type", "reset")
		e.preventDefault();
	//[ ] As a player, if the timer runs out I can press the reset button and start the game over.	
	// reset.addEventListener('click', render())
}
}

	//[ ] As a player, if my score is higher than the previous high score then my score replaces it.

	//[ ] As a player, I can see the history of last scores.

/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our hero and monster)
 * render (based on the state of our game, draw the right things)
 */
function main() {
	update();
	render();
	// Request to do this again ASAP. This is a special method
	// for web browsers.
	requestAnimationFrame(main);
}

// Cross-browser support for requestAnimationFrame.
// Safely ignore this line. It's mostly here for people with old web browsers.
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
loadImages();
setupKeyboardListeners();
main();

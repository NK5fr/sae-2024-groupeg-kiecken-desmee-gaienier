import Player from './player.js';
import Angel from './angels.js';
import { backgrounds } from './imgLoader.js';

const canvas = document.querySelector('.gameCanvas'),
	context = canvas.getContext('2d'),
	canvasResizeObserver = new ResizeObserver(() => resampleCanvas());

const playerName = 'Player';
const playerHealth = 3;
const playerMaxSpeed = 10;
const playerSpawnPoint = {
	x: canvas.width / 2,
	y: canvas.height / 2,
};

const player = new Player(
	playerName,
	playerSpawnPoint.x,
	playerSpawnPoint.y,
	playerMaxSpeed,
	playerHealth
);

canvasResizeObserver.observe(canvas);

function resampleCanvas() {
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
}

let angels = [];
let gameNotFocused = false;

function render() {
	if (!gameNotFocused) {
		context.clearRect(0, 0, canvas.width, canvas.height);
		drawBackground();
		player.render(context);
		angels.forEach(angel => angel.render(context));
		player.missiles.forEach(missile => missile.render(context));
	}
	requestAnimationFrame(render);
}

let backgroundX = 0;
function drawBackground() {
	if (backgroundX <= -backgrounds.stageOne.width) {
		backgroundX = -1;
	}
	context.drawImage(backgrounds.stageOne, backgroundX, 0);
	context.drawImage(
		backgrounds.stageOne,
		backgroundX + backgrounds.stageOne.width,
		0
	);
	backgroundX -= 0.5;
}

function updateGame() {
	player.update(canvas);
	angels.forEach(angel => {
		angel.update(canvas);
		player.checkCollision(angel);
	});
	player.missiles.forEach(missile => {
		missile.update(canvas);
		angels.forEach(angel => {
			missile.checkCollision(angel);
		});
	});
	angels = angels.filter(angel => angel.stats.health > 0);
	player.missiles = player.missiles.filter(missile => missile.stats.health > 0);
}

function spawnAngel() {
	let x = canvas.width;
	let y = Math.floor(Math.random() * canvas.height);
	let speed = 5;
	let health = 1;

	angels.push(new Angel(x, y, speed, health));
}

document.addEventListener('keydown', event => {
	if (event.key === 'Escape') {
		gameNotFocused = !gameNotFocused;
	} else {
		player.onKeyDown(event);
	}
});

document.addEventListener('keyup', event => player.onKeyUp(event));

document.addEventListener('mousedown', event => player.onMouseDown(event));

window.addEventListener('blur', () => (gameNotFocused = true));
window.addEventListener('focus', () => (gameNotFocused = false));

requestAnimationFrame(render);

setInterval(() => {
	if (gameNotFocused) return;
	updateGame();
}, 1000 / 60);
setInterval(() => {
	if (gameNotFocused) return;
	spawnAngel();
}, 1000);

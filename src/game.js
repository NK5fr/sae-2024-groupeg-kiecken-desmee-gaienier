import Player from './player.js';
import { Mars } from './stage.js';

const canvas = document.querySelector('.gameCanvas'),
	context = canvas.getContext('2d'),
	canvasResizeObserver = new ResizeObserver(() => resampleCanvas());

canvasResizeObserver.observe(canvas);

function resampleCanvas() {
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
}

const playerName = 'Player';
const playerHealth = 3;
const playerMaxSpeed = 10;
const playerSpawnPoint = {
	x: canvas.width / 2,
	y: canvas.height / 2,
};

let player = new Player(
	playerName,
	playerSpawnPoint.x,
	playerSpawnPoint.y,
	playerMaxSpeed,
	playerHealth
);

let stage = new Mars(player);

let gameNotFocused = false;
let debug = false;

function renderGame() {
	if (!gameNotFocused) {
		context.clearRect(0, 0, canvas.width, canvas.height);
		stage.renderBackground(context);
		stage.renderProgressionBar(context, canvas);
		player.renderHealthBar(context, canvas);
		stage.renderAngels(context);
		if (player.health > 0) {
			player.render(context);
			player.missiles.forEach(missile => missile.render(context));
		}

		if (debug) drawAllHitboxes();
	}
	requestAnimationFrame(renderGame);
}

function updateGame() {
	console.log(player.health);
	if (stage.stageIsClear()) {
		alert('Stage Clear!');
		stage = new Mars(player);
	}
	if (player.health <= 0) {
		alert('Game Over');
		player = new Player(
			playerName,
			playerSpawnPoint.x,
			playerSpawnPoint.y,
			playerMaxSpeed,
			playerHealth
		);
		stage = new Mars(player);
	}
	if (gameNotFocused) return;
	player.update(canvas);
	stage.update(canvas);
	player.missiles.forEach(missile => missile.checkCollisions(stage.angels));
	player.checkCollisions(stage.angels);
	stage.angels.forEach(angel => {
		if (angel.missiles) {
			player.checkCollisions(angel.missiles);
		}
	});
}

function drawAllHitboxes() {
	player.drawHitbox(context);
	stage.angels.forEach(angel => {
		angel.drawHitbox(context);
		if (angel.missiles)
			angel.missiles.forEach(missile => missile.drawHitbox(context));
	});
	player.missiles.forEach(missile => missile.drawHitbox(context));
}

window.addEventListener('blur', () => (gameNotFocused = true));
window.addEventListener('focus', () => (gameNotFocused = false));

document.addEventListener('keydown', e => {
	if (e.key === 'Escape') {
		gameNotFocused = !gameNotFocused;
	} else if (e.key === 'g') {
		debug = !debug;
	} else {
		player.onKeyDown(e.key);
	}
});

document.addEventListener('keyup', e => player.onKeyUp(e.key));

document.addEventListener('mousedown', e => player.onMouseDown(e));
document.addEventListener('mouseup', e => player.onMouseUp(e));

export default function startGame() {
	requestAnimationFrame(renderGame);
	setInterval(updateGame, 1000 / 60);
	setInterval(() => stage.spawnAngels(canvas, gameNotFocused), 1000);
}

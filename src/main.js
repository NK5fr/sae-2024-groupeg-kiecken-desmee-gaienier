import Player from './player.js';
import { Mars } from './stage.js';

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

let player = new Player(
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

let stage = new Mars(player);
let gameNotFocused = false;

function renderGame() {
	if (!gameNotFocused) {
		context.clearRect(0, 0, canvas.width, canvas.height);
		stage.drawBackground(context);
		player.render(context);
		stage.renderAngels(context);
		player.missiles.forEach(missile => missile.render(context));
		context.beginPath();
		context.rect(canvas.width / 2 - 150, 10, 300, 20);
		context.strokeStyle = 'black';
		context.stroke();
		context.fillStyle = 'green';
		context.fillRect(
			canvas.width / 2 - 150,
			10,
			(stage.numberOfAngelsKilled / stage.numberOfAngels) * 300,
			20
		);
	}
	requestAnimationFrame(renderGame);
}

function updateGame() {
	if (gameNotFocused) return;
	player.update(canvas);
	player.missiles.forEach(missile => {
		missile.update(canvas);
		stage.angels.forEach(angel => {
			missile.checkCollision(angel);
		});
	});
	stage.angels.forEach(angel => {
		angel.update(canvas);
		player.checkCollision(angel);
		angel.missiles.forEach(missile => {
			missile.update(canvas);
			player.checkCollision(missile);
		});
		angel.missiles = angel.missiles.filter(missile => missile.stats.health > 0);
	});
	const angelsKilled = stage.angels.filter(angel => angel.stats.health <= 0);
	stage.numberOfAngelsKilled += angelsKilled.length;
	stage.angels = stage.angels.filter(angel => angel.stats.health > 0);
	player.missiles = player.missiles.filter(missile => missile.stats.health > 0);
	if (stage.stageIsClear()) {
		alert('Stage Clear!');
		stage = new Mars(player);
	}
	if (player.stats.health <= 0) {
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
document.addEventListener('mouseup', event => player.onMouseUp(event));

window.addEventListener('blur', () => (gameNotFocused = true));
window.addEventListener('focus', () => (gameNotFocused = false));

function startGame() {
	requestAnimationFrame(renderGame);
	setInterval(updateGame, 1000 / 60);
	setInterval(() => {
		stage.spawnAngels(canvas, gameNotFocused);
	}, 1000);
}

startGame();

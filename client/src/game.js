import Player from './player.js';
import { Mars } from './stage.js';
import Router from './router.js';
import loadAssets from './assetsLoader.js';

const canvas = document.querySelector('.gameCanvas'),
	context = canvas.getContext('2d'),
	canvasResizeObserver = new ResizeObserver(() => resampleCanvas());

canvasResizeObserver.observe(canvas);

function resampleCanvas() {
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
}

let gameUpdater;
let angelsSpawner;
let gameRenderer;

const playerProperties = {
	health: 5,
	speed: 10,
	damage: 10,
	sprite: {
		left: 'assets/player/left.png',
		idle: 'assets/player/idle.png',
		right: 'assets/player/right.png',
	},
	width: 48,
	height: 96,
	missileType: 'card',
	fireRate: 25,
};

let player;
let stage;

let gameNotFocused = false;
let debug = false;

function renderGame() {
	if (!gameNotFocused) {
		context.clearRect(0, 0, canvas.width, canvas.height);
		stage.renderBackground(context);
		stage.renderProgressionBar(context, canvas);
		player.renderHealthBar(context, canvas.height);
		stage.renderAngels(context);
		if (player.health > 0) {
			player.render(context);
			player.missiles.forEach(missile => missile.render(context));
		}

		if (debug) drawAllHitboxes();
	}
	gameRenderer = requestAnimationFrame(renderGame);
}

function updateGame() {
	if (stage.stageIsClear()) {
		alert('Stage Clear!');
		clearInterval(gameUpdater);
		clearInterval(angelsSpawner);
		cancelAnimationFrame(gameRenderer);
		Router.navigate('/rejouer');
	}
	if (player.health <= 0) {
		alert('Game Over');
		clearInterval(gameUpdater);
		clearInterval(angelsSpawner);
		cancelAnimationFrame(gameRenderer);
		Router.navigate('/rejouer');
	}
	if (gameNotFocused) return;
	player.update(canvas.width, canvas.height);
	stage.update(canvas);
	stage.angels.forEach(angel => {
		if (player.checkCollision(angel)) {
			player.health -= angel.damage;
			angel.health = 0;
		}
		player.missiles.forEach(missile => {
			if (missile.checkCollision(angel)) {
				angel.health -= missile.damage;
				missile.health = 0;
			}
		});
		if (angel.missiles) {
			angel.missiles.forEach(missile => {
				if (player.checkCollision(missile)) {
					player.health -= missile.damage;
					missile.health = 0;
				}
			});
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

export default function startGame() {
	loadAssets().then(() => {
		console.log('Assets loaded');
		player = new Player(100, 100, playerProperties);
		stage = new Mars(player);
		gameRenderer = requestAnimationFrame(renderGame);
		gameUpdater = setInterval(updateGame, 1000 / 60);
		angelsSpawner = setInterval(
			() => stage.spawnAngels(canvas, gameNotFocused),
			1000
		);
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
		document.addEventListener('mouseup', () => player.onMouseUp());
		document.addEventListener('mousemove', e => player.onMouseMove(e));
	});
}

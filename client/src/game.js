import Player from './player.js';
import { Stage } from './stage.js';
import Router from './router.js';
import loadAssets from './assetsLoader.js';

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

class Game {
	#gameUpdater;
	#gameRenderer;
	gameNotFocused = false;
	debug = false;

	constructor() {
		this.canvas = document.querySelector('.gameCanvas');
		this.context = this.canvas.getContext('2d');
		this.canvasResizeObserver = new ResizeObserver(() => this.resampleCanvas());

		this.player = new Player(100, 100, playerProperties);
		this.stage = new Stage();
	}

	resampleCanvas() {
		this.canvas.width = this.canvas.clientWidth;
		this.canvas.height = this.canvas.clientHeight;
	}

	startGame() {
		console.log('Game started');
		this.#gameUpdater = setInterval(updateGame, 1000 / 60);
		this.#gameRenderer = requestAnimationFrame(renderGame);
	}

	stopGame() {
		console.log('Game stopped');
		clearInterval(this.#gameUpdater);
		cancelAnimationFrame(this.#gameRenderer);
	}
}

const game = new Game();

let angelsSpawner;

let player;
let stage;

function renderGame() {
	if (!game.gameNotFocused) {
		game.context.clearRect(0, 0, game.canvas.width, game.canvas.height);
		stage.renderBackground(game.context);
		stage.renderProgressionBar(game.context, game.canvas);
		player.renderHealthBar(game.context, game.canvas.height);
		stage.renderAngels(game.context);
		if (player.health > 0) {
			player.render(game.context);
			player.missiles.forEach(missile => missile.render(game.context));
		}

		if (game.debug) drawAllHitboxes();
	}
	requestAnimationFrame(renderGame);
}

function updateGame() {
	if (stage.stageIsClear()) {
		alert('Stage Clear!');
		game.stopGame();
		clearInterval(angelsSpawner);
		Router.navigate('/rejouer');
	}
	if (player.health <= 0) {
		alert('Game Over');
		game.stopGame();
		clearInterval(angelsSpawner);
		Router.navigate('/rejouer');
	}
	if (game.gameNotFocused) return;
	console.log('Game updated');
	player.update(game.canvas.width, game.canvas.height);
	stage.update(game.canvas);
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
	player.drawHitbox(game.context);
	stage.angels.forEach(angel => {
		angel.drawHitbox(game.context);
		if (angel.missiles)
			angel.missiles.forEach(missile => missile.drawHitbox(game.context));
	});
	player.missiles.forEach(missile => missile.drawHitbox(game.context));
}

window.addEventListener('blur', () => (gameNotFocused = true));
window.addEventListener('focus', () => (gameNotFocused = false));

export default function startGame() {
	loadAssets().then(() => {
		game.startGame();
		console.log('Assets loaded');
		player = new Player(100, 100, playerProperties);
		stage = new Stage();
		angelsSpawner = setInterval(
			() => stage.spawnAngels(game.canvas, game.gameNotFocused),
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

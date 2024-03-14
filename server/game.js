import Player from './player.js';
import { Stage } from './stage.js';
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

export default class Game {
	#gameUpdater;
	#gameRenderer;
	#angelsSpawner;

	gameNotFocused = false;
	debug = false;

	player = [];

	constructor(angelData, playerData, missileData, width, height) {
		this.angelData = angelData;
		this.playerData = playerData;
		this.missileData = missileData;

		this.width = width;
		this.height = height;

		this.player.push(new Player(100, 100, playerProperties));
		this.stage = new Stage(angelData, width, height);

		//this.addListeners();
	}

	addListeners() {
		this.document.addEventListener('keydown', e => {
			if (e.key === 'Escape') {
				this.gameNotFocused = !this.gameNotFocused;
			} else if (e.key === 'g') {
				this.debug = !this.debug;
			} else {
				this.player.forEach(player => player.onKeyDown(e.key));
			}
		});

		this.document.addEventListener('keyup', e => {
			this.player.forEach(player => player.onKeyUp(e.key));
		});
		this.document.addEventListener('mousedown', e => {
			this.player.forEach(player => player.onMouseDown(e));
		});
		this.document.addEventListener('mouseup', () => {
			this.player.forEach(player => player.onMouseUp());
		});
		this.document.addEventListener('mousemove', e => {
			this.player.forEach(player => player.onMouseMove(e));
		});
	}

	addNewPlayer() {
		this.player.push(new Player(100, 100, playerProperties));
		this.addListeners();
		console.log('New player added');
	}

	removePlayer(player) {
		this.player = this.player.filter(p => p !== player);
	}

	drawAllHitboxes() {
		this.player.forEach(player => player.drawHitbox(this.context));
		this.stage.angels.forEach(angel => {
			angel.drawHitbox(this.context);
			if (angel.missiles)
				angel.missiles.forEach(missile => missile.drawHitbox(this.context));
		});
		this.player.forEach(player =>
			player.missiles.forEach(missile => missile.drawHitbox(this.context))
		);
	}

	startGame() {
		console.log('Game started');
		this.#gameUpdater = setInterval(() => {
			updateGame(this);
		}, 1000 / 60);
		this.#angelsSpawner = setInterval(
			() =>
				this.stage.spawnAngels(this.width, this.height, this.gameNotFocused),
			1000
		);
	}

	set gameRenderer(value) {
		this.#gameRenderer = value;
	}

	stopGame() {
		console.log('Game stopped');
		clearInterval(this.#gameUpdater);
		clearInterval(this.#angelsSpawner);
	}
}

function updateGame(gameInstance) {
	console.log('Updating game');
	if (gameInstance.stage.stageIsClear()) {
		gameInstance.stopGame();
		Router.navigate('/rejouer');
	}
	if (gameInstance.player[0].health <= 0) {
		gameInstance.stopGame();
		Router.navigate('/rejouer');
	}
	if (gameInstance.gameNotFocused) return;
	gameInstance.player.forEach(player =>
		player.update(gameInstance.width, gameInstance.height)
	);
	gameInstance.stage.update(gameInstance.canvas);
	gameInstance.stage.angels.forEach(angel => {
		gameInstance.player.forEach(player => {
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
		});
		if (angel.missiles) {
			angel.missiles.forEach(missile => {
				if (gameInstance.player.checkCollision(missile)) {
					gameInstance.player.health -= missile.damage;
					missile.health = 0;
				}
			});
		}
	});
}

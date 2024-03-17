import { io } from '../index.js';
import Player from './player.js';
import { Stage } from './stage.js';

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
	#angelsSpawner;

	gameNotFocused = false;
	debug = false;

	mainPlayer;
	otherPlayers = [];

	constructor(width, height, socketId) {
		this.width = width;
		this.height = height;

		this.socketId = socketId;

		this.stage = new Stage('mars', width, height);

		//this.addListeners();
	}

	addNewPlayer(socketId, playerData) {
		if (socketId === this.socketId) {
			this.mainPlayer = new Player(socketId, 100, 100, playerProperties);
		} else {
			this.otherPlayers.push(new Player(socketId, 100, 100, playerProperties));
		}
	}

	removePlayer(player) {
		this.player = this.player.filter(p => p !== player);
	}

	startGame() {
		this.#gameUpdater = setInterval(() => {
			updateGame(this);
		}, 1000 / 60);
		this.#angelsSpawner = setInterval(
			() =>
				this.stage.spawnAngels(this.width, this.height, this.gameNotFocused),
			1000
		);
	}

	stopGame() {
		clearInterval(this.#gameUpdater);
		clearInterval(this.#angelsSpawner);
	}
}

function updateGame(gameInstance) {
	const stage = gameInstance.stage;
	const mainPlayer = gameInstance.mainPlayer;
	const otherPlayers = gameInstance.otherPlayers;

	if (stage.stageIsClear()) {
		gameInstance.stopGame();
		Router.navigate('/rejouer');
	}
	if (mainPlayer.health <= 0) {
		gameInstance.stopGame();
		Router.navigate('/rejouer');
	}
	if (gameInstance.gameNotFocused) return;
	mainPlayer.update(gameInstance.width, gameInstance.height);
	mainPlayer.missiles.forEach(missile =>
		missile.update(gameInstance.width, gameInstance.height)
	);
	otherPlayers.forEach(player => {
		player.update(gameInstance.width, gameInstance.height);
		player.missiles.forEach(missile =>
			missile.update(gameInstance.width, gameInstance.height)
		);
	});
	/*gameInstance.stage.update(gameInstance.canvas);
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
	});*/
	io.emit('gameUpdate', gameInstance);
}

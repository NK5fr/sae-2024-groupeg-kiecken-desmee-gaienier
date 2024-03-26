import { io } from '../index.js';
import Player from './player.js';
import { Stage } from './stage.js';

const stage = ['jupiter', 'saturn', 'uranus', 'sun'];

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

		this.stages = ['venus', 'earth', 'mars'];
		this.stage = new Stage(this.stages[0], width, height);
	}

	addNewPlayer(socketId, playerData, user) {
		if (socketId === this.socketId) {
			this.mainPlayer = new Player(
				socketId,
				100,
				100,
				playerData.find(p => p.user === user)
			);
		} else {
			this.otherPlayers.push(
				new Player(
					socketId,
					100,
					100,
					playerData.find(p => p.user === user)
				)
			);
		}
	}

	removePlayer(player) {
		this.player = this.player.filter(p => p !== player);
	}

	startGame() {
		this.#gameUpdater = setInterval(() => {
			updateGame(this);
		}, 1000 / 60);
		this.#angelsSpawner = setInterval(() => spawnAngels(this), 1000);
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
		if (
			gameInstance.stages.indexOf(stage.name) ===
			gameInstance.stages.length - 1
		) {
			io.to(gameInstance.socketId).emit('gameEnd');
			return;
		}

		gameInstance.stage = new Stage(
			gameInstance.stages[gameInstance.stages.indexOf(stage.name) + 1],
			gameInstance.width,
			gameInstance.height
		);

		gameInstance.startGame();
	}
	if (mainPlayer.health <= 0) {
		gameInstance.stopGame();
		io.to(gameInstance.socketId).emit('gameEnd');
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
	stage.update(gameInstance.width, gameInstance.height);

	stage.angels.forEach(angel => {
		if (mainPlayer.checkCollision(angel)) {
			mainPlayer.health -= angel.damage;
			angel.health = 0;
		}
		mainPlayer.missiles.forEach(missile => {
			if (missile.checkCollision(angel)) {
				angel.health -= missile.damage;
				missile.health = 0;
			}
		});

		otherPlayers.forEach(player => {
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
				if (mainPlayer.checkCollision(missile)) {
					mainPlayer.health -= missile.damage;
					missile.health = 0;
				}
				otherPlayers.forEach(player => {
					if (player.checkCollision(missile)) {
						player.health -= missile.damage;
						missile.health = 0;
					}
				});
			});
		}
	});
	io.emit('gameUpdate', gameInstance);
}

function spawnAngels(gameInstance) {
	gameInstance.stage.spawnAngels(
		gameInstance.width,
		gameInstance.height,
		gameInstance.gameNotFocused
	);
}

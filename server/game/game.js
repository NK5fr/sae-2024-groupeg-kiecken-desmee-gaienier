import { io } from '../index.js';
import Player from './player.js';
import { Stage } from './stage.js';

const stage = ['venus', 'earth', 'jupiter', 'mars', 'saturn', 'uranus', 'sun'];

export default class Game {
	#gameUpdater;
	#angelsSpawner;

	debug = false;

	constructor(width, height, playerProperties, socketId) {
		this.width = width;
		this.height = height;

		console.log(playerProperties);
		this.owner = playerProperties.userName;
		this.socketId = socketId;

		this.startTime = Date.now();

		this.players = [];
		this.numberOfPlayers = 0;

		this.addNewPlayer(playerProperties, socketId);

		this.stages = stage;
		this.stage = new Stage(this.stages[0], width, height);
	}

	addNewPlayer(playerProperties, socketId) {
		if (this.numberOfPlayers < 4) {
			this.players.push(new Player(100, 100, playerProperties, socketId));
			this.numberOfPlayers++;
			return true;
		}
		return false;
	}

	removePlayer(userName) {
		this.players = this.players.filter(player => player.userName !== userName);
		this.numberOfPlayers--;
	}

	startGame() {
		this.#gameUpdater = setInterval(() => {
			updateGame(this);
		}, 1000 / 60);
		this.#angelsSpawner = setInterval(() => spawnAngels(this), 1000);
	}

	pauseGame() {
		this.players.forEach(player => {
			player.missiles = [];
		});
		this.stage.angels = [];
		this.stage.strandedMissiles = [];
		clearInterval(this.#gameUpdater);
		clearInterval(this.#angelsSpawner);
	}

	stopGame() {
		clearInterval(this.#gameUpdater);
		clearInterval(this.#angelsSpawner);
	}
}

function updateGame(gameInstance) {
	const players = gameInstance.players;
	const stage = gameInstance.stage;

	players.forEach(player => {
		if (player.health <= 0) return;
		player.update(gameInstance.width, gameInstance.height);
	});

	stage.update(players[0]);
	stage.angels.forEach(angel => {
		angel.update(players[0], gameInstance.width, gameInstance.height);
	});
	stage.strandedMissiles.forEach(missile => {
		missile.update(gameInstance.width, gameInstance.height);
	});

	stage.bonus.forEach(bonus => {
		players.forEach(player => {
			if (player.checkCollision(bonus)) {
				player.applyBonus(bonus);
				bonus.health = 0;
			}
		});
	});

	stage.angels.forEach(angel => {
		players.forEach(player => {
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
		if (!angel.missiles) return;
		angel.missiles.forEach(missile => {
			players.forEach(player => {
				if (player.checkCollision(missile)) {
					player.health -= missile.damage;
					missile.health = 0;
				}
			});
		});
	});

	if (stage.stageIsClear()) {
		if (
			gameInstance.stages.indexOf(stage.name) ===
			gameInstance.stages.length - 1
		) {
			gameInstance.stopGame();
			const time = new Date(Date.now() - gameInstance.startTime);
			const formatedTime = `${time.getUTCHours() >= 10 ? time.getUTCHours() : '0' + time.getUTCHours()}
				:${time.getUTCMinutes() >= 10 ? time.getUTCMinutes() : '0' + time.getUTCMinutes()}
				:${time.getUTCSeconds() >= 10 ? time.getUTCSeconds() : '0' + time.getUTCSeconds()}`;

			players.forEach(player => {
				io.to(player.socketId).emit('gameStop', {
					userName: player.userName,
					souls: player.souls,
					time: formatedTime,
					win: true,
				});
			});
			return;
		} else {
			gameInstance.pauseGame();
			players.forEach(player => {
				io.to(player.socketId).emit('stageTransition', stage);
			});
			gameInstance.stage = new Stage(
				gameInstance.stages[gameInstance.stages.indexOf(stage.name) + 1],
				gameInstance.width,
				gameInstance.height
			);
		}
	}

	if (players.length === 0) {
		gameInstance.stopGame();
		players.forEach(player => {
			io.to(player.socketId).emit('gameStop', {
				userName: player.userName,
				souls: player.souls,
			});
		});
		return;
	}

	players.forEach(player => {
		io.to(player.socketId).emit('gameUpdate', gameInstance);
	});
}

function spawnAngels(gameInstance) {
	gameInstance.stage.spawnAngels(gameInstance.width, gameInstance.height);
}

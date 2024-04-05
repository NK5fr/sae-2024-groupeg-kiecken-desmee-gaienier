import { io } from '../index.js';
import Player from './player.js';
import { Stage } from './stage.js';

const stage = ['venus', 'earth', 'jupiter', 'mars', 'saturn', 'uranus', 'sun'];

export default class Game {
	#gameUpdater;
	#angelsSpawner;

	debug = false;

	otherPlayers = [];

	constructor(width, height, playerData, socketId, diff) {
		this.width = width;
		this.height = height;

		this.owner = playerData.user;
		this.socketId = socketId;

		this.diff = diff;

		this.startTime = Date.now();

		this.mainPlayer = new Player(100, 100, playerData, socketId);

		this.stages = stage;
		this.stage = new Stage(this.stages[0], width, height);
	}

	addNewPlayer(playerData, socketId) {
		this.otherPlayers.push(new Player(100, 100, playerData, socketId));
	}

	startGame() {
		this.#gameUpdater = setInterval(() => {
			updateGame(this);
		}, 1000 / 60);
		this.#angelsSpawner = setInterval(() => spawnAngels(this), 1000);
	}

	stopGame() {
		this.mainPlayer.missiles = [];
		this.otherPlayers.forEach(player => {
			player.missiles = [];
		});
		this.stage.angels = [];
		this.stage.strandedMissiles = [];
		clearInterval(this.#gameUpdater);
		clearInterval(this.#angelsSpawner);
	}
}

function updateGame(gameInstance) {
	const stage = gameInstance.stage;
	const mainPlayer = gameInstance.mainPlayer;
	const otherPlayers = gameInstance.otherPlayers;

	mainPlayer.update(gameInstance.width, gameInstance.height);
	otherPlayers.forEach(player => {
		player.update(gameInstance.width, gameInstance.height);
	});
	stage.update(mainPlayer);
	stage.angels.forEach(angel => {
		angel.update(mainPlayer, gameInstance.width, gameInstance.height);
	});
	stage.strandedMissiles.forEach(missile => {
		missile.update(gameInstance.width, gameInstance.height);
	});

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
	stage.bonus.forEach(bonus => {
		if (mainPlayer.checkCollision(bonus)) {
			mainPlayer.applyBonus(bonus);
			bonus.health = 0;
		}
		otherPlayers.forEach(player => {
			if (player.checkCollision(bonus)) {
				player.applyBonus(bonus);
				bonus.health = 0;
			}
		});
	});

	if (stage.stageIsClear()) {
		gameInstance.stopGame();
		if (
			gameInstance.stages.indexOf(stage.name) ===
			gameInstance.stages.length - 1
		) {
			const time = new Date(Date.now() - gameInstance.startTime);
			const formatedTime = `${time.getUTCHours() >= 10 ? time.getUTCHours() : '0' + time.getUTCHours()}:${time.getUTCMinutes() >= 10 ? time.getUTCMinutes() : '0' + time.getUTCMinutes()}:${time.getUTCSeconds() >= 10 ? time.getUTCSeconds() : '0' + time.getUTCSeconds()}`;
			io.to(mainPlayer.socketId).emit('gameStop', {
				user: mainPlayer.user,
				souls: mainPlayer.souls,
				time: formatedTime,
				win: true,
			});
			otherPlayers.forEach(player => {
				io.to(player.socketId).emit('gameStop', {
					user: player.user,
					souls: player.souls,
				});
			});
			return;
		}
		io.to(mainPlayer.socketId).emit('stageTransition', stage);
		otherPlayers.forEach(player => {
			io.to(player.socketId).emit('stageTransition', stage);
		});
		gameInstance.stage = new Stage(
			gameInstance.stages[gameInstance.stages.indexOf(stage.name) + 1],
			gameInstance.width,
			gameInstance.height
		);
	}
	if (mainPlayer.health <= 0) {
		gameInstance.stopGame();
		io.to(mainPlayer.socketId).emit('gameStop', {
			user: mainPlayer.user,
			souls: mainPlayer.souls,
		});
		gameInstance.otherPlayers.forEach(player => {
			io.to(player.socketId).emit('gameStop', {
				user: player.user,
			});
		});
	}
	gameInstance.otherPlayers = otherPlayers.filter(player => player.health > 0);
	io.to(mainPlayer.socketId).emit('gameUpdate', gameInstance);
	gameInstance.otherPlayers.forEach(player => {
		io.to(player.socketId).emit('gameUpdate', gameInstance);
	});
}

function spawnAngels(gameInstance) {
	gameInstance.stage.spawnAngels(gameInstance.width, gameInstance.height);
}

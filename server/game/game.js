import { io } from '../index.js';
import Player from './player.js';
import { Stage } from './stage.js';

const stage = [
	'venus' /*, 'earth', 'jupiter', 'mars', 'saturn', 'uranus', 'sun'*/,
];

export default class Game {
	#gameUpdater;
	#angelsSpawner;

	debug = false;

	constructor(width, height, playerProperties, socketId, diff) {
		this.width = width;
		this.height = height;

		this.owner = playerProperties.userName;
		this.socketId = socketId;

		this.diff = diff;

		this.startTime = Date.now();

		this.players = [];
		this.numberOfPlayers = 0;

		this.addNewPlayer(playerProperties, socketId);

		this.stages = stage;
		this.stage = new Stage(this.stages[0], width, height);

		this.startGame();
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

function updateGame(game) {
	const players = game.players;
	const stage = game.stage;

	players.forEach(player => {
		if (player.health <= 0) return;
		player.update(game.width, game.height);
	});

	stage.update(players[0]);
	stage.angels.forEach(angel => {
		angel.update(players[0], game.width, game.height);
	});
	stage.strandedMissiles.forEach(missile => {
		missile.update(game.width, game.height);
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
		if (game.stages.indexOf(stage.name) === game.stages.length - 1) {
			game.stopGame();
			const time = new Date(Date.now() - game.startTime);
			const formatedTime =
				`${time.getUTCHours() >= 10 ? time.getUTCHours() : '0' + time.getUTCHours()}` +
				`:${time.getUTCMinutes() >= 10 ? time.getUTCMinutes() : '0' + time.getUTCMinutes()}` +
				`:${time.getUTCSeconds() >= 10 ? time.getUTCSeconds() : '0' + time.getUTCSeconds()}`;

			players.forEach(player => {
				io.to(player.socketId).emit('game is stoped', {
					userName: player.userName,
					souls: player.souls,
					time: formatedTime,
					win: true,
				});
			});
			return;
		} else {
			game.pauseGame();
			players.forEach(player => {
				io.to(player.socketId).emit('transition to next stage', game.stage);
			});
			game.stage = new Stage(
				game.stages[game.stages.indexOf(stage.name) + 1],
				game.width,
				game.height
			);
		}
	}

	if (players.length === 0) {
		game.stopGame();
		players.forEach(player => {
			io.to(player.socketId).emit('game is stoped', {
				userName: player.userName,
				souls: player.souls,
			});
		});
		return;
	}

	players.forEach(player => {
		io.to(player.socketId).emit('game is updated', game);
	});
}

function spawnAngels(gameInstance) {
	gameInstance.stage.spawnAngels(gameInstance.width, gameInstance.height);
}

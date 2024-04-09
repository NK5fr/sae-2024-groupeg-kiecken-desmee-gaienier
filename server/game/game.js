import { io } from '../index.js';
import Player from './player.js';
import { Stage } from './stage.js';

const stage = ['venus', 'earth', 'jupiter', 'mars', 'saturn', 'uranus', 'sun'];

const soulsByAngelType = {
	archangel: 150,
	three: 40,
	two: 25,
	one: 10,
};

export default class Game {
	#gameUpdater;
	#angelsSpawner;

	debug = false;

	constructor(width, height, playerProperties, socketId, difficulty) {
		this.width = width;
		this.height = height;

		this.owner = playerProperties.userName;
		this.socketId = socketId;

		this.diffficulty = difficulty;
		// Vous avez remarqué ?

		this.startTime = Date.now();

		this.players = [];
		this.deadPlayers = [];

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

	getNearestPlayer(x, y) {
		if (this.players.length === 0) return undefined;
		if (this.players.length === 1) return this.players[0];
		let nearestPlayer = this.players[0];
		let minDistance = Math.sqrt(
			Math.pow(this.players[0].posX - x, 2) +
				Math.pow(this.players[0].posY - y, 2)
		);
		this.players.forEach(player => {
			const distance = Math.sqrt(
				Math.pow(player.posX - x, 2) + Math.pow(player.posY - y, 2)
			);
			if (distance < minDistance) {
				minDistance = distance;
				nearestPlayer = player;
			}
		});
		return nearestPlayer;
	}

	startGame() {
		this.#gameUpdater = setInterval(() => {
			updateGame(this);
		}, 1000 / 60);
		this.#angelsSpawner = setInterval(
			() => spawnAngels(this, this.diffficulty),
			1000
		);
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
	const deadPlayers = game.deadPlayers;
	const stage = game.stage;

	players.forEach(player => {
		if (player.health <= 0) return;
		player.update(game.width, game.height);
	});

	stage.angels.forEach(angel => {
		if (angel.pattern === 'chaser' || angel.pattern === 'shooter') {
			let nearestPlayer = game.getNearestPlayer(angel.posX, angel.posY);
			angel.update(nearestPlayer, game.width, game.height);
		} else {
			angel.update(game.width, game.height);
		}
	});
	stage.strandedMissiles.forEach(missile => {
		missile.update(game.width, game.height);
	});

	if (stage.archangel) {
		let nearestPlayer = game.getNearestPlayer(
			stage.archangel.posX,
			stage.archangel.posY
		);
		stage.archangel.update(nearestPlayer, game.width, game.height);
	}

	stage.bonus.forEach(bonus => {
		players.forEach(player => {
			if (player.checkCollision(bonus)) {
				player.applyBonus(bonus);
				bonus.health = 0;
			}
		});
	});

	stage.update();

	checkAngelsCollisions(players, stage.angels);

	stage.strandedMissiles.forEach(missile => {
		players.forEach(player => {
			if (player.checkCollision(missile)) {
				player.health -= missile.damage;
				missile.health = 0;
			}
		});
	});

	if (stage.archangel) checkArchangelCollision(players, stage.archangel);

	if (players.some(player => player.health <= 0)) {
		players.forEach(player => {
			if (player.health <= 0) {
				deadPlayers.push(player);
				game.players = players.filter(p => p.userName !== player.userName);
			}
		});
	}

	if (players.length === 0) {
		game.stopGame();
		deadPlayers.forEach(player => {
			io.to(player.socketId).emit('game is stoped', {
				userName: player.userName,
				souls: player.souls,
			});
		});
		return;
	}

	if (stage.stageIsClear() && stage.bossIsDead()) {
		if (game.stages.indexOf(stage.name) === game.stages.length - 1) {
			finishGame(game);
		} else {
			game.pauseGame();
			players.forEach(player => {
				io.to(player.socketId).emit('transition to next stage', game.stage);
			});
			deadPlayers.forEach(player => {
				io.to(player.socketId).emit('transition to next stage', game.stage);
			});
			game.stage = new Stage(
				game.stages[game.stages.indexOf(stage.name) + 1],
				game.width,
				game.height
			);
		}
	} else if (stage.stageIsClear() && !stage.archangel) {
		stage.launchBossFight(game.width, game.height, game.diffficulty);
	}

	players.forEach(player => {
		io.to(player.socketId).emit('game is updated', game);
	});
	deadPlayers.forEach(player => {
		io.to(player.socketId).emit('game is updated', game);
	});
}

function spawnAngels(gameInstance, difficulty) {
	gameInstance.stage.spawnAngels(
		gameInstance.width,
		gameInstance.height,
		difficulty
	);
}

function giveSouls(player, angel) {
	if (angel.species === 'archangel') {
		player.souls += soulsByAngelType.archangel;
	} else player.souls += soulsByAngelType[angel.type];
}

function finishGame(game) {
	const players = game.players;
	const deadPlayers = game.deadPlayers;
	game.stopGame();
	players.forEach(player => {
		io.to(player.socketId).emit('game is stoped', {
			userName: player.userName,
			souls: player.souls,
			time: Date.now() - game.startTime,
			win: true,
		});
	});
	deadPlayers.forEach(player => {
		io.to(player.socketId).emit('game is stoped', {
			userName: player.userName,
			souls: player.souls,
		});
	});
	return;
}

function checkAngelsCollisions(players, angels) {
	angels.forEach(angel => {
		players.forEach(player => {
			if (player.checkCollision(angel)) {
				player.health -= angel.damage;
				angel.health = 0;
			}
			player.missiles.forEach(missile => {
				if (missile.checkCollision(angel)) {
					angel.health -= missile.damage;
					missile.health = 0;
					if (angel.health <= 0) {
						giveSouls(player, angel);
					}
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
}

function checkArchangelCollision(players, archangel) {
	players.forEach(player => {
		if (player.checkCollision(archangel)) {
			player.health -= archangel.damage;
		}
		player.missiles.forEach(missile => {
			if (missile.checkCollision(archangel)) {
				archangel.health -= missile.damage;
				missile.health = 0;
				if (archangel.health <= 0) {
					giveSouls(player, archangel);
				}
			}
		});
		archangel.missiles.forEach(missile => {
			if (player.checkCollision(missile)) {
				player.health -= missile.damage;
				missile.health = 0;
			}
		});
	});
}

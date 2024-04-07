import Game from '../game/game.js';
import {
	addGame,
	currentGame,
	findGameByOwner,
	findGameByPlayer,
	findPlayerBySocketId,
	playerIsInGameBySocketId,
	playerIsInGameByUserName,
	playerIsOwner,
	removeGameByOwner,
	removeGameBySocketId,
} from '../index.js';
import {
	readPlayersProperties,
	writePlayersProperties,
} from './playerManager.js';

export default function gameManager(socket) {
	socket.on('user start a game', ({ userName, width, height, diff }) => {
		if (playerIsOwner(userName)) return;
		const playersProperties = readPlayersProperties();
		const playerProperties = playersProperties.find(
			p => p.userName === userName
		);
		addGame(new Game(width, height, playerProperties, socket.id, diff));
		socket.emit('game is started', findGameByOwner(userName));
	});

	socket.on('user join a game', ({ hostName, userName }) => {
		if (!playerIsOwner(hostName) && playerIsInGameByUserName(userName)) return;
		const playersProperties = readPlayersProperties();
		const playerProperties = playersProperties.find(
			p => p.userName === userName
		);
		findGameByOwner(hostName).addNewPlayer(playerProperties, socket.id);
		socket.emit('game is started', findGameByOwner(hostName));
	});

	socket.on('stage end his transition', () => {
		const game = currentGame.find(game => game.socketId === socket.id);
		if (!game) return;
		game.startGame();
	});

	socket.on('canvas was resized', ({ width, height }) => {
		const game = currentGame.find(game => game.socketId === socket.id);
		if (game) {
			game.width = width;
			game.height = height;
		}
	});

	socket.on('game is stoped', ({ userName, souls }) => {
		const playersProperties = readPlayersProperties();
		const playerProperties = playersProperties.find(
			p => p.userName === userName
		);
		playerProperties.souls += souls;
		writePlayersProperties(playersProperties);
		if (playerIsOwner(userName)) {
			findGameByOwner(userName).stopGame();
			removeGameByOwner(userName);
		}
	});

	socket.on('disconnect', () => {
		if (playerIsInGameBySocketId(socket.id)) {
			const player = findPlayerBySocketId(socket.id);
			if (playerIsOwner(player.userName)) {
				removeGameByOwner(player.userName);
			} else {
				const game = findGameByPlayer(player.userName);
				game.removePlayer(player.userName);
			}
		}
	});
}

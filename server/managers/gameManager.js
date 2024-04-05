import { readFileSync } from 'fs';
import Game from '../game/game.js';
import { addGame, currentGame, removeGame } from '../index.js';

export default function gameManager(socket) {
	socket.on('user start a game', ({ userName, width, height }) => {
		const playersProperties = readPlayersProperties();
		let game = currentGame.find(g => g.owner === userName);
		if (game) return;
		console.log(playersProperties);
		let playerProperties = playersProperties.find(p => p.userName === userName);
		console.log(playerProperties);
		game = new Game(width, height, playerProperties, socket.id);
		game.startGame();
		addGame(game);
		socket.emit('user start a game', game);
	});

	socket.on('user join a game', ({ hostName, userName }) => {
		const playersProperties = readPlayersProperties();
		let game = currentGame.find(g => g.owner === hostName);
		if (!game) return;
		let playerProperties = playersProperties.find(p => p.userName === userName);
		game.addNewPlayer(playerProperties, socket.id);
		socket.emit('user join a game', game);
	});

	socket.on('stage end his transition', () => {
		const game = currentGame.find(game => game.socketId === socket.id);
		if (!game) return;
		game.startGame();
	});

	socket.on('canvas was resized', data => {
		const game = currentGame.find(game => game.socketId === socket.id);
		if (game) {
			game.width = data.width;
			game.height = data.height;
		}
	});

	socket.on('gameStop', () => {
		removeGame(socket.id);
	});

	socket.on('disconnect', () => {
		removeGame(socket.id);
	});
}

function readPlayersProperties() {
	return JSON.parse(readFileSync('server/data/playersProperties.json', 'utf8'));
}

import { readFileSync } from 'fs';
import Game from '../game/game.js';
import { addGame, currentGame, removeGame } from '../index.js';

export default function gameManager(socket) {
	socket.on('user start a game', ({ user, width, height }) => {
		const playersData = readPlayersData();
		let game = currentGame.find(game => game.user === user);
		if (game) return;
		let player = playersData.find(player => player.user === user);
		game = new Game(width, height, player, socket.id);
		game.startGame();
		addGame(game);
		socket.emit('user start a game', game);
	});

	socket.on('gameJoin', ({ host, user }) => {
		const playersData = readPlayersData();
		let game = currentGame.find(game => game.owner === host);
		if (!game) return;
		let player = playersData.find(player => player.user === user);
		game.addNewPlayer(player, socket.id);
		socket.emit('gameStart', game);
	});

	socket.on('stageChangeEnd', () => {
		const game = currentGame.find(game => game.socketId === socket.id);
		if (!game) return;
		game.startGame();
	});

	socket.on('canvasResampled', data => {
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

function readPlayersData() {
	return JSON.parse(readFileSync('server/data/playerData.json', 'utf8'));
}

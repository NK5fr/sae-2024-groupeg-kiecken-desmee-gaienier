import { readFileSync } from 'fs';
import Game from '../game/game.js';


export default function gameManager(socket, currentGame, playersData) {
	socket.on('gameStart', ({ user, width, height }) => {
		playersData = JSON.parse(
			readFileSync('server/data/playerData.json', 'utf8')
		);
		let game = currentGame.find(game => game.user === user);
		if (game) return;
		let playerData = playersData.find(player => player.user === user);
		game = new Game(width, height, playerData, socket.id);
		game.startGame();
		currentGame.push(game);
		socket.emit('gameStart', game);
	});

	socket.on('stageChangeEnd', () => {
		const game = currentGame.find(game => game.socketId === socket.id);
		if (!game) return;
		game.startGame();
	});

	socket.on('canvasResampled', data => {
		if (currentGame.length === 0) return;
		const game = currentGame.find(game => game.socketId === socket.id);
		if (game) {
			game.width = data.width;
			game.height = data.height;
		}
	});

	socket.on('gameStop', () => {
		const game = currentGame.find(game => game.socketId === socket.id);
		if (!game) return;
		currentGame = currentGame.filter(game => game.socketId !== socket.id);
	});

	socket.on('disconnect', () => {
		const game = currentGame.find(game => game.socketId === socket.id);
		if (game) game.stopGame();
	});
}

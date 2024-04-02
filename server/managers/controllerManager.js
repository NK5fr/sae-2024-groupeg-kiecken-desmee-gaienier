import { currentGame } from '../index.js';

export default function controllerManager(socket) {
	socket.on('playerKeyDown', key => {
		const player = findPlayerBySocketId(socket.id);
		if (!player) return;
		player.onKeyDown(key);
	});

	socket.on('playerKeyUp', key => {
		const player = findPlayerBySocketId(socket.id);
		if (!player) return;
		player.onKeyUp(key);
	});

	socket.on('playerMouseDown', ({ clientX, clientY }) => {
		const player = findPlayerBySocketId(socket.id);
		if (!player) return;
		player.onMouseDown(clientX, clientY);
	});

	socket.on('playerMouseUp', () => {
		const player = findPlayerBySocketId(socket.id);
		if (!player) return;
		player.onMouseUp();
	});

	socket.on('playerMouseMove', ({ clientX, clientY }) => {
		const player = findPlayerBySocketId(socket.id);
		if (!player) return;
		player.onMouseMove(clientX, clientY);
	});
}

function findPlayerBySocketId(socketId) {
	let player;
	currentGame.forEach(game => {
		if (game.mainPlayer.socketId === socketId) player = game.mainPlayer;
		else {
			game.otherPlayers.forEach(p => {
				if (p.socketId === socketId) player = p;
			});
		}
	});
	return player;
}

export default function controllerManager(socket, currentGame) {
	socket.on('playerKeyDown', key => {
		const game = currentGame.find(game => game.socketId === socket.id);
		if (!game) return;
		if (game.mainPlayer.socketId === socket.id) game.mainPlayer.onKeyDown(key);
		else
			game.otherPlayers
				.filter(player => player.socketId === socket.id)
				.forEach(player => player.onKeyDown(key));
	});

	socket.on('playerKeyUp', key => {
		const game = currentGame.find(game => game.socketId === socket.id);
		if (!game) return;
		if (game.mainPlayer.socketId === socket.id) game.mainPlayer.onKeyUp(key);
		else
			game.otherPlayers
				.filter(player => player.socketId === socket.id)
				.forEach(player => player.onKeyUp(key));
	});

	socket.on('playerMouseDown', ({ clientX, clientY }) => {
		const game = currentGame.find(game => game.socketId === socket.id);
		if (!game) return;
		if (game.mainPlayer.socketId === socket.id)
			game.mainPlayer.onMouseDown(clientX, clientY);
		else
			game.otherPlayers
				.filter(player => player.socketId === data.socketId)
				.forEach(player => player.onMouseDown(data.x, data.y));
	});

	socket.on('playerMouseUp', () => {
		const game = currentGame.find(game => game.socketId === socket.id);
		if (!game) return;
		if (game.mainPlayer.socketId === socket.id) game.mainPlayer.onMouseUp();
		else
			game.otherPlayers
				.filter(player => player.socketId === socket.id)
				.forEach(player => player.onMouseUp());
	});

	socket.on('playerMouseMove', ({ clientX, clientY }) => {
		const game = currentGame.find(game => game.socketId === socket.id);
		if (!game) return;
		if (game.mainPlayer.socketId === socket.id)
			game.mainPlayer.onMouseMove(clientX, clientY);
		else
			game.otherPlayers
				.filter(player => player.socketId === socket.id)
				.forEach(player => player.onMouseMove(clientX, clientY));
	});
}

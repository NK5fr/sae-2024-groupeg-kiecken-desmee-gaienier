import http from 'http';
import express from 'express';
import addWebpackMiddleware from './middlewares/addWebpackMiddleware.js';
import { Server as IOServer } from 'socket.io';
import connexion from './connexion.js';
import signin from './signin.js';
import mdp_oublie from './mdp_oublie.js';
import Game from './game.js';
import { readFileSync } from 'fs';

let currentGame = [];

const fileOptions = { root: process.cwd() };
const app = express();
const httpServer = http.createServer(app);
export const io = new IOServer(httpServer);

export const angelData = JSON.parse(
	readFileSync('server/angelData.json', 'utf8')
);

const playerData = JSON.parse(readFileSync('server/playerData.json', 'utf8'));

export const missileData = JSON.parse(
	readFileSync('server/missileData.json', 'utf8')
);

export const stageData = JSON.parse(
	readFileSync('server/stageData.json', 'utf8')
);

io.on('connection', socket => {
	socket.on('login', data => {
		connexion(data);
	});
	socket.on('signin', data => {
		signin(data);
	});
	socket.on('mdp_oublie', data => {
		mdp_oublie(data);
	});
	socket.on('resetPassword', data => {
		console.log('resetPassword', data);
	});

	socket.on('gameStart', data => {
		const game = new Game(data.width, data.height, socket.id);
		game.addNewPlayer(socket.id, playerData);
		game.startGame();
		socket.emit('gameStart', game);
		currentGame.push(game);
	});

	socket.on('playerKeyDown', data => {
		if (currentGame.length === 0) return;
		const game = currentGame.find(game => game.socketId === socket.id);
		if (game.mainPlayer.socketId === data.socketId)
			game.mainPlayer.onKeyDown(data.key);
		else
			game.otherPlayers
				.filter(player => player.socketId === data.socketId)
				.forEach(player => player.onKeyDown(data.key));
	});

	socket.on('playerKeyUp', data => {
		if (currentGame.length === 0) return;
		const game = currentGame.find(game => game.socketId === socket.id);
		if (game.mainPlayer.socketId === data.socketId)
			game.mainPlayer.onKeyUp(data.key);
		else
			game.otherPlayers
				.filter(player => player.socketId === data.socketId)
				.forEach(player => player.onKeyUp(data.key));
	});

	socket.on('playerMouseDown', data => {
		if (currentGame.length === 0) return;
		const game = currentGame.find(game => game.socketId === socket.id);
		if (game.mainPlayer.socketId === data.socketId)
			game.mainPlayer.onMouseDown(data.x, data.y);
		else
			game.otherPlayers
				.filter(player => player.socketId === data.socketId)
				.forEach(player => player.onMouseDown(data.x, data.y));
	});

	socket.on('playerMouseUp', data => {
		if (currentGame.length === 0) return;
		const game = currentGame.find(game => game.socketId === socket.id);
		if (game.mainPlayer.socketId === data.socketId) game.mainPlayer.onMouseUp();
		else
			game.otherPlayers
				.filter(player => player.socketId === data.socketId)
				.forEach(player => player.onMouseUp());
	});

	socket.on('playerMouseMove', data => {
		if (currentGame.length === 0) return;
		const game = currentGame.find(game => game.socketId === socket.id);
		if (game.mainPlayer.socketId === data.socketId)
			game.mainPlayer.onMouseMove(data.x, data.y);
		else
			game.otherPlayers
				.filter(player => player.socketId === data.socketId)
				.forEach(player => player.onMouseMove(data.x, data.y));
	});

	socket.on('canvasResampled', data => {
		if (currentGame.length === 0) return;
		const game = currentGame.find(game => game.socketId === socket.id);
		game.width = data.width;
		game.height = data.height;
	});

	socket.on('gameJoin', data => {
		if (currentGame.length === 0) return;
		const game = currentGame[0].game;
		socket.emit('gameJoin', { socketId: currentGame[0].socketId, game: game });
	});

	socket.on('gameStop', data => {
		currentGame = currentGame.filter(game => game.socketId !== data.socketId);
	});

	socket.on('disconnect', () => {
		currentGame = currentGame.filter(game => game.socketId !== socket.id);
	});
});

addWebpackMiddleware(app);

app.use(express.static('client/public'));

app.get('/:path', (req, res) => {
	res.sendFile('client/public/index.html', fileOptions);
});

app.use((req, res) => {
	res.status(404);
	res.send(
		'<img src="https://cdn.vox-cdn.com/uploads/chorus_asset/file/22312759/rickroll_4k.jpg" style="width: 100%; height: 100%" \\>'
	);
});

let port = process.env.PORT;
if (!port) port = 8000;
httpServer.listen(port, () => {
	console.log(`Server running at http://localhost:${port}/`);
});

import http from 'http';
import express from 'express';
import addWebpackMiddleware from './middlewares/addWebpackMiddleware.js';
import { Server as IOServer } from 'socket.io';
import connexion from './login/connexion.js';
import signin from './login/signin.js';
import mdp_oublie from './login/mdp_oublie.js';
import Game from './game/game.js';
import { readFileSync } from 'fs';
import resetPassword from './login/resetPassword.js';

let currentGame = [];

const fileOptions = { root: process.cwd() };
const app = express();
const httpServer = http.createServer(app);
export const io = new IOServer(httpServer);

export let angelData = JSON.parse(
	readFileSync('server/data/angelData.json', 'utf8')
);
let playersData = JSON.parse(
	readFileSync('server/data/playerData.json', 'utf8')
);
export let missileData = JSON.parse(
	readFileSync('server/data/missileData.json', 'utf8')
);
export let stageData = JSON.parse(
	readFileSync('server/data/stageData.json', 'utf8')
);

io.on('connection', socket => {
	console.log(`New connection: ${socket.id}`);
	socket.on('login', data => {
		connexion(data, socket.id);
	});
	socket.on('signin', data => {
		signin(data, socket.id);
	});
	socket.on('mdp_oublie', data => {
		mdp_oublie(data, socket);
	});
	socket.on('resetPassword', data => {
		//resetPassword(data, socket);
	});
	socket.on('logout', data => {
		deconnexion(data, socket.id);
	});

	socket.on('gameStart', ({ user, width, height }) => {
		let game = currentGame.find(game => game.user === user);
		if (game) return;
		let playerData = playersData.find(player => player.user === user);
		game = new Game(width, height, playerData, socket.id);
		game.startGame();
		currentGame.push(game);
		socket.emit('gameStart', game);
	});

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

	socket.on('canvasResampled', data => {
		if (currentGame.length === 0) return;
		const game = currentGame.find(game => game.socketId === socket.id);
		if (game) {
			game.width = data.width;
			game.height = data.height;
		}
	});

	socket.on('gameStop', () => {
		currentGame = currentGame.filter(game => game.socketId !== socket.id);
	});

	socket.on('disconnect', () => {
		currentGame = currentGame.filter(game => game.socketId !== socket.id);
		console.log(`Disconnected: ${socket.id}`);
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

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
let playerData = JSON.parse(
	readFileSync('server/data/playerData.json', 'utf8')
);
export let missileData = JSON.parse(
	readFileSync('server/data/missileData.json', 'utf8')
);
export let stageData = JSON.parse(
	readFileSync('server/data/stageData.json', 'utf8')
);

io.on('connection', socket => {
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

	socket.on('gameStart', data => {
		let game = currentGame.find(game => game.socketId === socket.id);
		if (!game) {
			game = new Game(data.width, data.height, socket.id);
			game.addNewPlayer(socket.id, playerData, data.user);
			game.startGame();
			currentGame.push(game);
		}
		socket.emit('gameStart', game);
		console.log(currentGame);
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
		if (game) {
			game.width = data.width;
			game.height = data.height;
		}
	});

	socket.on('gameJoin', data => {
		if (currentGame.length === 0) return;
		currentGame[0].addNewPlayer(socket.id, playerData);
		socket.emit('gameStart', currentGame[0]);
	});

	socket.on('gameEnd', data => {
		console.log('gameEnd', data);
		currentGame = currentGame.filter(game => game.socketId !== data.socketId);
		console.log(currentGame);
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

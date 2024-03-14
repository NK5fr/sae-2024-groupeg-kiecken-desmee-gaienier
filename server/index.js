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
const io = new IOServer(httpServer, {
	allowEIO3: true,
});

io.on('connection', socket => {
	console.log(`user connected with id ${socket.id}`);
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

	socket.on('gameStart', () => {
		console.log(`user ${socket.id} started the game`);
		const angelData = readFileSync('server/angelData.json', 'utf8');
		const playerData = readFileSync('server/playerData.json', 'utf8');
		const missileData = readFileSync('server/missileData.json', 'utf8');
		const game = new Game(angelData, playerData, missileData);
		game.startGame();
		currentGame.push({ socketId: socket.id, game: game });
	});

	socket.on('canvasResize', data => {
		console.log(`user ${socket.id} resized the canvas`);
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
		console.log(`user ${data.socketId} stopped the game`);
		currentGame = currentGame.filter(game => game.socketId !== data.socketId);
		console.log(currentGame);
	});

	socket.on('disconnect', () => {
		console.log(`user ${socket.id} disconnected`);
		currentGame = currentGame.filter(game => game.socketId !== socket.id);
		console.log(currentGame);
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

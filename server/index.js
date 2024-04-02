import http from 'http';
import express from 'express';
import addWebpackMiddleware from './middlewares/addWebpackMiddleware.js';
import { Server as IOServer } from 'socket.io';
import { readFileSync, writeFileSync } from 'fs';

import connexionManager from './managers/connexionManager.js';
import controllerManager from './managers/controllerManager.js';
import gameManager from './managers/gameManager.js';
import playerManager from './managers/playerManager.js';
import { scoreManager } from './managers/scoreManager.js';

export let currentGame = [];

const fileOptions = { root: process.cwd() };
const app = express();
const httpServer = http.createServer(app);
export const io = new IOServer(httpServer);

export let angelData = JSON.parse(
	readFileSync('server/data/angelData.json', 'utf8')
);
export let playersData = JSON.parse(
	readFileSync('server/data/playerData.json', 'utf8')
);
export let stageData = JSON.parse(
	readFileSync('server/data/stageData.json', 'utf8')
);
export let skinData = JSON.parse(
	readFileSync('server/data/skinData.json', 'utf8')
);
export let scoreData = JSON.parse(
	readFileSync('server/data/scoreData.json', 'utf8')
);
export let bonusData = JSON.parse(
	readFileSync('server/data/bonusData.json', 'utf8')
);

const usersData = JSON.parse(
	readFileSync('server/data/userData.json', 'utf-8')
);
usersData.forEach(user => {
	user.connexion = false;
});
writeFileSync('server/data/userData.json', JSON.stringify(usersData));

io.on('connection', socket => {
	console.log(`New connection: ${socket.id}`);
	connexionManager(socket);
	controllerManager(socket);
	gameManager(socket);
	playerManager(socket);
	scoreManager(socket, scoreData);
});

export function addGame(game) {
	currentGame.push(game);
	console.log(currentGame);
}

export function removeGame(socketId) {
	currentGame = currentGame.filter(game => game.socketId !== socketId);
	console.log(currentGame);
}

addWebpackMiddleware(app);

app.use(express.static('client/public'));

app.get('/*', (req, res) => {
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

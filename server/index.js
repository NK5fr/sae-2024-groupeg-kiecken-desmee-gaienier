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

export let angelsProperties = JSON.parse(
	readFileSync('server/data/angelsProperties.json', 'utf8')
);
export let bonusProperties = JSON.parse(
	readFileSync('server/data/bonusProperties.json', 'utf8')
);
export let playersProperties = JSON.parse(
	readFileSync('server/data/playersProperties.json', 'utf8')
);
export let scoresData = JSON.parse(
	readFileSync('server/data/scoresData.json', 'utf8')
);
export let skinsProperties = JSON.parse(
	readFileSync('server/data/skinsProperties.json', 'utf8')
);
export let stagesProperties = JSON.parse(
	readFileSync('server/data/stagesProperties.json', 'utf8')
);

const usersProperties = JSON.parse(
	readFileSync('server/data/usersProperties.json', 'utf-8')
);
usersProperties.forEach(u => {
	u.connexion = false;
});
writeFileSync(
	'server/data/usersProperties.json',
	JSON.stringify(usersProperties)
);

io.on('connection', socket => {
	console.log(`New connection: ${socket.id}`);
	connexionManager(socket);
	controllerManager(socket);
	gameManager(socket);
	playerManager(socket);
	scoreManager(socket);

	socket.on('getResourcesToLoad', () => {
		const angels = [];
		Object.keys(angelsProperties).forEach(species => {
			Object.keys(angelsProperties[species]).forEach(type => {
				angels.push({ species, type });
			});
		});
		const bonus = [];
		Object.keys(bonusProperties).forEach(type => {
			bonus.push({ type });
		});
		const missiles = [];
		Object.values(skinsProperties.weaponSkins).forEach(skin => {
			missiles.push({ skin });
		});
		const players = [];
		Object.values(skinsProperties.playerSkins).forEach(skin => {
			players.push({ skin });
		});
		socket.emit('resourcesToLoad', {
			angels,
			bonus,
			missiles,
			players,
		});
	});
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

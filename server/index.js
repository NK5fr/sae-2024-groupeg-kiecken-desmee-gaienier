import http from 'http';
import express from 'express';
import addWebpackMiddleware from './middlewares/addWebpackMiddleware.js';
import { Server as IOServer } from 'socket.io';
import { readFileSync, writeFileSync } from 'fs';
import connexionManager from './managers/connexionManager.js';
import controllerManager from './managers/controllerManager.js';
import gameManager from './managers/gameManager.js';
import playerManager, {
	readPlayersProperties,
} from './managers/playerManager.js';
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
		const stages = [];
		Object.keys(stagesProperties).forEach(stage => {
			stages.push({ stage });
		});
		socket.emit('resourcesToLoad', {
			angels,
			bonus,
			missiles,
			players,
			stages,
		});
	});

	socket.on('client need gamesInfo', () => {
		const gamesInfo = [];
		currentGame.forEach(g => {
			gamesInfo.push({
				hostName: g.owner,
				participants: g.players.length,
			});
		});
		socket.emit('server send gamesInfo', gamesInfo);
	});

	socket.on('client need souls', userName => {
		const playersProperties = readPlayersProperties();
		const playerProperties = playersProperties.find(
			p => p.userName === userName
		);
		socket.emit('server send souls', playerProperties.souls);
	});
});

export function addGame(game) {
	currentGame.push(game);
}

export function removeGameByOwner(owner) {
	currentGame = currentGame.filter(g => g.owner !== owner);
}

export function removeGameBySocketId(socketId) {
	currentGame = currentGame.filter(g => g.socketId !== socketId);
}

export function findGameByOwner(owner) {
	return currentGame.find(g => g.owner === owner);
}

export function findGameByPlayer(userName) {
	return currentGame.find(g => g.players.some(p => p.userName === userName));
}

export function playerIsInGameByUserName(userName) {
	return currentGame.some(g => g.players.some(p => p.userName === userName));
}

export function playerIsInGameBySocketId(socketId) {
	return currentGame.some(g => g.players.some(p => p.socketId === socketId));
}

export function playerIsOwner(userName) {
	return currentGame.some(g => g.owner === userName);
}

export function findPlayerByUserName(userName) {
	let player;
	currentGame.forEach(g => {
		g.players.forEach(p => {
			if (p.userName === userName) player = p;
		});
	});
	return player;
}

export function findPlayerBySocketId(socketId) {
	let player;
	currentGame.forEach(g => {
		g.players.forEach(p => {
			if (p.socketId === socketId) player = p;
		});
	});
	return player;
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

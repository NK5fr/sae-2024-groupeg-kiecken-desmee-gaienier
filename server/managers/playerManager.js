import fs from 'fs';
import { playersData } from '../index.js';

function setCurrentSkin(username, skin, isProj) {
	const player = playersData.find(p => p.user === username);
	if (isProj) {
		player.currentWeapon = skin;
	} else {
		player.currentSkin = skin;
	}
	fs.writeFileSync('server/data/playerData.json', JSON.stringify(playersData));
}

function setSkinsPool(username, skin, isProj) {
	const player = playersData.find(p => p.user === username);
	if (isProj) {
		player.weaponsPool.push(skin);
		player.currentWeapon = skin;
	} else {
		player.skinsPool.push(skin);
		player.currentSkin = skin;
	}
	fs.writeFileSync('server/data/playerData.json', JSON.stringify(playersData));
}

function setStat(username, value, statName) {
	const player = playersData.find(p => p.user === username);
	player[statName] = value;
	fs.writeFileSync('server/data/playerData.json', JSON.stringify(playersData));
}

export default function playerManager(socket, skinData) {
	socket.on('currentSkin', data => {
		setCurrentSkin(data.username, data.skin, data.isProj);
	});

	socket.on('skinsPool', data => {
		setSkinsPool(data.username, data.skin, data.isProj);
	});

	socket.on('stat', data => {
		setStat(data.username, data.value, data.statName);
	});

	socket.on('setCarousel', user => {
		const playerData = playersData.find(player => player.user === user);
		socket.emit('setCarousel', {
			playerData,
			playerSkins: skinData.playerSkins,
			weaponSkins: skinData.weaponSkins,
		});
	});
}

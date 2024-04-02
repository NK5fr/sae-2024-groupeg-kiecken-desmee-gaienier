import { readFileSync, writeFileSync } from 'fs';

function setCurrentSkin(username, skin, isProj) {
	const playersData = readPlayersData();
	const player = playersData.find(p => p.user === username);
	if (isProj) {
		player.currentWeapon = skin;
	} else {
		player.currentSkin = skin;
	}
	writePlayersData(playersData);
}

function setSkinsPool(username, skin, isProj) {
	const playersData = readPlayersData();
	const player = playersData.find(p => p.user === username);
	if (isProj) {
		player.weaponsPool.push(skin);
		player.currentWeapon = skin;
	} else {
		player.skinsPool.push(skin);
		player.currentSkin = skin;
	}
	writePlayersData(playersData);
}

function setStat(username, value, statName) {
	const playersData = readPlayersData();
	const player = playersData.find(p => p.user === username);
	player[statName] = value;
	writePlayersData(playersData);
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
		const playersData = readPlayersData();
		const skinData = readSkinData();
		socket.emit('setCarousel', {
			playerData: playersData.find(p => p.user === user),
			playerSkins: skinData.playerSkins,
			weaponSkins: skinData.weaponSkins,
		});
	});
}

export function readPlayersData() {
	return JSON.parse(readFileSync('server/data/playerData.json', 'utf8'));
}

function readSkinData() {
	return JSON.parse(readFileSync('server/data/skinData.json', 'utf8'));
}

export function writePlayersData(playersData) {
	writeFileSync('server/data/playerData.json', JSON.stringify(playersData));
}

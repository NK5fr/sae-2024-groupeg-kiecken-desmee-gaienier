import { readFileSync, writeFileSync } from 'fs';

export default function playerManager(socket) {
	socket.on('currentSkin', data => {
		setCurrentSkin(data.userName, data.skin, data.isProj);
	});

	socket.on('skinsPool', data => {
		setSkinsPool(data.userName, data.skin, data.isProj);
	});

	socket.on(
		'stat purchase tentative',
		({ userName, statName, value, price }) => {
			socket.emit('stat purchase validation', {
				validate: setStat(userName, statName, value, price),
				statName,
			});
		}
	);

	socket.on('client need playerProperties', userName => {
		const playersProperties = readPlayersProperties();
		const skinsProperties = readSkinsProperties();
		socket.emit('server send playerProperties', {
			playerProperties: playersProperties.find(p => p.userName === userName),
			playerSkins: skinsProperties.playerSkins,
			weaponSkins: skinsProperties.weaponSkins,
		});
	});
}

export function readPlayersProperties() {
	return JSON.parse(readFileSync('server/data/playersProperties.json', 'utf8'));
}

export function writePlayersProperties(playersProperties) {
	writeFileSync(
		'server/data/playersProperties.json',
		JSON.stringify(playersProperties)
	);
}

function readSkinsProperties() {
	return JSON.parse(readFileSync('server/data/skinsProperties.json', 'utf8'));
}

function setCurrentSkin(userName, skin, isProj) {
	const playersProperties = readPlayersProperties();
	const playerProperties = playersProperties.find(p => p.userName === userName);
	if (isProj) {
		playerProperties.currentWeapon = skin;
	} else {
		playerProperties.currentSkin = skin;
	}
	writePlayersProperties(playersProperties);
}

function setSkinsPool(userName, skin, isProj) {
	const playersProperties = readPlayersProperties();
	const playerProperties = playersProperties.find(p => p.userName === userName);
	if (isProj) {
		playerProperties.weaponsPool.push(skin);
		playerProperties.currentWeapon = skin;
	} else {
		playerProperties.skinsPool.push(skin);
		playerProperties.currentSkin = skin;
	}
	writePlayersProperties(playersProperties);
}

function setStat(userName, statName, value, price) {
	const playersProperties = readPlayersProperties();
	const playerProperties = playersProperties.find(p => p.userName === userName);
	if (playerProperties.souls < price) return false;
	playerProperties.souls -= price;
	playerProperties[statName] = value;
	writePlayersProperties(playersProperties);
	return true;
}

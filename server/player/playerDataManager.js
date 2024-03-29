import fs from 'fs';
import { playersData } from '../index.js';

export function setCurrentSkin(username, skin, isProj) {
	const player = playersData.find(p => p.user === username);
	if (isProj) {
		player.currentWeapon = skin;
	} else {
		player.currentSkin = skin;
	}
	fs.writeFileSync('server/data/playerData.json', JSON.stringify(playersData));
}

export function setSkinsPool(username, skin, isProj) {
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

export function setStat(username, value, statName) {
	const player = playersData.find(p => p.user === username);
	player[statName] = value;
	fs.writeFileSync('server/data/playerData.json', JSON.stringify(playersData));
}

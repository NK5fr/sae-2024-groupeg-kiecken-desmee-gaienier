import fs from 'fs';
import { io } from '../index.js';
import { playersData, skinData } from '../index.js';

export default function login(login, password, socketId) {
	const usersData = JSON.parse(
		fs.readFileSync('server/data/userData.json', 'utf-8')
	);
	const user = usersData.find(
		user => user.login == login && user.password == password
	);
	if (user && !user.connexion) {
		const playerData = playersData.find(player => player.user === user.login);
		user.connexion = true;
		fs.writeFileSync('server/data/userData.json', JSON.stringify(usersData));
		io.to(socketId).emit('userLogin', {
			playerData,
			playerSkins: skinData.playerSkins,
			weaponSkins: skinData.weaponSkins,
		});
	} else if (user && user.connexion) {
		io.to(socketId).emit('serverAlert', 'Utilisateur déjà connecté');
	} else {
		io.to(socketId).emit('serverAlert', 'Mot de passe ou login incorrect');
	}
}

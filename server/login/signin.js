import { readFileSync, writeFileSync } from 'fs';
import { io } from '../index.js';
import { playersData, skinData } from '../index.js';

export default function signin(
	login,
	password,
	recoverySentence,
	response,
	socketId
) {
	const usersData = JSON.parse(
		readFileSync('server/data/userData.json', 'utf8')
	);
	let user = usersData.find(user => user.login == login);
	if (user) {
		io.to(socketId).emit('serverAlert', "Nom d'utilisateur déjà utilisé");
	} else {
		user = {
			login,
			password,
			recoverySentence,
			response,
			connexion: false,
		};
		usersData.push(user);
		writeFileSync('server/data/userData.json', JSON.stringify(usersData));
		const player = Object.assign(
			{},
			playersData.find(player => player.user == 'default')
		);
		player.user = login;
		playersData.push(player);
		writeFileSync('server/data/playerData.json', JSON.stringify(playersData));
		io.to(socketId).emit('userLogin', login);
	}
}

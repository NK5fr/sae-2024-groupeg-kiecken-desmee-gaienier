import fs from 'fs';
import { io } from '../index.js';
import { playersData, skinData } from '../index.js';
//import encryptionTool from './encryptionTool.js';

export default function signin(
	login,
	password,
	recoverySentence,
	response,
	socketId
) {
	const usersData = JSON.parse(
		fs.readFileSync('server/data/userData.json', 'utf8')
	);
	let user = usersData.find(user => user.login == login);
	if (user) {
		io.to(socketId).emit('serverAlert', "Nom d'utilisateur déjà utilisé");
	} else {
		//const passwordMD5 = encryptionTool(password);
		user = {
			login,
			//passwordMD5,
			password,
			recoverySentence,
			response,
			connexion: false,
		};
		usersData.push(user);
		fs.writeFileSync('server/data/userData.json', JSON.stringify(usersData));
		const player = Object.assign(
			{},
			playersData.find(player => player.user == 'default')
		);
		player.user = login;
		playersData.push(player);
		fs.writeFileSync(
			'server/data/playerData.json',
			JSON.stringify(playersData)
		);
		io.to(socketId).emit('userLogin', {
			playerData: player,
			playerSkins: skinData.playerSkins,
			weaponSkins: skinData.weaponSkins,
		});
	}
}

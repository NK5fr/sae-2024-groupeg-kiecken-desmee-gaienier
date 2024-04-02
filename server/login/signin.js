import { io } from '../index.js';
import { readUsersData, writeUsersData } from '../managers/connexionManager.js';
import {
	readPlayersData,
	writePlayersData,
} from '../managers/playerManager.js';
//import encryptionTool from './encryptionTool.js';

export default function signin(
	login,
	password,
	recoverySentence,
	response,
	socketId
) {
	const usersData = readUsersData();
	let user = usersData.find(user => user.login == login);
	if (user) {
		io.to(socketId).emit('serverAlert', "Nom d'utilisateur déjà utilisé");
	} else {
		//const cryptPassword = encryptionTool(password);
		user = {
			login,
			//cryptPassword,
			password,
			recoverySentence,
			response,
			connexion: false,
		};
		usersData.push(user);
		writeUsersData(usersData);
		const playersData = readPlayersData();
		const player = Object.assign(
			{},
			playersData.find(player => player.user == 'default')
		);
		player.user = login;
		playersData.push(player);
		writePlayersData(playersData);
		io.to(socketId).emit('userLogin', login);
	}
}

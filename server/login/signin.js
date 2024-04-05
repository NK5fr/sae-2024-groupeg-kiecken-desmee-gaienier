import { io } from '../index.js';
import {
	readUsersProperties,
	writeUsersProperties,
} from '../managers/connexionManager.js';
import {
	readPlayersProperties,
	writePlayersProperties,
} from '../managers/playerManager.js';

export default function signin(
	login,
	password,
	recoverySentence,
	response,
	socketId
) {
	const usersProperties = readUsersProperties();
	if (usersProperties.find(u => u.login == login)) {
		io.to(socketId).emit('server send alert', "Nom d'utilisateur déjà utilisé");
	} else {
		const userProperties = {
			login,
			password,
			recoverySentence,
			response,
			connexion: false,
		};
		usersProperties.push(userProperties);
		writeUsersProperties(usersProperties);

		const playersProperties = readPlayersProperties();
		const playerProperties = Object.assign(
			{},
			playersProperties.find(p => p.userName == 'default')
		);
		playerProperties.userName = login;
		playersProperties.push(playerProperties);
		writePlayersProperties(playersProperties);

		io.to(socketId).emit('userLogin', login);
	}
}

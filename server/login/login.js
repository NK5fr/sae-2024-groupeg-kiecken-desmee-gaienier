import { io } from '../index.js';
import {
	readUsersProperties,
	writeUsersProperties,
} from '../managers/connexionManager.js';

export default function login(login, password, socketId) {
	const usersProperties = readUsersProperties();
	const userProperties = usersProperties.find(
		u => u.login === login && u.password === password
	);
	console.log(userProperties);
	if (userProperties && !userProperties.connexion) {
		userProperties.connexion = true;
		writeUsersProperties(usersProperties);
		io.to(socketId).emit('userLogin', userProperties.login);
	} else if (userProperties && userProperties.connexion) {
		io.to(socketId).emit('server send alert', 'Utilisateur déjà connecté');
	} else {
		io.to(socketId).emit(
			'server send alert',
			'Mot de passe ou login incorrect'
		);
	}
}

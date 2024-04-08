import { io } from '../index.js';
import {
	readUsersProperties,
	writeUsersProperties,
} from '../managers/connexionManager.js';

export default function logout(login, socketId) {
	const usersProperties = readUsersProperties();
	console.log(login);
	const userProperties = usersProperties.find(user => user.login == login);
	if (userProperties.connexion) {
		userProperties.connexion = false;
		writeUsersProperties(usersProperties);
		io.to(socketId).emit('changePath', '/login');
	} else {
		io.to(socketId).emit('server send alert', 'Utilisateur non trouvé');
	}
}

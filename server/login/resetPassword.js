import { io } from '../index.js';
import {
	readUsersProperties,
	writeUsersProperties,
} from '../managers/connexionManager.js';

export default function resetPassword(login, password, socketId) {
	const usersProperties = readUsersProperties();
	const userProperties = usersProperties.find(u => u.login === login);
	if (userProperties) {
		userProperties.password = password;
		writeUsersProperties(usersProperties);
		io.to(socketId).emit('changePath', '/login');
	} else {
		io.to(socketId).emit('server send alert', 'Utilisateur non trouvé');
	}
}

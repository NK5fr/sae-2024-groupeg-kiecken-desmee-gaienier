import { readFileSync, writeFileSync } from 'fs';
import { io } from '../index.js';
import { readUsersData, writeUsersData } from '../managers/connexionManager.js';

export default function logout(login, socketId) {
	let usersData = readUsersData();
	const user = usersData.find(user => user.login == login);
	if (user?.connexion) {
		user.connexion = false;
		writeUsersData(usersData);
		io.to(socketId).emit('changePath', '/login');
	} else {
		io.to(socketId).emit('serverAlert', 'Utilisateur non trouvé');
	}
}

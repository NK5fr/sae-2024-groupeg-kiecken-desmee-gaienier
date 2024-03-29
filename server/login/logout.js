import { readFileSync, writeFileSync } from 'fs';
import { io } from '../index.js';

export default function logout(login, socketId) {
	let usersData = JSON.parse(
		readFileSync('server/data/userData.json', 'utf-8')
	);
	const user = usersData.find(user => user.login == login);
	if (user?.connexion) {
		user.connexion = false;
		writeFileSync('server/data/userData.json', JSON.stringify(usersData));
		io.to(socketId).emit('changePath', '/login');
	} else {
		io.to(socketId).emit('serverAlert', 'Utilisateur non trouvé');
	}
}

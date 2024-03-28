import fs from 'fs';
import { io } from '../index.js';

export default function resetPassword(login, password, socketId) {
	const usersData = JSON.parse(
		fs.readFileSync('server/data/userData.json', 'utf8')
	);
	const user = usersData.find(user => user.login === login);
	if (user) {
		user.password = password;
		fs.writeFileSync('server/data/userData.json', JSON.stringify(usersData));
		io.to(socketId).emit('changePath', '/login');
	} else {
		io.to(socketId).emit('serverAlert', 'Utilisateur non trouvé');
	}
}
